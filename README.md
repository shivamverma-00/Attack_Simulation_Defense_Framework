# Attack Simulation & Defense Framework

A comprehensive cybersecurity training platform that simulates red team vs blue team scenarios. This application provides hands-on experience with various cyber attacks and defense mechanisms.

## 🚀 Quick Deploy

### **Drag & Drop Deployment (5 minutes)**

**Step 1: Backend → Railway**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "Deploy from local directory"
4. Drag your `backend` folder
5. Copy the URL (e.g., `https://your-app.railway.app`)

**Step 2: Frontend → Netlify**
1. Update `frontend/.env.production` with your Railway URL
2. Run:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
3. Go to [netlify.com/drop](https://netlify.com/drop)
4. Drag the `build` folder
5. Done!

## 🚀 Features

### Red Team (Attack Simulation)
- **SQL Injection Attacks**: Simulate SQL injection attempts with various payloads
- **Cross-Site Scripting (XSS)**: Test XSS vulnerabilities and payloads
- **Brute Force Attacks**: Simulate password brute force attempts

### Blue Team (Defense Module)
- **SQL Injection Defense**: Parameterized queries and input validation
- **XSS Defense**: HTML encoding and Content Security Policy
- **Brute Force Defense**: Account lockout and rate limiting

### Additional Features
- **Real-time Monitoring**: Live event tracking with WebSocket support
- **Interactive Education**: Tutorials and quizzes for learning
- **Comprehensive Reporting**: PDF and CSV report generation
- **Vulnerable Application**: Dedicated target for testing attacks

## 🏗️ Architecture

- **Backend**: Flask (Python) with SQLAlchemy ORM
- **Frontend**: React with TailwindCSS
- **Database**: SQLite
- **Real-time**: WebSocket communication
- **Containerization**: Docker support
- **Reporting**: PDF generation with ReportLab

## 📋 Prerequisites

- Python 3.9+
- Node.js 18+
- Docker (optional)
- Git

## 🛠️ Local Development

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
export SECRET_KEY=your-secret-key-here
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Vulnerable App Setup (Optional)
```bash
cd docker/vulnerable-app
pip install -r requirements.txt
python vulnerable_app.py
```

## 🌐 Access Points

- **Main Application**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Vulnerable App**: http://localhost:8080

## 🔒 Security Considerations

⚠️ **IMPORTANT**: This application is designed for educational and testing purposes only. It contains intentionally vulnerable code and should never be deployed in production environments without proper security measures.

- All attacks are simulated and don't cause actual harm
- The vulnerable application is isolated and controlled
- Real-world security practices should be followed in production
- Use environment variables for sensitive configuration

## 📊 Environment Variables

### Backend
```bash
SECRET_KEY=your-secret-key-here
FLASK_ENV=production
```

### Frontend
```bash
REACT_APP_API_BASE_URL=https://your-backend-url.com
REACT_APP_WEBSOCKET_URL=https://your-backend-url.com
```

## 🐳 Docker Deployment

```bash
cd docker
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Remember**: This is a training platform. Always follow responsible disclosure practices and only test on systems you own or have explicit permission to test.

## 📚 Documentation

- Overview: `docs/Overview.md`
- Setup: `docs/Setup.md`
- Architecture: `docs/Architecture.md`
- Usage: `docs/Usage.md`
- API Reference: `docs/API.md`
- Deployment: `docs/Deployment.md`
- Troubleshooting: `docs/Troubleshooting.md`
- Full documentation in one file: `docs/FullDocumentation.md`
