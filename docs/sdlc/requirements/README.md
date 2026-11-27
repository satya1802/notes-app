# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-STACK · approved · source: requirements:stack

Technology stack approved by the product owner for a lightweight, single-owner notes app.

- Backend: FastAPI 0.115 -- small, single-person-maintainable service handling login plus create/fetch/update/delete/search of notes; talks directly to React and PostgreSQL.
- Cloud: AWS -- hosts the FastAPI service and managed PostgreSQL in one place with automatic backups, giving always-available access.
- Database: PostgreSQL 16 -- stores note records (text, created date, last-updated date) reliably; built-in full-text search covers the search box with no extra search engine.
- Frontend: React 19 -- single responsive page (notes list, search box, auto-saving editor) that updates live without reloads, from one codebase for desktop and mobile.
Design must use exactly these; no substitutions.

### REQ-SCOPE · approved · source: requirements:scope

Defines what the lightweight delivery does and does not cover.

In scope: single-owner login to a private app; create/view/edit (auto-save)/delete a plain-text note; single list of notes sorted by most recent activity; email-and-password as the only sign-in method; notes kept server-side and available from any browser; free to the single owner with no billing.
Out of scope -- not designed or built: rich text formatting, checklists, images, and file attachments in notes; folders/notebooks and tags/labels for organising notes; public user registration / multi-tenant sign-up.

### REQ-FEAT-SIGNIN · approved · source: requirements:feature:Sign-in & accounts

Email-and-password sign-in for the single owner account, with persistent sessions and sign-out.

- Sign in with email and password: owner signs in from the sign-in page; only the correct email and password for the single owner account are accepted; success leads to the notes list.
- Single account, no public sign-up: only one owner account exists; no registration/sign-up option; no additional accounts can be created; all notes belong to the one owner.
- Stay signed in and sign out: owner stays signed in without re-entering password while active; session ends on sign-out, after which sign-in is required again to reach notes.

**Related:** NFR-001, NFR-002, NFR-003

### REQ-FEAT-NOTES · approved · source: requirements:feature:Notes

Core note lifecycle: create, view, edit with auto-save, and delete plain-text notes.

- Create a plain-text note: owner enters text; note saved with a created timestamp and appears in the list; only plain text accepted, no formatting/checklist/image/attachment controls.
- View a note: owner selects a note to open and read its full content as saved plain text, no formatting applied.
- Edit a note with automatic saving: edits save automatically on pause or navigating away, no save button; last-updated timestamp set to time of change; if a save fails, owner is shown the change was not saved so it is not silently lost.
- Delete a note: owner deletes a note after confirming; it is removed from the list and does not reappear on reload or from another browser.

**Related:** NFR-006

### REQ-FEAT-LISTSEARCH · approved · source: requirements:feature:Notes list & search

Single sorted list of all notes plus a text search box.

- Single list sorted by recent activity: all notes in one flat list, most recently created/updated first; a note moves to the top on creation or edit; no folders, notebooks, or tags; empty state invites creating the first note when none exist.
- Search notes by their text: typing a term filters the list to matching notes; a clear message appears when nothing matches; clearing the search box restores the full list sorted by recent activity.

### REQ-FEAT-PLATFORM · approved · source: requirements:feature:Platform & access

Responsive, browser-only access with server-side storage and no billing.

- Responsive web layout: single web page adapting to desktop and mobile, keeping list/editor/actions usable on each; browser-only, no native app to install.
- Server-stored notes on any browser: creating/editing/deleting a note saves to the server; signing in from a different browser or device shows the same notes.
- Free with no billing: owner uses every feature with no payment, billing, or subscription ever requested.

**Related:** NFR-005, NFR-007, NFR-008

### NFR-001 · approved · source: requirements:NFR-001

Security: password stored only as a hash.

The owner's password is stored only as a hash and never kept or shown as plain text anywhere, including in logs.

**Related:** REQ-FEAT-SIGNIN

### NFR-002 · approved · source: requirements:NFR-002

Security: sessions expire on inactivity and on sign-out.

A signed-in session ends after a period of inactivity and when the owner signs out; the owner must sign in again to reach their notes afterward.

**Related:** REQ-FEAT-SIGNIN

### NFR-003 · approved · source: requirements:NFR-003

Security: sign-in failures do not reveal which field was wrong.

When sign-in fails, the owner sees a generic message that the credentials are incorrect, without revealing whether the email or the password was wrong.

**Related:** REQ-FEAT-SIGNIN

### NFR-004 · approved · source: requirements:NFR-004

Privacy: notes are private to the single owner.

All notes belong to the one owner account and are reachable only after signing in; there is no sharing, collaboration, or other account that can see them.

**Related:** REQ-FEAT-SIGNIN, REQ-FEAT-NOTES

### NFR-005 · approved · source: requirements:NFR-005

Availability: notes available from any browser, backed by automatic backups.

Notes are stored server-side and remain available whenever the owner signs in from any browser or device; automatic database backups ensure the notes survive.

**Related:** REQ-FEAT-PLATFORM

### NFR-006 · approved · source: requirements:NFR-006

