# Overview

Attack Simulation & Defense Framework is a training platform for practicing red team vs blue team scenarios. It simulates common web attacks and demonstrates layered defenses with real-time monitoring, reporting, and a clean UI.

## Goals

- Provide safe, controlled simulations for SQLi, XSS, and brute force
- Teach defense strategies with immediate feedback and reports
- Offer dashboards, logs, and exports for analysis

## Key Features

- Attack simulations: SQLi, XSS, BruteForce
- Defenses: validation/escaping, account lockout
- Real-time events via WebSocket
- Reports: PDF and CSV
- React frontend with interactive modules

## High-level Flow

1. User triggers an attack via UI or API
2. Backend simulates detection and logs the event
3. User applies a defense; result is stored and broadcast
4. Dashboard shows stats; reports can be generated

## Repository Structure

```
Attack_Simulation_Defense_Framework/
  backend/            # Flask API, DB models, WebSocket
  frontend/           # React app (Tailwind)
  docker/             # Docker Compose and vulnerable app
  docs/               # Documentation
  README.md           # Project overview & quickstart
```

