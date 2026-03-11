# Browser Extension Installation Guide

## Quick Install

### Chrome / Edge / Brave
1. Open your browser
2. Navigate to `chrome://extensions/` (or `edge://extensions/` for Edge)
3. Toggle "Developer mode" ON (top right corner)
4. Click "Load unpacked" button
5. Browse to and select the `extension` folder
6. Done! The extension icon will appear in your toolbar

### Firefox
1. Open Firefox
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on..."
4. Browse to the `extension` folder and select `manifest.json`
5. Done! (Note: temporary add-ons are removed when Firefox closes)

## Using the Extension

### First Time Setup
1. Install the extension following steps above
2. Open the dashboard at `http://localhost:5173`
3. Register or login to your account
4. The extension will automatically start tracking

### Viewing Your Stats
- Click the extension icon to see today's activity
- Shows time spent on each website
- Data syncs automatically to your dashboard

### What Gets Tracked
- Active tab time (only when browser is focused)
- Website domain and page title
- Time is recorded in 30-second intervals
- Chrome internal pages (chrome://) are ignored

## Privacy
- All data is stored locally first
- Only syncs to your personal dashboard when logged in
- No third-party tracking or data sharing
- You control all your data

## Troubleshooting

### Extension not appearing
- Make sure Developer mode is enabled
- Try reloading the extension
- Check for errors in the extension console

### Not tracking time
- Verify the extension is enabled
- Check that you're logged in to the dashboard
- Ensure the backend server is running

### Data not syncing
- Confirm backend server is running on port 3000
- Check browser console for network errors
- Try logging out and back in

## Uninstall
1. Go to `chrome://extensions/`
2. Find "Academic Time Tracker"
3. Click "Remove"
