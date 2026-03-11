# 🔌 Browser Extension Installation Guide

## What This Extension Does

This extension automatically tracks how much time you spend on each website and syncs the data to your Academic Dashboard for productivity analysis.

## Features

- ⏱️ **Automatic tracking** - No manual input needed
- 📊 **Daily summaries** - Click icon to see today's activity
- 🔄 **Auto-sync** - Data syncs to dashboard when logged in
- 💾 **Offline support** - Works without internet, syncs later
- 🎯 **Smart tracking** - Only tracks when browser is active

## Installation Steps

### For Chrome / Edge / Brave

1. **Open Extensions Page**
   - Chrome: Type `chrome://extensions/` in address bar
   - Edge: Type `edge://extensions/` in address bar
   - Brave: Type `brave://extensions/` in address bar
   - Or: Menu → Extensions → Manage Extensions

2. **Enable Developer Mode**
   - Look for "Developer mode" toggle in top-right corner
   - Turn it ON

3. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to this folder: `dummy application/Academic Web Dashboard Design/extension`
   - Click "Select Folder"

4. **Verify Installation**
   - You should see "Academic Time Tracker" in your extensions list
   - The extension icon should appear in your toolbar
   - If not visible, click the puzzle icon and pin it

### For Firefox

1. **Open Debugging Page**
   - Type `about:debugging#/runtime/this-firefox` in address bar
   - Or: Menu → More Tools → Browser Tools → about:debugging

2. **Load Temporary Add-on**
   - Click "Load Temporary Add-on..." button
   - Navigate to the extension folder
   - Select the `manifest.json` file
   - Click "Open"

3. **Note for Firefox**
   - Temporary add-ons are removed when Firefox closes
   - You'll need to reload it each time you restart Firefox
   - For permanent installation, the extension needs to be signed by Mozilla

## First Time Setup

1. **Open the Dashboard**
   - Go to http://localhost:5173

2. **Create Account or Login**
   - Register a new account, or
   - Use test account: test@example.com / test123

3. **Start Browsing**
   - The extension starts tracking automatically
   - No configuration needed!

4. **View Your Stats**
   - Click the extension icon to see today's activity
   - Check the dashboard Analytics page for detailed insights

## How to Use

### View Today's Activity
1. Click the extension icon in your toolbar
2. See list of websites and time spent
3. Total time shown at the top

### Sync to Dashboard
- Data syncs automatically when you're logged in
- No manual sync needed
- Works in the background

### Check Analytics
1. Open dashboard at http://localhost:5173
2. Go to Analytics page
3. View detailed charts and statistics

## What Gets Tracked

- **Domain name** (e.g., github.com, youtube.com)
- **Page title** (last visited page on that domain)
- **Time spent** (in seconds, updated every 30 seconds)
- **Visit date** (for daily tracking)

## What Doesn't Get Tracked

- ❌ Browser internal pages (chrome://, about:, etc.)
- ❌ Time when browser is minimized or inactive
- ❌ Private/Incognito browsing (by default)
- ❌ Specific page URLs (only domain tracked)

## Privacy & Security

- ✅ All data stored locally on your computer
- ✅ No external services or third-party tracking
- ✅ You control all your data
- ✅ Data only sent to YOUR local server (localhost:3000)
- ✅ Open source - you can review all code

## Troubleshooting

### Extension not tracking?

**Check if extension is enabled:**
- Go to chrome://extensions/
- Verify "Academic Time Tracker" is ON
- Check for any error messages

**Check permissions:**
- Extension needs "tabs" and "storage" permissions
- These are granted automatically on install

**Check browser console:**
- Right-click extension icon → Inspect popup
- Look for error messages in console

### Data not syncing to dashboard?

**Verify you're logged in:**
- Open dashboard at http://localhost:5173
- Make sure you're logged in
- Extension only syncs when authenticated

**Check backend is running:**
- Backend should be running on http://localhost:3000
- Test by visiting http://localhost:3000 in browser

**Check browser console:**
- Open Developer Tools (F12)
- Look for network errors or CORS issues

### Extension icon not showing?

**Pin the extension:**
- Click puzzle icon in toolbar
- Find "Academic Time Tracker"
- Click pin icon to keep it visible

### No data in popup?

**Wait for activity:**
- Extension tracks in 30-second intervals
- Browse some websites first
- Click icon after a minute or two

**Check storage:**
- Right-click extension icon → Inspect popup
- Console → Type: `chrome.storage.local.get(console.log)`
- Should show timeData object

## Uninstalling

### Chrome/Edge/Brave
1. Go to chrome://extensions/
2. Find "Academic Time Tracker"
3. Click "Remove"
4. Confirm removal

### Firefox
1. Go to about:addons
2. Find "Academic Time Tracker"
3. Click "Remove"

**Note:** Uninstalling removes the extension but keeps your data in the dashboard database.

## Optional: Add Custom Icons

The extension works without custom icons, but you can add them:

1. **Generate icons:**
   - Open `icons/generate-icons.html` in browser
   - Right-click each canvas
   - Save as PNG: icon16.png, icon48.png, icon128.png

2. **Or create your own:**
   - Create three PNG images: 16x16, 48x48, 128x128 pixels
   - Name them: icon16.png, icon48.png, icon128.png
   - Place in the `icons/` folder

3. **Reload extension:**
   - Go to chrome://extensions/
   - Click reload icon on the extension card

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the console for error messages
3. Verify backend and frontend are running
4. Check the main SETUP_COMPLETE.md for more details

## Technical Details

- **Manifest Version:** 3 (latest)
- **Permissions:** tabs, storage, activeTab
- **Background:** Service Worker
- **Update Interval:** 30 seconds
- **Storage:** chrome.storage.local
- **API:** REST API at localhost:3000

---

**Ready to track your productivity! Install the extension and start browsing.** 🚀
