<!-- sdlc:auto:start adr -->
# ADR-0001: Use React 19 for Frontend

Status: Accepted  
Date: 2026-11-27

## Context and Problem Statement

Which Frontend technology does the project use? Decided in architecture v1.

## Considered Options

- React 19
- Vue
- Svelte

## Decision Outcome

Chosen option: React 19, because Drives the single responsive page — notes list, search box, and a debounced auto-saving editor — updating without reloads, and stores the opaque session token to send as a Bearer header. Built with Vite and reads VITE_API_BASE_URL at deploy.

## Consequences

A SPA needs a separate static host and CORS to the API origin; acceptable for a two-origin deployment and a single user.
<!-- sdlc:auto:end adr -->