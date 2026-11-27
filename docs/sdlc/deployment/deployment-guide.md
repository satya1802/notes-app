# Deployment Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start how-it-deploys -->
Pushes to `main` run `.github/workflows/deploy.yml`, which builds the API image (if there is a backend) and deploys the SPA to AWS Amplify. Commits touching only `docs/sdlc/**` don't deploy. Deployments can also be started from the platform's Deployment tab.
<!-- sdlc:auto:end how-it-deploys -->

<!-- sdlc:auto:start environments -->
| Name | Service | Runtime | Scaling | Environment |
|---|---|---|---|---|
| SPA Static Hosting | React build served from S3 + CloudFront | Static assets | CDN edge | dev |
| API Service | FastAPI on AWS (ECS Fargate or App Runner) | Python 3.12 / Uvicorn | 1 small task (single-owner load) | dev |
| Database | Amazon RDS for PostgreSQL 16 | PostgreSQL 16 managed | single instance with automated backups | dev |
<!-- sdlc:auto:end environments -->

<!-- sdlc:auto:start live -->
_Not deployed yet._
<!-- sdlc:auto:end live -->

<!-- sdlc:auto:start topology -->
```mermaid
graph LR
  n_SPA_Static_Hosting["SPA Static Hosting<br/>React build served from S3 + CloudFront"]
  n_API_Service["API Service<br/>FastAPI on AWS (ECS Fargate or App Runner)"]
  n_Database["Database<br/>Amazon RDS for PostgreSQL 16"]
  n_SPA_Static_Hosting -->|"HTTPS"| n_API_Service
  n_API_Service -->|"TLS (PostgreSQL wire protocol)"| n_Database
```
<!-- sdlc:auto:end topology -->
