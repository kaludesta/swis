# Extension Troubleshooting Guide

## Analytics Page Not Showing Data

If your Analytics page shows "No tracking data yet", follow these steps:

### Step 1: Reload the Extension
The extension was recently updated with auto-configuration. You need to reload it:

1. Open Chrome and go to `chrome://extensions/`
2. Find "Academic Time Tracker" extension
3. Click the **reload icon** (circular arrow) on the extension card
4. You should see a notification: "Time Tracker Active"

### Step 2: Verify Extension Status
1. Click the extension icon in your browser toolbar
2. You should see a **green box** with: "✓ Tracking active for [your name]"
3. If you see a **yellow warning** instead, the extension isn't connected:
   - Go to `http://localhost:5173` and login again
   - The extension will auto-configure when you login

### Step 3: Test Tracking
1. Browse to any website (e.g., github.com, stackoverflow.com)
2. The site will be logged immediately (even with 0 seconds)
3. Time updates are synced every 10 seconds
4. Check the extension popup - you should see the website listed with time
5. Check Analytics page - all visited sites appear regardless of time spent

### Step 4: Check Service Worker Console
If still not working, check for errors:

1. Go to `chrome://extensions/`
2. Find "Academic Time Tracker"
3. Click "service worker" (blue link)
4. Look for console messages:
   - ✅ "Synced to server: [domain] [time]" = Working!
   - ❌ Error messages = Something is wrong

### Step 5: Verify Backend Connection
1. Make sure backend server is running on port 3000
2. Test the API manually:
```bash
curl -X POST http://localhost:3000/api/tracking \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 2,
    "domain": "test.com",
    "url": "https://test.com",
    "title": "Test Page",
    "time_spent": 60,
    "visit_date": "2026-03-09"
  }'
```
3. Check Analytics page - test data should appear

## Common Issues

### Issue: Extension shows "Not connected"
**Solution**: Login to the dashboard at `http://localhost:5173`. The extension auto-configures on login.

### Issue: No data syncing to server
**Solution**: 
- Check that backend is running: `http://localhost:3000/api/health`
- Reload the extension at `chrome://extensions/`
- Check service worker console for errors

### Issue: Data shows in extension popup but not in Analytics page
**Solution**: 
- The extension might not be syncing to server
- Check service worker console for "Synced to server" messages
- Verify userId is set: Check extension popup status

### Issue: "Failed to sync to server" error
**Solution**:
- Backend server might be down - restart it
- CORS issue - backend should allow `http://localhost:5173`
- Network issue - check if `http://localhost:3000` is accessible

## Quick Verification Checklist

- [ ] Backend server running on port 3000
- [ ] Frontend running on port 5173
- [ ] Logged into dashboard (userId in localStorage)
- [ ] Extension reloaded after recent updates
- [ ] Extension shows green "Tracking active" status
- [ ] Browsed websites (any duration - even quick visits are tracked)
- [ ] Waited 10 seconds for sync to occur

## Tracking Behavior

The extension now tracks ALL website visits:
- ✅ Immediate logging when you visit a site (even 0 seconds)
- ✅ Continuous time tracking while you stay on the site
- ✅ Updates synced to server every 10 seconds
- ✅ No minimum time requirement
- ✅ All visits appear in Analytics page

This means even quick visits (like checking a page for 2 seconds) will be logged!

## Still Not Working?

Check the service worker console (`chrome://extensions/` → service worker) for these messages:

**Good signs:**
```
🚀 Academic Time Tracker extension loaded
✅ Extension auto-configured for user: [name]
✅ Synced to server: github.com 45s
```

**Bad signs:**
```
Failed to sync to server: [error]
Could not check login status: [error]
```

If you see errors, the issue is likely:
1. Backend server not running
2. Wrong API_URL in extension (should be `http://localhost:3000/api`)
3. CORS not configured properly on backend
