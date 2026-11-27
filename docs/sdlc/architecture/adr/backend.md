<!-- sdlc:auto:start adr -->
# ADR-0002: Use FastAPI 0.115 for Backend

Status: Accepted  
Date: 2026-11-27

## Context and Problem Statement

Which Backend technology does the project use? Decided in architecture v1.

## Considered Options

- FastAPI 0.115
- Flask
- Django REST Framework

## Decision Outcome

Chosen option: FastAPI 0.115, because Small, typed Python service that handles login, opaque session issue/revoke, and note CRUD plus full-text search with minimal code, maintainable by one person.

## Consequences

Session validation and expiry are implemented explicitly rather than relying on a framework session middleware, which fits the two-origin token model.
<!-- sdlc:auto:end adr -->