# Attack Simulation & Defense Framework — Full Documentation

## 1) Overview

Attack Simulation & Defense Framework is a training platform for practicing red team vs blue team scenarios. It simulates common web attacks and demonstrates layered defenses with real-time monitoring, reporting, and a clean UI.

### Goals

- Provide safe, controlled simulations for SQLi, XSS, and brute force
- Teach defense strategies with immediate feedback and reports
- Offer dashboards, logs, and exports for analysis

### Key Features

- Attack simulations: SQLi, XSS, BruteForce
- Defenses: validation/escaping, account lockout
- Real-time events via WebSocket
- Reports: PDF and CSV
- React frontend with interactive modules

### High-level Flow

1. User triggers an attack via UI or API
2. Backend simulates detection and logs the event
3. User applies a defense; result is stored and broadcast
4. Dashboard shows stats; reports can be generated

### Repository Structure

```
Attack_Simulation_Defense_Framework/
  backend/            # Flask API, DB models, WebSocket
  frontend/           # React app (Tailwind)
  docker/             # Docker Compose and vulnerable app
  docs/               # Documentation
  README.md           # Project overview & quickstart
```

---

## 2) Setup

Follow these steps to run the platform locally for development.

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker (optional)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export SECRET_KEY=dev-key-change-in-production
python app.py
```

Backend runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`.

### Vulnerable App (Optional)

```bash
cd docker/vulnerable-app
pip install -r requirements.txt
python vulnerable_app.py
```

Runs at `http://localhost:8080`.

### Environment Variables

Backend:

```bash
SECRET_KEY=your-secret-key
FLASK_ENV=development
```

Frontend (`.env.local`):

```bash
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_WEBSOCKET_URL=http://localhost:5000
```

---

## 3) Architecture

### Components

- Backend (Flask): REST API, WebSocket (Socket.IO), SQLite via SQLAlchemy
- Frontend (React): Dashboard, simulation, defense, logs, reporting
- Reporting: ReportLab (PDF) and CSV generation
- Docker: Compose for orchestration; optional vulnerable app

### Data Model (ERD)

- `Attack` (id, attack_type, payload, status, timestamp)
- `Defense` (id, attack_id → Attack.id, result, reason, timestamp)
- `Log` (id, event, details, timestamp)
- `Report` (id, content, format, timestamp)

Relationships:

- One `Attack` has many `Defense`

### Request Flows

#### Simulate Attack

1. Client POST `/api/attack`
2. Backend simulates detection, stores `Attack`, logs event
3. Emits `attack_event` via WebSocket

#### Apply Defense

1. Client POST `/api/defense` with `attack_id`
2. Backend evaluates defense, stores `Defense`, logs event
3. Emits `defense_event` via WebSocket

### Observability

- Logs endpoint `/api/logs` for recent events
- Stats endpoint `/api/stats` for dashboard numbers

### Security Notes

- Educational-only defaults (no auth/rate limiting). Add before public deployment
- Use environment variables for secrets
- Consider reverse proxy (Nginx) and HTTPS in production

---

## 4) Usage

This guide shows how to use the platform from both the UI and API.

### Frontend Workflows

- Dashboard: View totals, success rates, and distribution by attack type
- Attack Simulation: Choose type (SQLi, XSS, BruteForce), enter payload, submit
- Defense Module: Select an attack and apply the corresponding defense
- Monitoring & Logs: See event stream in real time
- Reports: Generate PDF/CSV with selected time range

### API Examples

Base URL: `http://localhost:5000`

#### Simulate SQLi

```bash
curl -s -X POST http://localhost:5000/api/attack \
  -H 'Content-Type: application/json' \
  -d '{
    "attack_type": "SQLi",
    "payload": "\' OR 1=1 --"
  }'
```

#### Simulate XSS

```bash
curl -s -X POST http://localhost:5000/api/attack \
  -H 'Content-Type: application/json' \
  -d '{
    "attack_type": "XSS",
    "payload": "<script>alert(1)</script>"
  }'
```

#### Simulate BruteForce (attempt 3)

```bash
curl -s -X POST http://localhost:5000/api/attack \
  -H 'Content-Type: application/json' \
  -d '{
    "attack_type": "BruteForce",
    "attempts": 3
  }'
```

#### Apply Defense

```bash
curl -s -X POST http://localhost:5000/api/defense \
  -H 'Content-Type: application/json' \
  -d '{ "attack_id": 1 }'
```

#### Fetch Logs

```bash
curl -s 'http://localhost:5000/api/logs?attack_type=SQLi'
```

#### Generate PDF Report (last 7 days)

```bash
curl -L -X POST http://localhost:5000/api/reports \
  -H 'Content-Type: application/json' \
  -d '{ "format": "pdf", "time_filter": "7d" }' \
  -o report.pdf
```

#### Get Stats

```bash
curl -s http://localhost:5000/api/stats
```

### WebSocket

Connect a Socket.IO client to receive `attack_event` and `defense_event` broadcasts.

---

## 5) API Reference

Base URL (local): `http://localhost:5000`

### Authentication

- No authentication is required in the demo setup. Do not expose publicly.

