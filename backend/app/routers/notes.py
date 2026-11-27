"""Note endpoints: creating a plain-text note (US-004).

The only endpoint this story adds, `POST /notes`, creates a note for the signed-in
owner (`app/auth.py`) with a created timestamp recorded at the moment of creation
(AC-010). The note holds plain text only - there are no formatting, checklist,
image or attachment fields here or anywhere in its model (AC-011).
"""

from datetime import UTC, datetime
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import current_user
from app.database import get_db
from app.errors import AUTH_SESSION_EXPIRED, NOTE_TEXT_REQUIRED
from app.models import Note, User
from app.schemas import NoteCreate, NoteRead

router = APIRouter(tags=["Notes"])


def create_note_for_owner(db: Session, *, owner_id: str, text: str) -> Note:
    """The logic behind `POST /notes` (AC-010), independent of the HTTP layer so it
    can be unit tested directly: a blank or whitespace-only body is refused
    (AC-011 is a plain-text note, not an empty one), otherwise a note is created
    for `owner_id` with the text as given and a timestamp recorded now."""
    stripped = text.strip()
    if not stripped:
        raise HTTPException(NOTE_TEXT_REQUIRED[0], NOTE_TEXT_REQUIRED[1])
    note = Note(
        id=str(uuid4()),
        owner_id=owner_id,
        text=text,
        created_at=datetime.now(UTC),
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.post(
    "/notes",
    status_code=status.HTTP_201_CREATED,
    responses={
        NOTE_TEXT_REQUIRED[0]: {"description": NOTE_TEXT_REQUIRED[1]},
        AUTH_SESSION_EXPIRED[0]: {"description": AUTH_SESSION_EXPIRED[1]},
    },
)
def create_note(
    body: NoteCreate,
    user: Annotated[User, Depends(current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> NoteRead:
    note = create_note_for_owner(db, owner_id=user.id, text=body.text)
    return NoteRead.model_validate(note)
