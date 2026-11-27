"""Session endpoints: ending the current session (sign-out).

`GET /auth/me` already lives in `app/auth.py` (it is also how a signed-in owner's
session is validated on app load); this router adds the one endpoint this story
introduces, `POST /auth/logout`, which revokes the bearer token the caller sends so
it can no longer be used (AC-008). It shares the prefix `/auth` with `app.auth.router`
but owns a path of its own, so the two can be included side by side.
"""

from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.auth import current_session
from app.database import get_db
from app.errors import AUTH_SESSION_EXPIRED
from app.models import Session as SessionRecord

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={AUTH_SESSION_EXPIRED[0]: {"description": AUTH_SESSION_EXPIRED[1]}},
)
def logout(
    record: Annotated[SessionRecord, Depends(current_session)],
    session: Annotated[Session, Depends(get_db)],
) -> None:
    """Revoke the caller's session (AC-008): once marked, `current_session` refuses
    it the same way it refuses an idle-expired one (AUTH_SESSION_EXPIRED), so the
    caller must sign in again to reach their notes.
    """
    record.revoked_at = datetime.now(UTC)
    session.commit()
    return None
