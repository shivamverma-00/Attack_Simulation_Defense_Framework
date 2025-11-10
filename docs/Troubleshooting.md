# Troubleshooting

## Backend fails to start

- Ensure Python 3.11 and `pip install -r backend/requirements.txt`
- Delete `backend/instance/cyber_sim.db` if schema changed, then restart
- Check port 5000 is free

## CORS or WebSocket errors

- Use matching protocol/origin: frontend `http://localhost:3000` to backend `http://localhost:5000`
- Verify `SocketIO` CORS: backend allows `cors_allowed_origins="*"`

## PDF generation errors

- Ensure ReportLab installed (in `requirements.txt`)
- Try CSV report to validate data path

## React build issues

- Clear cache: `rm -rf node_modules && npm ci`
- Verify Node 18+

## Docker compose problems

- `docker system prune -af` and rebuild
- Check services are not port-colliding

## Database not updating

- Confirm app context creates tables on start
- Inspect DB: `sqlite3 backend/instance/cyber_sim.db ".tables"`

