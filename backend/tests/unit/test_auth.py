"""Unit tests for US-001: owner login logic and password hashing.

Runs against an isolated in-memory SQLite database rather than the PostgreSQL the
integration suite (tests/integration/) needs, so it stays independent of a running
database and exercises app.auth's logic directly: no HTTP, no router.
"""

import secrets

import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.auth import (
    LoginRequest,
    LoginResponse,
    ensure_user,
    find_user,
    hash_password,
    login,
    verify_password,
)
from app.database import Base
from app.errors import AUTH_INVALID_CREDENTIALS

OWNER_ROLE = "owner"


@pytest.fixture
def session():
    """A fresh schema in memory, dropped with the engine when the test ends."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    with Session(engine) as db_session:
        yield db_session
    engine.dispose()


def _make_owner(session: Session, password: str) -> str:
    """Creates an owner account with the given password, returns its email."""
    email = f"owner-{secrets.token_hex(4)}@example.com"
    assert ensure_user(session, email=email, password=password, role=OWNER_ROLE) is True
    session.commit()
    return email


# AC-001: correct credentials sign the owner in and hand back a session token.


def test_ac001_correct_credentials_sign_in_and_receive_a_token(session: Session) -> None:
    password = secrets.token_urlsafe()
    email = _make_owner(session, password)

    response = login(LoginRequest(email=email, password=password), session)

    assert isinstance(response, LoginResponse)
    assert isinstance(response.token, str)
    assert response.token != ""


def test_ac001_a_second_owner_account_does_not_interfere(session: Session) -> None:
    password_one = secrets.token_urlsafe()
    password_two = secrets.token_urlsafe()
    email_one = _make_owner(session, password_one)
    _make_owner(session, password_two)

    response = login(LoginRequest(email=email_one, password=password_one), session)

    assert response.token


# AC-002 / NFR-003: a mismatch is refused with one generic message, whichever field
# was wrong, so the caller cannot tell which.


def test_ac002_wrong_password_is_refused_with_the_generic_message(session: Session) -> None:
    password = secrets.token_urlsafe()
    email = _make_owner(session, password)

    with pytest.raises(HTTPException) as exc_info:
        login(LoginRequest(email=email, password=secrets.token_urlsafe()), session)

    assert exc_info.value.status_code == AUTH_INVALID_CREDENTIALS[0]
    assert exc_info.value.detail == AUTH_INVALID_CREDENTIALS[1]


def test_ac002_unknown_email_is_refused_with_the_generic_message(session: Session) -> None:
    _make_owner(session, secrets.token_urlsafe())

    with pytest.raises(HTTPException) as exc_info:
        login(LoginRequest(email="nobody@example.com", password=secrets.token_urlsafe()), session)

    assert exc_info.value.status_code == AUTH_INVALID_CREDENTIALS[0]
    assert exc_info.value.detail == AUTH_INVALID_CREDENTIALS[1]


def test_ac002_wrong_password_and_unknown_email_are_indistinguishable(session: Session) -> None:
    """Neither the status nor the message may hint at which field was wrong."""
    password = secrets.token_urlsafe()
    email = _make_owner(session, password)

    with pytest.raises(HTTPException) as wrong_password:
        login(LoginRequest(email=email, password=secrets.token_urlsafe()), session)
    with pytest.raises(HTTPException) as unknown_email:
        login(LoginRequest(email="nobody@example.com", password=secrets.token_urlsafe()), session)

    assert wrong_password.value.status_code == unknown_email.value.status_code
    assert wrong_password.value.detail == unknown_email.value.detail


def test_ac002_an_empty_password_is_refused_not_an_error(session: Session) -> None:
    email = _make_owner(session, secrets.token_urlsafe())

    with pytest.raises(HTTPException) as exc_info:
        login(LoginRequest(email=email, password=""), session)

    assert exc_info.value.status_code == AUTH_INVALID_CREDENTIALS[0]


# AC-003 / NFR-001: the password is stored, handled and checked only as a hash,
# never kept or produced as plain text.


def test_ac003_the_stored_value_is_a_bcrypt_hash_not_the_plain_password(
    session: Session,
) -> None:
    password = secrets.token_urlsafe()
    email = _make_owner(session, password)

    user = find_user(session, email)

    assert user is not None
    assert user.password_hash != password
    assert password not in user.password_hash
    assert user.password_hash.startswith(("$2a$", "$2b$", "$2y$"))


def test_ac003_hash_password_never_returns_the_plain_value() -> None:
    password = secrets.token_urlsafe()

    hashed = hash_password(password)

    assert hashed != password
    assert password not in hashed
    assert hashed.startswith(("$2a$", "$2b$", "$2y$"))


def test_ac003_the_same_password_hashes_differently_each_time() -> None:
    """A fresh salt per hash: the stored value cannot be used to recover or match
    another record by comparing bytes, only through verify_password."""
    password = secrets.token_urlsafe()

    assert hash_password(password) != hash_password(password)


def test_ac003_verify_password_checks_the_hash_without_exposing_it() -> None:
    password = secrets.token_urlsafe()
    hashed = hash_password(password)

    assert verify_password(password, hashed) is True
    assert verify_password(secrets.token_urlsafe(), hashed) is False


def test_ac003_verify_password_rejects_a_value_that_is_not_a_bcrypt_hash() -> None:
    assert verify_password(secrets.token_urlsafe(), "not-a-bcrypt-hash") is False


def test_ac003_the_login_response_carries_no_password_field() -> None:
    assert set(LoginResponse.model_fields) == {"token"}


def test_ac003_the_issued_token_never_contains_the_plain_password(session: Session) -> None:
    password = secrets.token_urlsafe()
    email = _make_owner(session, password)

    response = login(LoginRequest(email=email, password=password), session)

    assert password not in response.token
