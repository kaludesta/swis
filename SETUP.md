# Academic Dashboard with Time Tracking Setup

## Overview
This project includes:
1. Academic web dashboard (React + Vite)
2. Backend API server (Express + SQLite)
3. Browser extension for time tracking

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application

#### Option A: Start everything together
```bash
npm run dev:all
```

#### Option B: Start separately
Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
npm run server
```

The frontend will run on `http://localhost:5173`
The backend API will run on `http://localhost:3000`

### 3. Install Browser Extension

#### For Chrome/Edge:
1. Open `chrome://extensions/` (or `edge://extensions/`)
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension` folder from this project
5. The extension icon should appear in your toolbar

#### For Firefox:
1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select the `manifest.json` file from the `extension` folder

### 4. Add Extension Icons (Optional)
Create or download icons and place them in `extension/icons/`:
- icon16.png (16x16 pixels)
- icon48.png (48x48 pixels)
- icon128.png (128x128 pixels)

You can use online tools like:
- https://www.favicon-generator.org/
- https://www.canva.com/

## How It Works

### Time Tracking
1. The browser extension automatically tracks time spent on each website
2. Data is stored locally in the extension
3. When you log in to the dashboard, the extension syncs data to the server
4. View your browsing analytics in the Analytics page

### Database
- SQLite database (`academic-dashboard.db`) stores:
  - User accounts
  - Website tracking data
  - Study sessions
  - Assignments

### API Endpoints

#### Authentication
- `POST /api/register` - Create new account
- `POST /api/login` - Login

#### Tracking
- `POST /api/tracking` - Save tracking data
- `GET /api/tracking/:userId` - Get user's tracking data
- `GET /api/tracking/:userId/top` - Get top visited sites

## Extension Usage

1. Click the extension icon to see today's activity
2. View time spent on each website
3. Data automatically syncs when logged in to the dashboard

## Development Notes

- The extension tracks time in 30-second intervals
- Only tracks when browser window is focused
- Ignores chrome:// and internal browser pages
- Data persists in chrome.storage.local

## Troubleshooting

### Extension not tracking
- Check if extension is enabled in browser
- Verify permissions are granted
- Check browser console for errors

### API connection issues
- Ensure backend server is running on port 3000
- Check CORS settings if accessing from different origin
- Verify database file has write permissions

### Database issues
- Delete `academic-dashboard.db` to reset database
- Schema will be recreated on next server start
