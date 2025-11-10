# Architecture

## Components

- Backend (Flask): REST API, WebSocket (Socket.IO), SQLite via SQLAlchemy
- Frontend (React): Dashboard, simulation, defense, logs, reporting
- Reporting: ReportLab (PDF) and CSV generation
- Docker: Compose for orchestration; optional vulnerable app

## Data Model (ERD)

- `Attack` (id, attack_type, payload, status, timestamp)
- `Defense` (id, attack_id → Attack.id, result, reason, timestamp)
- `Log` (id, event, details, timestamp)
- `Report` (id, content, format, timestamp)

Relationships:

- One `Attack` has many `Defense`

## Request Flows

### Simulate Attack

1. Client POST `/api/attack`
2. Backend simulates detection, stores `Attack`, logs event
3. Emits `attack_event` via WebSocket

### Apply Defense

1. Client POST `/api/defense` with `attack_id`
2. Backend evaluates defense, stores `Defense`, logs event
3. Emits `defense_event` via WebSocket

## Observability

- Logs endpoint `/api/logs` for recent events
- Stats endpoint `/api/stats` for dashboard numbers

## Security Notes

- Educational-only defaults (no auth/rate limiting). Add before public deployment
- Use environment variables for secrets
- Consider reverse proxy (Nginx) and HTTPS in production

