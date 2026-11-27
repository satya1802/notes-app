# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `d2ca815` · model `claude-sonnet-5`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
Notes app is a generated full-stack project from the Quorq AI SDLC platform, split into two independently run applications in one repo. The frontend (frontend/) is a Vite + React 19 single-page app built from an approved screen design; its screens currently run on seeded sample data and talk to the backend through a generated openapi-fetch client. The backend (backend/) is a FastAPI 0.115 service with SQLAlchemy models, Alembic migrations, and a bearer-token auth flow (app/auth.py); beyond health and auth, its endpoints are typed stubs scaffolded from the approved API spec, waiting to be implemented. The backend defaults to a local SQLite file for zero-setup development and uses PostgreSQL 16 (via docker-compose.yml) for tests and deployment.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Node.js (for npm/Vite 6, React 19, TypeScript 5.6 toolchain)
- Python 3.12
- pip
- Docker and Docker Compose (for the PostgreSQL database used by backend tests/deployment)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. Clone the repository
2. cd backend && pip install -r requirements.txt
3. (optional, for PostgreSQL-backed runs) from the repo root: docker-compose up -d to start the db service
4. (optional) set DATABASE_URL to point at PostgreSQL, e.g. export DATABASE_URL=postgresql+psycopg://app:<database-password>@localhost:5432/app -- otherwise the backend defaults to a local sqlite:///./app.db file
5. cd ../frontend && npm install
6. Copy .env.example to .env at the repo root and fill in any values it defines before running either app
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| backend dev | `cd backend && uvicorn app.main:app --reload` | Runs the FastAPI service locally; applies Alembic migrations and seeds users on startup (app/main.py). |
| frontend dev | `cd frontend && npm run dev` | Starts the Vite dev server for the SPA. |
| frontend build | `cd frontend && npm run build` | Bundles the app with Vite (no typechecking). |
| frontend preview | `cd frontend && npm run preview` | Serves the production build locally. |
| typecheck | `cd frontend && npm run typecheck` | Runs tsc --noEmit over the frontend. |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `backend` | FastAPI service: app/ (models, schemas, routers, auth, database), alembic/ (migrations), tests/, scripts/ (OpenAPI export, smoke test). |
| `backend/app` | Application code: main.py entrypoint, models.py (SQLAlchemy), schemas.py (Pydantic/ApiModel), auth.py (login/me routes), database.py (engine/session), seed.py. |
| `backend/alembic` | Alembic migration environment and versioned migration scripts (alembic/versions/). |
| `backend/tests` | Pytest suite: tests/integration (auth, health) and tests/unit. |
| `frontend` | Vite + React SPA: src/ (screens, lib, api client), e2e/ (Playwright specs), config files. |
| `frontend/src` | Application source: api/ (generated OpenAPI client and schema), lib/ (ui, icons, navigate, api helpers), main.tsx entrypoint. |
| `frontend/e2e` | Playwright acceptance tests and support fixtures (e.g. admin.ts). |
| `.devcontainer` | Dev container configuration for a consistent local environment. |
| `.quorq` | Platform metadata (handoff.json) used by the Quorq SDLC tooling. |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Pydantic models inherit from ApiModel (app/api_model.py) so API JSON uses camelCase while Python code stays snake_case.
- One FastAPI router per architecture component that owns endpoints (backend/app/routers/), registered in main.py.
- Unimplemented endpoints return a typed StubResponse (status 'not_implemented') rather than erroring, keeping the OpenAPI document complete before handlers are written.
- Database schema is managed exclusively through Alembic migrations (backend/alembic/versions/), never via SQLAlchemy create_all; migrations run automatically on app startup.
- Backend configuration is via environment variables (DATABASE_URL, ALLOWED_ORIGINS) with safe local defaults (SQLite, localhost CORS origins).
- Frontend never calls fetch directly for the API; all calls go through the generated client in src/api/client.ts (regenerated via npm run gen:api from the backend's OpenAPI spec).
- Frontend session auth token is stored in localStorage (frontend/src/lib/api.ts) and sent as a bearer token, since frontend and API run on different origins.
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && pytest` | Runs the pytest suite (requires PostgreSQL per TESTING.md); writes JUnit XML to backend/reports/junit/pytest.xml. |
| backend lint | `cd backend && ruff check .` | Lints the backend Python code per backend/ruff.toml. |
| backend format check | `cd backend && ruff format .` | Formats/reformats the backend Python code with Ruff. |
| frontend unit tests | `cd frontend && npm test` | Runs Vitest component tests under src/, with JUnit and v8 coverage reporting. |
| frontend e2e tests | `cd frontend && npm run test:e2e:install && npm run test:e2e` | Installs the Chromium browser then runs Playwright acceptance tests from e2e/, booting both backend and frontend locally unless E2E_BASE_URL is set. |
| frontend lint | `cd frontend && npm run lint` | Runs ESLint over the whole frontend app (gate the platform enforces). |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| Backend fails at startup trying to run migrations or connect to a database. | Check DATABASE_URL; by default it uses a local sqlite:///./app.db with no server needed. For PostgreSQL, ensure docker-compose up -d has started the db service and DATABASE_URL points to it. |
| Frontend calls to the backend are blocked by CORS. | Set ALLOWED_ORIGINS (comma-separated) on the backend to include the frontend's origin; in development the backend already allows http://localhost:5173 and http://127.0.0.1:5173 by default. |
| Playwright e2e tests fail to start or hang. | Run npm run test:e2e:install first to fetch Chromium, and ensure backend/.venv exists with dependencies installed, since playwright.config.ts boots the backend via backend/.venv/bin/python. |
| `npm run build` succeeds but the app has type errors. | Run npm run typecheck (tsc --noEmit) separately, since build does not typecheck by design. |
| pytest fails with import errors for `app`. | Run pytest from the backend/ directory so pytest.ini's pythonpath = . setting applies. |
<!-- sdlc:auto:end troubleshooting -->