Usability: no silently lost edits if auto-save fails.

Edits save automatically without a save button; if a save does not complete, the owner is clearly shown that the change was not saved so the edit is not silently lost.

**Related:** REQ-FEAT-NOTES

### NFR-007 · approved · source: requirements:NFR-007

Usability: mobile layout usable without horizontal scrolling.

On a mobile browser the layout adapts to the smaller screen and all actions remain usable without horizontal scrolling.

**Related:** REQ-FEAT-PLATFORM

### NFR-008 · approved · source: requirements:NFR-008

Compatibility: runs in desktop and mobile browsers with no install.

The app works through a web browser on both desktop and mobile with no native mobile or desktop app required to install.

**Related:** REQ-FEAT-PLATFORM
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v1  
**Delivery scope:** lightweight  
**Approved:** 2026-11-27

**Capabilities in scope:** Single-owner login to the private app, Create a plain-text note, View a note, Edit a note with automatic saving, Delete a note, Single list of notes sorted by most recent activity, Email-and-password as the only sign-in method, Notes kept on the server, available from any browser, Free to the single owner, with no billing

**Approved technology stack:**

| Layer | Choice | Rationale |
|---|---|---|
| backend | FastAPI | The server's whole job is small and clear: check the one owner's login, then create, fetch, update, delete and search their notes. FastAPI is a lightweight Python service that does this with very little code, so a single person can build and maintain it, and it speaks directly to React and PostgreSQL for the auto-save and search you described. |
| cloud | AWS | You need the app reachable from any browser, with the notes stored server-side and backed up. AWS hosts the FastAPI service and managed PostgreSQL database in one place with automatic backups, so the owner's notes survive and are available wherever they log in — exactly the always-available behaviour you confirmed. |
| database | PostgreSQL | Your notes are simple records with text, a created date and a last-updated date, sorted by recent activity and found by searching their text. PostgreSQL stores exactly that reliably, keeps the server-side copy available from any browser the owner logs in from, and its built-in full-text search covers the search box without adding any extra search engine. |
| frontend | React | Your app is one responsive web page the owner uses on phone and laptop: a list of notes, a search box, and an editor that saves as they type. React handles exactly this kind of live, auto-saving screen that updates without reloading the page, and it adapts cleanly to both desktop and mobile widths from a single codebase, which is all you asked for. |
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start epics -->
## EPIC-001: Owner Authentication & Access

The app is private to a single owner, protected by an email-and-password login. There is no public registration or multi-user support; email-and-password is the only sign-in method. Sessions are secured server-side: they expire after inactivity, signing out ends them, and the owner's password is stored only as a hash. Assumption: access is protected by a single-owner email-and-password login with no other sign-in methods; no public user registration or multi-user support.

### US-001: Sign in with email and password

**Priority:** critical

> As a owner, I want to sign in with my email address and password, so that only I can reach my private notes.

| ID | Given | When | Then |
|---|---|---|---|
| AC-001 | I am the owner on the sign-in page | I enter my correct email address and password and submit | I am signed in and taken to my list of notes |
| AC-002 | I am on the sign-in page | I enter an email or password that does not match the owner account | I am not signed in and I see a message that the credentials are incorrect, without revealing which field was wrong |
| AC-003 | the owner account is being set up | the owner password is stored | it is stored as a hash and never kept or shown as plain text, including in logs |

### US-002: No public registration or additional users

**Priority:** high

> As a owner, I want the app to have no public sign-up and support only my single account, so that my notes stay private to me alone.

| ID | Given | When | Then |
|---|---|---|---|
| AC-004 | a person who is not the owner visits the app | they look for a way to register or create an account | no public registration or sign-up option is available |
| AC-005 | the single owner account already exists | the app is used | no additional user accounts can be created and all notes belong to the one owner |

### US-003: Stay signed in across browsers and sign out

**Priority:** high

> As a owner, I want my session to persist while I work, expire when idle, and end when I sign out, so that I can reach my notes from any browser while keeping access secure.

| ID | Given | When | Then |
|---|---|---|---|
| AC-006 | I am signed in and active | I continue using the app | I remain signed in and can access my notes without re-entering my password |
| AC-007 | I am signed in | my session has been inactive beyond its expiry period | my session ends and I must sign in again to continue |
| AC-008 | I am signed in | I choose to sign out | my session ends and I must sign in again to access my notes |
| AC-009 | I sign in from a different browser or device | I provide my email and password | I reach the same server-stored notes |

## EPIC-002: Note Management

The owner can create, view, edit, and delete plain-text notes. Notes contain plain text only — no rich formatting, checklists, images, or attachments (out of scope). Edits save automatically, and each note tracks created and last-updated timestamps used for sorting. Assumption: the owner can create, view, edit, and delete notes; edits save automatically and each note tracks a created and last-updated timestamp.

### US-004: Create a plain-text note

**Priority:** critical

> As a owner, I want to create a new plain-text note, so that I can capture my thoughts quickly.

