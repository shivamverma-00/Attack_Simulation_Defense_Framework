# API Reference

This document describes the backend REST API and WebSocket events exposed by the Attack Simulation & Defense Framework.

Base URL (local): `http://localhost:5000`

## Authentication

- No authentication is required in the demo setup. Do not expose publicly.

## Content Type

- Send JSON bodies with header: `Content-Type: application/json`

## Endpoints

### POST /api/attack

Simulate an attack and persist the event.

- Request body

```json
{
  "attack_type": "SQLi | XSS | BruteForce",
  "payload": "string (for SQLi/XSS)",
  "attempts": 1
}
```

- Response 200

```json
{
  "attack_id": 1,
  "attack_type": "SQLi",
  "payload": "' OR 1=1 --",
  "result": "success | failure",
  "reason": "SQL injection pattern detected"
}
```

- Response 400

```json
{ "error": "Invalid attack type" }
```

Notes:
- `BruteForce` uses `attempts` to determine detection (>= 3 considered detected).

### POST /api/defense

Apply a defense strategy for a previously recorded attack.

- Request body

```json
{ "attack_id": 1 }
```

- Response 200

```json
{
  "defense_id": 1,
  "attack_id": 1,
  "result": "success | failure",
  "reason": "SQL injection blocked by parameterized queries and input validation"
}
```

- Response 404

```json
{ "error": "Attack not found" }
```

Notes:
- Defense type is inferred from the original attack type.

### GET /api/logs

Fetch recent logs, optionally filtering by `attack_type`.

- Query params
  - `attack_type` (optional): `SQLi`, `XSS`, `BruteForce`

- Response 200

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

- Request body

```json
{
  "format": "pdf | csv",
  "time_filter": "all | 24h | 7d"
}
```

- Response 200
  - `application/pdf` download when `format=pdf`
  - `text/csv` download when `format=csv`

### GET /api/stats

Return summary statistics for dashboards.

- Response 200

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

## WebSocket Events

Connect to the Socket.IO endpoint at the backend base URL.

### Server → Client

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

## Error Handling

- Errors are returned with appropriate HTTP status codes and an `error` message field.

## Rate Limiting & Auth

- Not enabled by default in this demo. Add a reverse proxy or middleware before any public exposure.


