# Setup

Follow these steps to run the platform locally for development.

## Prerequisites

- Python 3.11+
- Node.js 18+
- Docker (optional)

## Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export SECRET_KEY=dev-key-change-in-production
python app.py
```

Backend runs at `http://localhost:5000`.

## Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`.

## Vulnerable App (Optional)

```bash
cd docker/vulnerable-app
pip install -r requirements.txt
python vulnerable_app.py
```

Runs at `http://localhost:8080`.

## Environment Variables

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

