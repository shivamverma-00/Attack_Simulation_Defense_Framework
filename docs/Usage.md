# Usage

This guide shows how to use the platform from both the UI and API.

## Frontend Workflows

- Dashboard: View totals, success rates, and distribution by attack type
- Attack Simulation: Choose type (SQLi, XSS, BruteForce), enter payload, submit
- Defense Module: Select an attack and apply the corresponding defense
- Monitoring & Logs: See event stream in real time
- Reports: Generate PDF/CSV with selected time range

## API Examples

Base URL: `http://localhost:5000`

### Simulate SQLi

```bash
curl -s -X POST http://localhost:5000/api/attack \
  -H 'Content-Type: application/json' \
  -d '{
    "attack_type": "SQLi",
    "payload": "\' OR 1=1 --"
  }'
```

### Simulate XSS

```bash
curl -s -X POST http://localhost:5000/api/attack \
  -H 'Content-Type: application/json' \
  -d '{
    "attack_type": "XSS",
    "payload": "<script>alert(1)</script>"
  }'
```

### Simulate BruteForce (attempt 3)

```bash
curl -s -X POST http://localhost:5000/api/attack \
  -H 'Content-Type: application/json' \
  -d '{
    "attack_type": "BruteForce",
    "attempts": 3
  }'
```

### Apply Defense

```bash
curl -s -X POST http://localhost:5000/api/defense \
  -H 'Content-Type: application/json' \
  -d '{ "attack_id": 1 }'
```

### Fetch Logs

```bash
curl -s 'http://localhost:5000/api/logs?attack_type=SQLi'
```

### Generate PDF Report (last 7 days)

```bash
curl -L -X POST http://localhost:5000/api/reports \
  -H 'Content-Type: application/json' \
  -d '{ "format": "pdf", "time_filter": "7d" }' \
  -o report.pdf
```

### Get Stats

```bash
curl -s http://localhost:5000/api/stats
```

## WebSocket

Connect a Socket.IO client to receive `attack_event` and `defense_event` broadcasts. See `docs/API.md` for payloads.

