# Academic Dashboard - SWIS

Student Workload Intelligence System

## Project Structure

```
├── frontend/           # React + Vite frontend application
│   ├── src/
│   │   ├── app/       # Main application components
│   │   ├── styles/    # CSS and styling
│   │   └── db/        # Frontend database utilities
│   ├── index.html
│   └── vite.config.ts
│
├── server/            # Node.js + Express backend
│   ├── config/        # Database configuration
│   ├── models/        # Sequelize models
│   ├── db/            # Database schemas
│   ├── ml/            # Machine learning services
│   └── index.js       # Main server file
│
├── extension/         # Browser extension for time tracking
│   ├── icons/
│   ├── background.js
│   ├── popup.html
│   └── manifest.json
│
└── package.json       # Project dependencies
```

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Run the application:
```bash
npm run dev:all
```

This starts both frontend (http://localhost:5173) and backend (http://localhost:3000)

## Features

- Dashboard with analytics
- Assignment tracking
- Study session logging
- Browser time tracking extension
- ML-powered insights
- Blackboard calendar integration

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, PostgreSQL, Sequelize
- Extension: Vanilla JavaScript, Chrome Extension API
