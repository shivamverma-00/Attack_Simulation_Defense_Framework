# Deployment

This guide covers Docker Compose and cloud deployment pointers.

## Docker Compose

From the repository root:

```bash
cd docker
docker-compose up --build
```

Services:

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- Vulnerable App: `http://localhost:8080`

## Environment

Set backend environment variables via Compose or your host environment:

```bash
SECRET_KEY=change-me
FLASK_ENV=production
```

## Cloud (Pointers)

- Backend: Deploy `backend/` to platforms supporting Python/Flask (e.g., Railway, Render, Fly.io)
- Frontend: Build `frontend/` and host static files (e.g., Netlify, Vercel)
- Update frontend environment to point to the deployed backend URLs

### Railway (example)

1. Create a new service from `backend/`
2. Set `SECRET_KEY`, choose Python 3.11
3. Expose port `5000`

### Netlify (example)

```bash
cd frontend
npm ci && npm run build
```

Deploy the `build/` directory. Configure environment:

```bash
REACT_APP_API_BASE_URL=https://<your-backend>
REACT_APP_WEBSOCKET_URL=https://<your-backend>
```

## Production Hardening

- Add auth (token/session) and rate limiting
- Put Flask behind Nginx/HTTPS
- Use managed DB (Postgres) instead of SQLite
- Configure logging/metrics and backups

