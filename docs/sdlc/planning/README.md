# Planning

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### EPIC-001 · approved · source: requirements:EPIC-001

Secures the app behind a single-owner email-and-password login with no public registration or multi-user support, with server-secured sessions.

Goal: the app is private to a single owner, protected by email-and-password sign-in only (no other sign-in methods, no public registration, no multi-user support). Sessions are secured server-side: they expire after inactivity, signing out ends them, and the password is stored only as a hash. Stories: US-001, US-002, US-003.

**Related:** US-001, US-002, US-003

### EPIC-002 · approved · source: requirements:EPIC-002

Covers the full lifecycle of plain-text notes: create, view, edit with auto-save, and delete.

Goal: the owner can create, view, edit, and delete plain-text notes. Notes are plain text only -- no rich formatting, checklists, images, or attachments (explicitly out of scope). Edits save automatically, and each note tracks created and last-updated timestamps. Stories: US-004, US-005, US-006, US-007.

**Related:** US-004, US-005, US-006, US-007

### EPIC-003 · approved · source: requirements:EPIC-003

Presents all notes in a single recency-sorted list with a text search box, and no folders/notebooks/tags.

Goal: notes are shown in one flat list sorted by most recent activity (last-updated timestamp first), with search matching on note text content. Folders, notebooks, and tags are out of scope. Stories: US-008, US-009.

**Related:** US-008, US-009

### EPIC-004 · approved · source: requirements:EPIC-004

Delivers the app as a responsive web application with server-side storage and no billing.

Goal: the app is a responsive web application for desktop and mobile browsers (no native app), with notes stored server-side (no offline-first or local-only storage) so they're available from any browser, and free of charge with no payments, billing, or subscriptions. Stories: US-010, US-011, US-012.

**Related:** US-010, US-011, US-012

### SPRINT-1 · approved · source: planning:Sprint 1

First sprint focused on secure sign-in, persistent sessions, and enforcing the single-account constraint while beginning note creation.

Goal: Owner can securely sign in, stay signed in, and create notes; single-account constraint enforced. Capacity: 20 points. Plan items: EPIC-001 (epic, unassigned), US-001 Sign in with email and password (8 points, backend-agent) with tasks US-001-T1 Implement POST /auth/login with hashed password verification (backend-agent), US-001-T2 Add owner and session schema with single seeded owner account (backend-agent), US-001-T3 Build sign-in page (frontend-agent), US-001-T4 Add tests for login failure messaging and password hashing (qa-agent); US-002 No public registration or additional users (2 points, backend-agent); US-003 Stay signed in across browsers and sign out (5 points, backend-agent).

**Related:** EPIC-001, US-001, US-002, US-003

### SPRINT-2 · approved · source: planning:Sprint 2

Second sprint delivers the full note lifecycle (view, auto-save edit, delete) plus a recency-sorted list with empty state.

Goal: Full note lifecycle (view, auto-save edit, delete) and a recency-sorted list with empty state. Capacity: 20 points. Plan items: EPIC-002 (epic, unassigned); US-004 Create a plain-text note (5 points, backend-agent); US-005 View a note (3 points, frontend-agent); US-006 Edit a note with automatic saving (8 points, backend-agent) with tasks US-006-T1 Implement PATCH /notes/{id} to update text and last-updated timestamp (backend-agent), US-006-T2 Add debounced auto-save in the note editor (frontend-agent), US-006-T3 Surface unsaved-change state on save failure (frontend-agent), US-006-T4 Add tests for auto-save success and failure paths (qa-agent); US-007 Delete a note (3 points, backend-agent).

**Related:** EPIC-002, US-004, US-005, US-006, US-007

### SPRINT-3 · approved · source: planning:Sprint 3

Third sprint adds search, responsive layout, and verifies server-side storage and no-billing requirements.

Goal: Search, responsive layout, and verification of server-side storage and no-billing requirements. Capacity: 20 points. Plan items: EPIC-003 (epic, unassigned); US-008 See all notes in one list sorted by recent activity (5 points, frontend-agent); US-009 Search notes by their text (5 points, backend-agent); EPIC-004 (epic, unassigned); US-010 Use the app responsively on desktop and mobile browsers (5 points, frontend-agent); US-011 Access server-stored notes from any browser (3 points, qa-agent); US-012 Use the app free with no billing (1 point, qa-agent).

**Related:** EPIC-003, EPIC-004, US-008, US-009, US-010, US-011, US-012
<!-- sdlc:auto:end narrative -->
