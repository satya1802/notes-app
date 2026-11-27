<!-- sdlc:auto:start adr -->
# ADR-0004: Use AWS for Cloud

Status: Accepted  
Date: 2026-11-27

## Context and Problem Statement

Which Cloud technology does the project use? Decided in architecture v1.

## Considered Options

- AWS
- GCP
- Azure

## Decision Outcome

Chosen option: AWS, because Hosts the FastAPI service and managed RDS PostgreSQL with automated backups and encryption at rest/in transit, keeping notes available from any browser the owner signs in from.

## Consequences

Managed RDS plus a container service is slightly more setup than a single VM but gives backups and availability out of the box.
<!-- sdlc:auto:end adr -->