### Content Type

- Send JSON bodies with header: `Content-Type: application/json`

### POST /api/attack

Simulate an attack and persist the event.

Request body:

```json
{
  "attack_type": "SQLi | XSS | BruteForce",
  "payload": "string (for SQLi/XSS)",
  "attempts": 1
}
```

Response 200:

```json
{
  "attack_id": 1,
  "attack_type": "SQLi",
  "payload": "' OR 1=1 --",
  "result": "success | failure",
  "reason": "SQL injection pattern detected"
}
```

Response 400:

```json
{ "error": "Invalid attack type" }
```

Notes:
- `BruteForce` uses `attempts` to determine detection (>= 3 considered detected).

### POST /api/defense

Apply a defense strategy for a previously recorded attack.

Request body:

```json
{ "attack_id": 1 }
```

Response 200:

```json
{
  "defense_id": 1,
  "attack_id": 1,
  "result": "success | failure",
  "reason": "SQL injection blocked by parameterized queries and input validation"
}
```

Response 404:

```json
{ "error": "Attack not found" }
```

Notes:
- Defense type is inferred from the original attack type.

### GET /api/logs

Fetch recent logs, optionally filtering by `attack_type`.

Query params:
- `attack_type` (optional): `SQLi`, `XSS`, `BruteForce`

Response 200:

```json
[
  {
    "id": 10,
    "event": "SQLi Attack",
    "details": "Attack succeeded: SQL injection pattern detected",
    "timestamp": "2025-01-01T10:00:00Z"
  }
]
```

### POST /api/reports

Generate a report in PDF (default) or CSV containing attacks and defenses within a time window.

Request body:

```json
{
  "format": "pdf | csv",
  "time_filter": "all | 24h | 7d"
}
```

Response 200:
- `application/pdf` download when `format=pdf`
- `text/csv` download when `format=csv`

### GET /api/stats

Return summary statistics for dashboards.

Response 200:

```json
{
  "total_attacks": 12,
  "successful_attacks": 9,
  "total_defenses": 8,
  "successful_defenses": 6,
  "attack_types": {
    "SQLi": 5,
    "XSS": 4,
    "BruteForce": 3
  }
}
```

### WebSocket Events

Connect to the Socket.IO endpoint at the backend base URL.

Server → Client:

- `status`
  - Emitted on connect.
  - Payload: `{ "msg": "Connected to server" }`

- `attack_event`
  - Emitted after `/api/attack`.
  - Payload:
    ```json
    {
      "type": "SQLi | XSS | BruteForce",
      "success": true,
      "reason": "...",
      "timestamp": "2025-01-01T10:00:00Z"
    }
    ```

- `defense_event`
  - Emitted after `/api/defense`.
  - Payload:
    ```json
    {
      "attack_id": 1,
      "attack_type": "SQLi",
      "success": false,
      "reason": "...",
      "timestamp": "2025-01-01T10:00:00Z"
    }
    ```

---

## 6) Deployment

This guide covers Docker Compose and cloud deployment pointers.

### Docker Compose

From the repository root:

```bash
cd docker
docker-compose up --build
```

Services:

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- Vulnerable App: `http://localhost:8080`

### Environment

Set backend environment variables via Compose or your host environment:

```bash
SECRET_KEY=change-me
FLASK_ENV=production
```

### Cloud (Pointers)

- Backend: Deploy `backend/` to platforms supporting Python/Flask (e.g., Railway, Render, Fly.io)
- Frontend: Build `frontend/` and host static files (e.g., Netlify, Vercel)
- Update frontend environment to point to the deployed backend URLs

#### Railway (example)

1. Create a new service from `backend/`
2. Set `SECRET_KEY`, choose Python 3.11
3. Expose port `5000`

#### Netlify (example)

```bash
cd frontend
npm ci && npm run build
```

Deploy the `build/` directory. Configure environment:

```bash
REACT_APP_API_BASE_URL=https://<your-backend>
REACT_APP_WEBSOCKET_URL=https://<your-backend>
```

### Production Hardening

- Add auth (token/session) and rate limiting
- Put Flask behind Nginx/HTTPS
- Use managed DB (Postgres) instead of SQLite
- Configure logging/metrics and backups

---

## 7) Troubleshooting

### Backend fails to start

- Ensure Python 3.11 and `pip install -r backend/requirements.txt`
- Delete `backend/instance/cyber_sim.db` if schema changed, then restart
- Check port 5000 is free

### CORS or WebSocket errors

- Use matching protocol/origin: frontend `http://localhost:3000` to backend `http://localhost:5000`
- Verify `SocketIO` CORS: backend allows `cors_allowed_origins="*"`

### PDF generation errors

- Ensure ReportLab installed (in `requirements.txt`)
- Try CSV report to validate data path

### React build issues

- Clear cache: `rm -rf node_modules && npm ci`
- Verify Node 18+

### Docker compose problems

- `docker system prune -af` and rebuild
- Check services are not port-colliding

### Database not updating

- Confirm app context creates tables on start
- Inspect DB: `sqlite3 backend/instance/cyber_sim.db ".tables"`

