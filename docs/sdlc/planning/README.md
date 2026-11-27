# Planning

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### EPIC-001 · approved · source: planning:EPIC-001

Owner authentication and access: private app protected by single-owner email-and-password login, with no public registration or multi-user support.

Sessions are secured server-side: they expire after inactivity, signing out ends them, and the owner's password is stored only as a hash. Assumption: access is protected by a single-owner email-and-password login with no other sign-in methods; no public user registration or multi-user support.

**Related:** US-001, US-002, US-003

### EPIC-002 · approved · source: planning:EPIC-002

Note management: the owner can create, view, edit, and delete plain-text notes, with automatic saving and created/last-updated timestamps.

Notes contain plain text only -- no rich formatting, checklists, images, or attachments (out of scope). Assumption: the owner can create, view, edit, and delete notes; edits save automatically and each note tracks a created and last-updated timestamp.

**Related:** US-004, US-005, US-006, US-007

### EPIC-003 · approved · source: planning:EPIC-003

Notes list, sorting & search: a single flat list sorted by most recent activity, with text search.

There are no folders, notebooks, or tags (out of scope). Assumption: sorting uses the created/last-updated timestamps; search matches on the note's text content.

**Related:** US-008, US-009

### EPIC-004 · approved · source: planning:EPIC-004

Responsive web platform & server storage: the app is a responsive web app on desktop and mobile with server-side note storage, free to the single owner.

There is no native mobile or desktop app, and no offline-first or local-only storage. Assumptions: responsive web only; server-side storage with no offline mode; no billing.

**Related:** US-010, US-011, US-012
<!-- sdlc:auto:end narrative -->
