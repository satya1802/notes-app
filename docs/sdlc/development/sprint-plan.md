# Sprint Plan

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start sprints -->
## Sprint 1: Sprint 1

Owner can securely sign in, stay signed in, and create notes; single-account constraint enforced

Capacity: 20 points · Committed: 20

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-001 | Story | Sign in with email and password | 8 | backend-agent | — |
| ↳ US-001-T1 | Task | Implement POST /auth/login with hashed password verification | — | backend-agent | — |
| ↳ US-001-T2 | Task | Add owner and session schema with single seeded owner account | — | backend-agent | — |
| ↳ US-001-T3 | Task | Build sign-in page | — | frontend-agent | — |
| ↳ US-001-T4 | Task | Add tests for login failure messaging and password hashing | — | qa-agent | — |
| US-002 | Story | No public registration or additional users | 2 | backend-agent | US-001 |
| US-003 | Story | Stay signed in across browsers and sign out | 5 | backend-agent | US-001 |
| US-004 | Story | Create a plain-text note | 5 | backend-agent | US-001 |

## Sprint 2: Sprint 2

Full note lifecycle (view, auto-save edit, delete) and a recency-sorted list with empty state

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-005 | Story | View a note | 3 | frontend-agent | US-004 |
| US-006 | Story | Edit a note with automatic saving | 8 | backend-agent | US-004 |
| ↳ US-006-T1 | Task | Implement PATCH /notes/{id} to update text and last-updated timestamp | — | backend-agent | — |
| ↳ US-006-T2 | Task | Add debounced auto-save in the note editor | — | frontend-agent | — |
| ↳ US-006-T3 | Task | Surface unsaved-change state on save failure | — | frontend-agent | — |
| ↳ US-006-T4 | Task | Add tests for auto-save success and failure paths | — | qa-agent | — |
| US-007 | Story | Delete a note | 3 | backend-agent | US-004 |
| US-008 | Story | See all notes in one list sorted by recent activity | 5 | frontend-agent | US-004 |

## Sprint 3: Sprint 3

Search, responsive layout, and verification of server-side storage and no-billing requirements

Capacity: 20 points · Committed: 14

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-009 | Story | Search notes by their text | 5 | backend-agent | US-008 |
| US-010 | Story | Use the app responsively on desktop and mobile browsers | 5 | frontend-agent | US-006, US-008 |
| US-011 | Story | Access server-stored notes from any browser | 3 | qa-agent | US-001, US-004 |
| US-012 | Story | Use the app free with no billing | 1 | qa-agent | — |

## Unscheduled

_Nothing unscheduled._
<!-- sdlc:auto:end sprints -->
