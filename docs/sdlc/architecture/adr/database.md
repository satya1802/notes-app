<!-- sdlc:auto:start adr -->
# ADR-0003: Use PostgreSQL 16 for Database

Status: Accepted  
Date: 2026-11-27

## Context and Problem Statement

Which Database technology does the project use? Decided in architecture v1.

## Considered Options

- PostgreSQL 16
- MySQL
- SQLite

## Decision Outcome

Chosen option: PostgreSQL 16, because Stores owner, sessions, and notes reliably; its built-in full-text search (tsvector + GIN) backs the search box and updated_at indexing gives recent-activity ordering — no extra search engine needed.

## Consequences

Full-text search is simpler than a dedicated engine but entirely sufficient for one owner's plain-text notes.
<!-- sdlc:auto:end adr -->