"""US-003: session persistence, inactivity expiry, sign-out and cross-device sign-in.

Cases TC-022, TC-024, TC-026, TC-028, TC-030. The cases give alice@example.com and a
literal password as preconditions and test data; the tests instead make a fresh owner
account with a generated email and a `secrets.token_urlsafe()` password, as the kit's own
tests do (see test_auth.py, test_us002_single_owner.py), since a password is never written
as a literal here.
"""

import secrets
from datetime import UTC, datetime, timedelta
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy import MetaData
from sqlalchemy.orm import Session

from app.auth import ADMIN_ROLE, ensure_user


def _email() -> str:
    """A new address per test: the database may already hold users the app seeded."""
    return f"us003-{uuid4().hex[:12]}@example.com"


def _expire_every_session(db_session: Session) -> bool:
    """Back-dates any expiry-like column found by reflection, so a session already issued
    looks as stale as one that has been idle beyond its inactivity period.

    Found by reflecting the schema the migrations built rather than importing the session
    model, in keeping with testing the app from its contract, never its code (the same way
    test_auth.py's `_stored_password_value` locates the password column). Returns whether
    any such column was found, so the test can explain itself if this heuristic ever stops
    matching the real schema.
    """
    metadata = MetaData()
    metadata.reflect(bind=db_session.get_bind())
    past = datetime.now(UTC) - timedelta(days=1)
    touched = False
    for table in metadata.sorted_tables:
        for column in table.c:
            name = column.name.lower()
            if "expir" in name or name in {"valid_until", "exp"}:
                db_session.execute(table.update().values({column.name: past}))
                touched = True
    if touched:
        db_session.flush()
    return touched


def test_tc022_active_session_keeps_access_to_notes(
    client: TestClient, db_session: Session
) -> None:
    email = _email()
    password = secrets.token_urlsafe()
    ensure_user(db_session, email=email, password=password, role=ADMIN_ROLE)

    login_response = client.post("/auth/login", json={"email": email, "password": password})
    assert login_response.status_code == 200
    token = login_response.json()["token"]
    assert token
    headers = {"Authorization": f"Bearer {token}"}

    me_response = client.get("/auth/me", headers=headers)
    assert me_response.status_code == 200
    assert me_response.json()["email"] == email

    notes_response = client.get("/notes", headers=headers)
    assert notes_response.status_code == 200
    assert isinstance(notes_response.json(), list)

    second_me_response = client.get("/auth/me", headers=headers)
    assert second_me_response.status_code == 200
    assert second_me_response.json()["email"] == email


def test_tc024_session_rejected_after_inactivity_expiry(
    client: TestClient, db_session: Session
) -> None:
    email = _email()
    password = secrets.token_urlsafe()
    ensure_user(db_session, email=email, password=password, role=ADMIN_ROLE)

    login_response = client.post("/auth/login", json={"email": email, "password": password})
    assert login_response.status_code == 200
    token = login_response.json()["token"]
    assert token

    expired = _expire_every_session(db_session)
    assert expired, (
        "no expiry-like column was found by reflecting the schema, so inactivity could not "
        "be simulated by back-dating it; see the risk note on the report"
    )

    headers = {"Authorization": f"Bearer {token}"}
    me_response = client.get("/auth/me", headers=headers)
    assert me_response.status_code == 401

    notes_response = client.get("/notes", headers=headers)
    assert notes_response.status_code == 401


def test_tc026_sign_out_revokes_the_session_token(client: TestClient, db_session: Session) -> None:
    email = _email()
    password = secrets.token_urlsafe()
    ensure_user(db_session, email=email, password=password, role=ADMIN_ROLE)

    login_response = client.post("/auth/login", json={"email": email, "password": password})
    assert login_response.status_code == 200
    token = login_response.json()["token"]
    assert token
    headers = {"Authorization": f"Bearer {token}"}

    logout_response = client.post("/auth/logout", headers=headers)
    assert logout_response.status_code == 200

    me_response = client.get("/auth/me", headers=headers)
    assert me_response.status_code == 401

    notes_response = client.get("/notes", headers=headers)
    assert notes_response.status_code == 401


def test_tc028_same_notes_reachable_from_a_new_session(
    client: TestClient, db_session: Session
) -> None:
    email = _email()
    password = secrets.token_urlsafe()
    ensure_user(db_session, email=email, password=password, role=ADMIN_ROLE)
    note_text = "Meeting notes 10am"

    login_a = client.post("/auth/login", json={"email": email, "password": password})
    assert login_a.status_code == 200
    token_a = login_a.json()["token"]
    assert token_a

    create_response = client.post(
        "/notes",
        json={"text": note_text},
        headers={"Authorization": f"Bearer {token_a}"},
    )
    assert create_response.status_code == 201

    login_b = client.post("/auth/login", json={"email": email, "password": password})
    assert login_b.status_code == 200
    token_b = login_b.json()["token"]
    assert token_b
    assert token_b != token_a

    notes_response = client.get("/notes", headers={"Authorization": f"Bearer {token_b}"})
    assert notes_response.status_code == 200
    notes = notes_response.json()
    assert any(note.get("text") == note_text for note in notes)


def test_tc030_wrong_password_from_a_different_device_is_rejected(
    client: TestClient, db_session: Session
) -> None:
    email = _email()
    password = secrets.token_urlsafe()
    ensure_user(db_session, email=email, password=password, role=ADMIN_ROLE)
    wrong_password = secrets.token_urlsafe()

    login_response = client.post("/auth/login", json={"email": email, "password": wrong_password})
    assert login_response.status_code == 401
    body = login_response.json()
    assert "token" not in body
    message = str(body).lower()
    assert "email" not in message
    assert "password" not in message

    notes_response = client.get("/notes")
    assert notes_response.status_code == 401
