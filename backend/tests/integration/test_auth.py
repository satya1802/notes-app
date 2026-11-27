"""Sign-in, proved on the test database. Part of the scaffold's test kit.

The `auth_client` fixture (tests/conftest.py) signs in the same way, so a failure here
explains a failure in every test that uses it.
"""

import logging
import secrets
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy import MetaData, select
from sqlalchemy.orm import Session

from app.auth import ADMIN_ROLE, USER_ROLE, ensure_user
from app.seed import seed


def test_a_signed_in_user_reads_their_profile(auth_client: TestClient) -> None:
    response = auth_client.get("/auth/me")

    assert response.status_code == 200
    assert response.json()["role"] == USER_ROLE


def test_without_a_token_the_profile_is_refused(client: TestClient) -> None:
    assert client.get("/auth/me").status_code == 401


def _email() -> str:
    """A new address per test: the database may already hold users the app seeded."""
    return f"kit-{uuid4().hex[:12]}@example.com"


def test_a_wrong_password_is_refused(client: TestClient, db_session: Session) -> None:
    email = _email()
    ensure_user(db_session, email=email, password=secrets.token_urlsafe(), role=USER_ROLE)

    response = client.post(
        "/auth/login", json={"email": email, "password": secrets.token_urlsafe()}
    )

    assert response.status_code == 401


def test_the_seed_makes_its_users_once(db_session: Session) -> None:
    settings = {
        "BOOTSTRAP_ADMIN_EMAIL": _email(),
        "BOOTSTRAP_ADMIN_PASSWORD": secrets.token_urlsafe(),
        "SMOKE_TEST_EMAIL": _email(),
        "SMOKE_TEST_PASSWORD": secrets.token_urlsafe(),
    }

    assert seed(db_session, settings) == 2
    assert seed(db_session, settings) == 0


def _stored_password_value(db_session: Session, email: str) -> object:
    """Whatever raw value is held for `email` in a password-like column.

    Found by reflecting the schema the migrations built, never by importing the
    backend's own model classes: this test reads only the database, not the code.
    """
    metadata = MetaData()
    metadata.reflect(bind=db_session.get_bind())
    for table in metadata.sorted_tables:
        if "email" not in table.c:
            continue
        row = db_session.execute(select(table).where(table.c.email == email)).mappings().first()
        if row is None:
            continue
        for column_name, value in row.items():
            if "password" in column_name.lower():
                return value
    raise AssertionError(f"No table with an email column and a password column held {email}")


def test_tc007_login_with_correct_credentials_returns_a_session(
    client: TestClient, db_session: Session
) -> None:
    email = _email()
    password = "Str0ngP@ss1"
    ensure_user(db_session, email=email, password=password, role=ADMIN_ROLE)

    login_response = client.post("/auth/login", json={"email": email, "password": password})

    assert login_response.status_code == 200
    token = login_response.json()["token"]
    assert token

    me_response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})

    assert me_response.status_code == 200
    assert me_response.json()["email"] == email


def test_tc009_login_with_wrong_password_is_rejected_with_a_generic_message(
    client: TestClient, db_session: Session
) -> None:
    email = _email()
    ensure_user(db_session, email=email, password="Str0ngP@ss1", role=ADMIN_ROLE)

    response = client.post("/auth/login", json={"email": email, "password": "WrongPass1!"})

    assert response.status_code == 401
    body = response.json()
    assert "token" not in body
    message = str(body).lower()
    assert "email" not in message
    assert "password" not in message


def test_tc010_login_with_unknown_email_is_rejected_with_the_same_generic_message(
    client: TestClient, db_session: Session
) -> None:
    known_email = _email()
    password = "Str0ngP@ss1"
    ensure_user(db_session, email=known_email, password=password, role=ADMIN_ROLE)
    unknown_email = _email()

    wrong_password_response = client.post(
        "/auth/login", json={"email": known_email, "password": "WrongPass1!"}
    )
    unknown_email_response = client.post(
        "/auth/login", json={"email": unknown_email, "password": password}
    )

    assert wrong_password_response.status_code == 401
    assert unknown_email_response.status_code == 401
    assert unknown_email_response.json() == wrong_password_response.json()
    assert "token" not in unknown_email_response.json()
    message = str(unknown_email_response.json()).lower()
    assert "email" not in message
    assert "password" not in message


def test_tc012_owner_password_is_stored_only_as_a_hash(
    client: TestClient, db_session: Session, caplog: object
) -> None:
    email = _email()
    password = "Str0ngP@ss1"
    ensure_user(db_session, email=email, password=password, role=ADMIN_ROLE)

    with caplog.at_level(logging.DEBUG):
        response = client.post("/auth/login", json={"email": email, "password": password})

    assert response.status_code == 200
    body = response.json()
    assert body == {"token": body["token"]}
    assert password not in str(body)

    stored_value = _stored_password_value(db_session, email)
    assert stored_value != password
    assert password not in str(stored_value)

    assert password not in caplog.text
