"""US-004: create a plain-text note.

Cases TC-014, TC-016, TC-017 and TC-019 against POST /notes (AC-010, AC-011, AC-012).
Only POST /notes is documented in frontend/src/api/openapi.json at the time these tests
were written: GET /notes and GET /notes/{id} are not yet in that spec, so the exact shape
of their responses is assumed from the test cases' own wording, following the precedent in
test_us002_single_owner.py. See the risk note on the report.
"""

from datetime import UTC, datetime

from fastapi.testclient import TestClient


def test_tc014_create_note_via_api_records_text_and_created_timestamp(
    auth_client: TestClient,
) -> None:
    before = datetime.now(UTC)

    create_response = auth_client.post("/notes", json={"text": "Buy milk and eggs"})

    assert create_response.status_code == 201
    created_note = create_response.json()
    assert created_note["text"] == "Buy milk and eggs"
    note_id = created_note["id"]
    assert note_id

    created_at = datetime.fromisoformat(created_note["createdAt"].replace("Z", "+00:00"))
    after = datetime.now(UTC)
    assert before <= created_at <= after

    get_response = auth_client.get(f"/notes/{note_id}")

    assert get_response.status_code == 200
    fetched_note = get_response.json()
    assert fetched_note["text"] == "Buy milk and eggs"
    assert fetched_note["createdAt"] == created_note["createdAt"]


def test_tc016_reject_note_creation_with_no_text(auth_client: TestClient) -> None:
    before_list = auth_client.get("/notes")
    assert before_list.status_code == 200
    before_count = len(before_list.json())

    create_response = auth_client.post("/notes", json={"text": ""})

    assert create_response.status_code == 400

    after_list = auth_client.get("/notes")
    assert after_list.status_code == 200
    assert len(after_list.json()) == before_count


def test_tc017_note_text_is_stored_verbatim_as_plain_text(auth_client: TestClient) -> None:
    text = "**Bold** _italic_ [ ] checklist item"

    create_response = auth_client.post("/notes", json={"text": text})

    assert create_response.status_code == 201
    created_note = create_response.json()
    assert created_note["text"] == text
    note_id = created_note["id"]

    get_response = auth_client.get(f"/notes/{note_id}")

    assert get_response.status_code == 200
    assert get_response.json()["text"] == text


def test_tc019_new_note_is_returned_in_the_notes_list(auth_client: TestClient) -> None:
    text = "Call plumber about leak"

    create_response = auth_client.post("/notes", json={"text": text})

    assert create_response.status_code == 201

    list_response = auth_client.get("/notes")

    assert list_response.status_code == 200
    notes = list_response.json()
    assert any(note["text"] == text for note in notes)
    assert notes[0]["text"] == text
