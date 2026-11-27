"""Unit tests for US-004: creating a plain-text note.

Runs against an isolated in-memory SQLite database rather than the PostgreSQL the
integration suite (tests/integration/) needs, so it stays independent of a running
database and exercises app.routers.notes's logic directly: no HTTP, no router dispatch.
"""

import secrets
from datetime import UTC, datetime, timedelta

import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.auth import ensure_user, find_user
from app.database import Base
from app.errors import NOTE_TEXT_REQUIRED
from app.models import Note
from app.routers.notes import create_note, create_note_for_owner
from app.schemas import NoteCreate, NoteRead

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


def _make_owner(session: Session) -> str:
    """Creates an owner account and returns its id."""
    email = f"owner-{secrets.token_hex(4)}@example.com"
    password = secrets.token_urlsafe()
    assert ensure_user(session, email=email, password=password, role=OWNER_ROLE) is True
    session.commit()
    return find_user(session, email).id


# AC-010: creating a note records the text and a created timestamp at that moment.


def test_ac010_creates_a_note_with_its_text(session: Session) -> None:
    owner_id = _make_owner(session)

    note = create_note_for_owner(session, owner_id=owner_id, text="Buy milk")

    assert isinstance(note, Note)
    assert note.text == "Buy milk"
    assert note.owner_id == owner_id


def test_ac010_records_a_created_timestamp_at_the_moment_of_creation(session: Session) -> None:
    owner_id = _make_owner(session)
    before = datetime.now(UTC)

    note = create_note_for_owner(session, owner_id=owner_id, text="Call the dentist")

    after = datetime.now(UTC)
    created_at = note.created_at if note.created_at.tzinfo else note.created_at.replace(tzinfo=UTC)
    assert before - timedelta(seconds=1) <= created_at <= after + timedelta(seconds=1)


def test_ac010_the_route_returns_the_created_note(session: Session) -> None:
    owner_id = _make_owner(session)

    response = create_note(
        NoteCreate(text="Pick up dry cleaning"),
        _FakeUser(owner_id),
        session,
    )

    assert isinstance(response, NoteRead)
    assert response.text == "Pick up dry cleaning"
    assert response.created_at is not None
    assert response.id


def test_ac010_two_notes_for_the_same_owner_get_distinct_ids(session: Session) -> None:
    owner_id = _make_owner(session)

    first = create_note_for_owner(session, owner_id=owner_id, text="First note")
    second = create_note_for_owner(session, owner_id=owner_id, text="Second note")

    assert first.id != second.id


def test_ac010_notes_are_tied_to_their_creating_owner_and_not_mixed_up(session: Session) -> None:
    owner_a = _make_owner(session)
    owner_b = _make_owner(session)

    note_a = create_note_for_owner(session, owner_id=owner_a, text="Owner A's note")
    note_b = create_note_for_owner(session, owner_id=owner_b, text="Owner B's note")

    assert note_a.owner_id == owner_a
    assert note_b.owner_id == owner_b
    assert note_a.owner_id != note_b.owner_id


# AC-011: only plain text is accepted - no formatting, checklist, image or
# attachment fields, and no empty note is created.


def test_ac011_blank_text_is_rejected_with_the_note_text_required_error(session: Session) -> None:
    owner_id = _make_owner(session)

    with pytest.raises(HTTPException) as excinfo:
        create_note_for_owner(session, owner_id=owner_id, text="")

    assert excinfo.value.status_code == NOTE_TEXT_REQUIRED[0]
    assert excinfo.value.detail == NOTE_TEXT_REQUIRED[1]


def test_ac011_whitespace_only_text_is_rejected(session: Session) -> None:
    owner_id = _make_owner(session)

    with pytest.raises(HTTPException) as excinfo:
        create_note_for_owner(session, owner_id=owner_id, text="   \n\t  ")

    assert excinfo.value.status_code == NOTE_TEXT_REQUIRED[0]


def test_ac011_a_rejected_note_is_never_persisted(session: Session) -> None:
    owner_id = _make_owner(session)

    with pytest.raises(HTTPException):
        create_note_for_owner(session, owner_id=owner_id, text="")

    assert session.query(Note).count() == 0


def test_ac011_the_note_request_model_carries_only_plain_text(session: Session) -> None:
    """The request body accepted by `POST /notes` has a `text` field and nothing
    that would let a caller send formatting, a checklist, an image or an
    attachment."""
    fields = set(NoteCreate.model_fields)

    assert fields == {"text"}


def test_ac011_the_note_response_model_carries_no_formatting_fields() -> None:
    fields = set(NoteRead.model_fields)

    assert fields == {"id", "text", "created_at"}


class _FakeUser:
    """Stands in for the signed-in `User` the `current_user` dependency would
    hand the route: only its `id` is used here."""

    def __init__(self, id: str) -> None:
        self.id = id
