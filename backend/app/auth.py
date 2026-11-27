"""Sign-in and session lifecycle: an email and a password in, an opaque session
token out (app/auth.py, US-001); the same token proves who is signed in until it
goes idle too long or is revoked by logout (app/routers/sessions.py, US-003).

Part of the scaffold's test kit, so the seed script, the signed-in test client and the
smoke check have a real login from the first commit. The frontend and the API are on
different origins once deployed, so the token travels in the response body and comes back
as `Authorization: Bearer <token>`, never as a cookie.

Each session is a row in the database (app.models.Session), not a signed claim: that is
what lets logout revoke one token without touching any other, and what lets an idle
deadline be pushed forward on every request a caller actually makes.
"""

import secrets
from datetime import UTC, datetime, timedelta
from typing import Annotated, Any
from uuid import uuid4

import bcrypt
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api_model import ApiModel
from app.database import get_db
from app.errors import AUTH_INVALID_CREDENTIALS, AUTH_SESSION_EXPIRED
from app.models import Session as SessionRecord
from app.models import User

ADMIN_ROLE = "admin"
USER_ROLE = "user"

# AC-007 / NFR-002: a session that sees no validated request for this long has gone
# idle and ends. Every call to `current_session` pushes the deadline forward
# (AC-006), so only idleness - never mere time passing while active - ends it.
SESSION_INACTIVITY_TIMEOUT = timedelta(minutes=30)

_bearer = HTTPBearer(auto_error=False)
# The users table may come from the approved data model, so its key is read, not assumed:
# an integer key is made by the database, a text key here.
_KEY_COLUMN = User.__mapper__.primary_key[0]
_KEY = User.__mapper__.get_property_by_column(_KEY_COLUMN).key

router = APIRouter(prefix="/auth", tags=["Auth"])


class LoginRequest(ApiModel):
    email: str
    password: str


class LoginResponse(ApiModel):
    # "token", not "access_token": one word reads the same in camelCase, and it is a name
    # the platform's smoke check looks for.
    token: str


class CurrentUser(ApiModel):
    id: str
    email: str
    role: str


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode(), hashed.encode())
    except ValueError:  # not a bcrypt hash
        return False


def find_user(session: Session, email: str) -> User | None:
    return session.scalars(select(User).where(User.email == email)).first()


def ensure_user(session: Session, *, email: str, password: str, role: str) -> bool:
    """Create the user unless one with this email exists. True when it was created."""
    if find_user(session, email) is not None:
        return False
    values: dict[str, Any] = {
        "email": email,
        "password_hash": hash_password(password),
        "role": role,
    }
    if _KEY_COLUMN.type.python_type is str:
        values[_KEY] = str(uuid4())
    session.add(User(**values))
    session.flush()
    return True


def issue_token(session: Session, user: User) -> SessionRecord:
    """Open a new session for `user` (AC-009): one row per token, so each browser
    or device that signs in gets its own, and revoking one never touches another."""
    now = datetime.now(UTC)
    record = SessionRecord(
        token=secrets.token_urlsafe(32),
        owner_id=str(getattr(user, _KEY)),
        created_at=now,
        last_active_at=now,
        expires_at=now + SESSION_INACTIVITY_TIMEOUT,
    )
    session.add(record)
    session.flush()
    return record


def _refused() -> HTTPException:
    # AC-007 / AC-008 / NFR-002: a missing, unknown, revoked or idle-expired token
    # are refused identically, so none of them hints at which one it was.
    return HTTPException(
        AUTH_SESSION_EXPIRED[0],
        AUTH_SESSION_EXPIRED[1],
        headers={"WWW-Authenticate": "Bearer"},
    )


def _aware(value: datetime) -> datetime:
    """`value`, guaranteed to carry a timezone.

    SQLite (the unit tests' engine) drops the timezone a `DateTime(timezone=True)`
    column was given, handing naive datetimes back; PostgreSQL (everywhere else)
    does not. Both stored this value as UTC, so a naive one is UTC too.
    """
    return value if value.tzinfo is not None else value.replace(tzinfo=UTC)


def current_session(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
    session: Annotated[Session, Depends(get_db)],
) -> SessionRecord:
    """The caller's session, refreshed for having been used just now.

    Missing, unknown, revoked (AC-008) or idle-expired (AC-007) tokens are all
    refused the same way: the caller must sign in again. A session that is still
    good has its idle deadline pushed forward (AC-006), so continuing to use the
    app keeps it open and only going quiet ends it.
    """
    if credentials is None:
        raise _refused()
    record = session.get(SessionRecord, credentials.credentials)
    now = datetime.now(UTC)
    if record is None or record.revoked_at is not None or _aware(record.expires_at) <= now:
        raise _refused()
    record.last_active_at = now
    record.expires_at = now + SESSION_INACTIVITY_TIMEOUT
    session.commit()
    return record


def current_user(
    record: Annotated[SessionRecord, Depends(current_session)],
    session: Annotated[Session, Depends(get_db)],
) -> User:
    """The signed-in user. Add `Depends(current_user)` to any route that needs one."""
    user = session.get(User, record.owner_id)
    if user is None:
        raise _refused()
    return user


@router.post(
    "/login",
    responses={AUTH_INVALID_CREDENTIALS[0]: {"description": AUTH_INVALID_CREDENTIALS[1]}},
)
def login(body: LoginRequest, session: Annotated[Session, Depends(get_db)]) -> LoginResponse:
    # AC-002 / NFR-003: an unknown email and a wrong password raise the exact same
    # error, so neither the status nor the message ever hints at which one it was.
    user = find_user(session, body.email.strip())
    if user is None or not verify_password(body.password, user.password_hash or ""):
        raise HTTPException(*AUTH_INVALID_CREDENTIALS)
    record = issue_token(session, user)
    session.commit()
    return LoginResponse(token=record.token)


@router.get(
    "/me",
    responses={AUTH_SESSION_EXPIRED[0]: {"description": AUTH_SESSION_EXPIRED[1]}},
)
def me(user: Annotated[User, Depends(current_user)]) -> CurrentUser:
    return CurrentUser(id=str(getattr(user, _KEY)), email=user.email, role=user.role)