| ID | Given | When | Then |
|---|---|---|---|
| AC-010 | I am signed in and viewing my notes | I choose to create a new note and enter text | a new note is created with my text and a created timestamp recorded at the moment of creation |
| AC-011 | I am creating a new note | I type text into it | only plain text is accepted — there are no formatting, checklist, image, or attachment controls |
| AC-012 | I have just created a note | I return to the notes list | the new note appears in the list |

### US-005: View a note

**Priority:** critical

> As a owner, I want to open and read the full content of a note, so that I can see what I previously saved.

| ID | Given | When | Then |
|---|---|---|---|
| AC-013 | I have notes saved | I select a note from the list | the full plain-text content of that note is displayed |
| AC-014 | I am viewing a note | I look at it | its content is shown as the plain text I saved, without any formatting applied |

### US-006: Edit a note with automatic saving

**Priority:** critical

> As a owner, I want my edits to a note to save automatically, so that I never lose changes or have to press a save button.

| ID | Given | When | Then |
|---|---|---|---|
| AC-015 | I am editing an existing note | I change its text and pause or move away from editing | the changes are saved automatically without me pressing a save action, and the note's last-updated timestamp is set to the time of the change |
| AC-016 | I have edited a note and it has saved automatically | I reload the app or open it from another browser | the edited content is shown |
| AC-017 | I am editing a note and automatic saving does not complete | the save fails | I am shown that the change has not been saved so I do not lose my edit |

### US-007: Delete a note

**Priority:** high

> As a owner, I want to delete a note I no longer need, so that my list stays relevant.

| ID | Given | When | Then |
|---|---|---|---|
| AC-018 | I am viewing or selecting a note | I choose to delete it and confirm | the note is removed and no longer appears in my list |
| AC-019 | I have deleted a note | I reload the app or open it from another browser | the deleted note does not reappear |

## EPIC-003: Notes List, Sorting & Search

Notes are shown in a single flat list sorted by most recent activity (last-updated timestamp first), with a search box to find notes by their text content. There are no folders, notebooks, or tags (out of scope). Assumption: sorting uses the created/last-updated timestamps; search matches on the note's text content.

### US-008: See all notes in one list sorted by recent activity

**Priority:** high

> As a owner, I want to see all my notes in a single list ordered by most recent activity, so that the notes I touched most recently are easiest to find.

| ID | Given | When | Then |
|---|---|---|---|
| AC-020 | I have several notes with different last-updated times | I view my notes list | all notes appear in one flat list ordered with the most recently created or updated note first |
| AC-021 | I edit or create a note | I return to the list | that note moves to the top as the most recent activity |
| AC-022 | I view my notes list | I look for ways to organise notes | there are no folders, notebooks, or tags — only the single list |
| AC-023 | I have no notes yet | I view my notes list | I see an empty state inviting me to create my first note |

### US-009: Search notes by their text

**Priority:** high

> As a owner, I want to search my notes by their text content, so that I can quickly find a specific note.

| ID | Given | When | Then |
|---|---|---|---|
| AC-024 | I have notes containing various text | I type a search term into the search box | the list shows only notes whose text content matches the term |
| AC-025 | I have an active search term | no note's text matches it | I see a clear message that no notes were found |
| AC-026 | I have an active search term | I clear the search box | the full list of notes sorted by most recent activity is shown again |

## EPIC-004: Responsive Web Platform & Server Storage

The app is delivered as a responsive web application usable on desktop and mobile browsers — there is no native mobile or desktop app. Notes are stored server-side so they are available on any browser the owner logs in from; there is no offline-first or local-only storage. The app is free to its single owner, with no payments, billing, or subscriptions. Assumptions: responsive web only; server-side storage with no offline mode; no billing.

### US-010: Use the app responsively on desktop and mobile browsers

**Priority:** high

> As a owner, I want the app to adapt to desktop and mobile browser screens, so that I can manage my notes comfortably on whatever device I am using.

| ID | Given | When | Then |
|---|---|---|---|
| AC-027 | I open the app in a desktop browser | the notes list and editor are shown | the layout fits the desktop screen and all actions are usable |
| AC-028 | I open the app in a mobile browser | the notes list and editor are shown | the layout adapts to the smaller screen and all actions remain usable without horizontal scrolling |
| AC-029 | I want to use the app | I access it | it works through a web browser with no native mobile or desktop app required to install |

### US-011: Access server-stored notes from any browser

**Priority:** high

> As a owner, I want my notes stored on the server, so that they are available whenever I log in from any browser or device.

| ID | Given | When | Then |
|---|---|---|---|
| AC-030 | I created notes while signed in on one browser | I sign in from a different browser or device | the same notes are available because they are stored server-side |
| AC-031 | I am signed in | I create, edit, or delete a note | the change is saved to the server rather than only in the current browser |

### US-012: Use the app free with no billing

**Priority:** low

> As a owner, I want to use the app with no payments or subscription, so that I can keep my notes without any cost.

| ID | Given | When | Then |
|---|---|---|---|
| AC-032 | I am the single owner using the app | I use any of its features | no payment, billing, or subscription is ever requested |
<!-- sdlc:auto:end epics -->
