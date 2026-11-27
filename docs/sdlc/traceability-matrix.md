# Traceability Matrix

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start legend -->
Built from recorded links, not written by a model: requirement key → plan item (`source_stable_key`) → development ticket (`stable_key`) → the ticket's test steps → the last live deployment that started after the work finished. **AC tests** counts the story's acceptance criteria that have a test case, and those whose test cases all passed in the latest finished E2E run. **Tests** counts the tests written for the story, and **Result** how many last passed, how many failed and when, as of this page's generation; the Documentation tab shows them live.
<!-- sdlc:auto:end legend -->

<!-- sdlc:auto:start matrix -->
| Requirement | Epic | Title | Plan items | Sprint | Design | Code | Commits | Ticket | Test step | Tests | Result | AC tests | Deployed |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| US-001 | EPIC-001 | Sign in with email and password | US-001, US-001-T1, US-001-T2, US-001-T3, US-001-T4 | 1 | POST /auth/login, api, db, owner, session, spa | — | — | not started | not run | 0 | No tests | 0/3 tested · 0/3 passing | — |
| US-002 | EPIC-001 | No public registration or additional users | US-002 | 1 | api, owner | — | — | not started | not run | 0 | No tests | 0/2 tested · 0/2 passing | — |
| US-003 | EPIC-001 | Stay signed in across browsers and sign out | US-003 | 1 | GET /auth/me, POST /auth/logout, api, owner, session, spa | — | — | not started | not run | 0 | No tests | 0/4 tested · 0/4 passing | — |
| US-004 | EPIC-002 | Create a plain-text note | US-004 | 1 | POST /notes, api, db, note, spa | — | — | not started | not run | 0 | No tests | 0/3 tested · 0/3 passing | — |
| US-005 | EPIC-002 | View a note | US-005 | 2 | GET /notes/{id}, api, note, spa | — | — | not started | not run | 0 | No tests | 0/2 tested · 0/2 passing | — |
| US-006 | EPIC-002 | Edit a note with automatic saving | US-006, US-006-T1, US-006-T2, US-006-T3, US-006-T4 | 2 | PATCH /notes/{id}, api, note, spa | — | — | not started | not run | 0 | No tests | 0/3 tested · 0/3 passing | — |
| US-007 | EPIC-002 | Delete a note | US-007 | 2 | DELETE /notes/{id}, api, note, spa | — | — | not started | not run | 0 | No tests | 0/2 tested · 0/2 passing | — |
| US-008 | EPIC-003 | See all notes in one list sorted by recent activity | US-008 | 2 | GET /notes, api, note, spa | — | — | not started | not run | 0 | No tests | 0/4 tested · 0/4 passing | — |
| US-009 | EPIC-003 | Search notes by their text | US-009 | 3 | GET /notes, api, db, note, spa | — | — | not started | not run | 0 | No tests | 0/3 tested · 0/3 passing | — |
| US-010 | EPIC-004 | Use the app responsively on desktop and mobile browsers | US-010 | 3 | spa | — | — | not started | not run | 0 | No tests | 0/3 tested · 0/3 passing | — |
| US-011 | EPIC-004 | Access server-stored notes from any browser | US-011 | 3 | DELETE /notes/{id}, GET /notes, PATCH /notes/{id}, POST /notes, api, db, note | — | — | not started | not run | 0 | No tests | 0/2 tested · 0/2 passing | — |
| US-012 | EPIC-004 | Use the app free with no billing | US-012 | 3 | spa | — | — | not started | not run | 0 | No tests | 0/1 tested · 0/1 passing | — |
<!-- sdlc:auto:end matrix -->
