"""US-002: no public registration, notes private to the single owner.

Cases TC-002, TC-004, TC-005 and TC-006. The story adds no endpoint of its own; the cases
prove the behaviour through /auth/login, /auth/me, /notes and /auth/logout. Only
/auth/login and /auth/me are documented in frontend/src/api/openapi.json at the time these
tests were written: /notes and /auth/logout are not yet in that spec, so the exact shape of
their responses (the note's field names, the logout call's method and status) is assumed
from the test cases' own wording. See the risk note on the report.
"""

import secrets
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.auth import ADMIN_ROLE, ensure_user


def _email() -> str:
    """A new address per test: the database may already hold users the app seeded."""
    return f"us002-{uuid4().hex[:12]}@example.com"


def test_tc002_login_with_an_unregistered_email_does_not_create_an_account(
    client: TestClient,
) -> None:
    response = client.post(
        "/auth/login",
        json={"email": "intruder@example.com", "password": "GuessedPass1!"},
    )

    assert response.status_code == 401
    assert "token" not in response.json()

    me_response = client.get("/auth/me")

    assert me_response.status_code == 401


def test_tc004_notes_created_are_tied_only_to_the_signed_in_owners_session(
    client: TestClient, db_session: Session
) -> None:
    email = _email()
    password = secrets.token_urlsafe()
    ensure_user(db_session, email=email, password=password, role=ADMIN_ROLE)

    login_response = client.post("/auth/login", json={"email": email, "password": password})
    assert login_response.status_code == 200
    token = login_response.json()["token"]
    assert token

    note_text = "Reminder: pay electricity bill"
    create_response = client.post(
        "/notes",
        json={"text": note_text},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert create_response.status_code in (200, 201)
    created_note = create_response.json()
    assert created_note.get("createdAt")

    list_response = client.get("/notes", headers={"Authorization": f"Bearer {token}"})

    assert list_response.status_code == 200
    notes = list_response.json()
    assert any(note.get("text") == note_text for note in notes)


def test_tc005_notes_are_not_reachable_without_the_owners_authenticated_session(
    client: TestClient, db_session: Session
) -> None:
    email = _email()
    password = secrets.token_urlsafe()
    ensure_user(db_session, email=email, password=password, role=ADMIN_ROLE)
    setup_login = client.post("/auth/login", json={"email": email, "password": password})
    setup_token = setup_login.json()["token"]
    client.post(
        "/notes",
        json={"text": "Reminder: pay electricity bill"},
        headers={"Authorization": f"Bearer {setup_token}"},
    )

    no_token_response = client.get("/notes")
    assert no_token_response.status_code == 401

    login_response = client.post("/auth/login", json={"email": email, "password": password})
    assert login_response.status_code == 200
    token = login_response.json()["token"]
    assert token

    logout_response = client.post("/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert logout_response.status_code in (200, 204)

    revoked_response = client.get("/notes", headers={"Authorization": f"Bearer {token}"})
    assert revoked_response.status_code == 401


def test_tc006_repeated_attempts_to_create_a_second_account_never_succeed(
    client: TestClient, db_session: Session
) -> None:
    owner_email = _email()
    owner_password = secrets.token_urlsafe()
    ensure_user(db_session, email=owner_email, password=owner_password, role=ADMIN_ROLE)

    new_user_email = _email()
    new_user_password = "NewUserPass1!"

    first_attempt = client.post(
        "/auth/login", json={"email": new_user_email, "password": new_user_password}
    )
    assert first_attempt.status_code == 401
    assert "token" not in first_attempt.json()

    second_attempt = client.post(
        "/auth/login", json={"email": new_user_email, "password": new_user_password}
    )
    assert second_attempt.status_code == 401
    assert second_attempt.json() == first_attempt.json()

    owner_login = client.post(
        "/auth/login", json={"email": owner_email, "password": owner_password}
    )
    assert owner_login.status_code == 200
    token = owner_login.json()["token"]
    assert token

    notes_response = client.get("/notes", headers={"Authorization": f"Bearer {token}"})

    assert notes_response.status_code == 200
    assert isinstance(notes_response.json(), list)
