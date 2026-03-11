# 🎯 Auto-Configuration Feature

## What's New?

The extension now **automatically configures itself** when you login to the dashboard! No manual setup needed.

---

## How It Works

### Automatic Detection

1. **Install the extension** (one-time manual step - required by browsers)
2. **Login to the dashboard** at http://localhost:5173
3. **Extension auto-detects** your login
4. **Automatically configures** itself with your user ID
5. **Shows notification**: "Time Tracker Active - Tracking enabled for [Your Name]"
6. **Starts tracking** immediately!

### What Happens Automatically

✅ Detects when you visit the dashboard
✅ Checks if you're logged in
✅ Extracts your user ID from localStorage
✅ Saves it to extension storage
✅ Shows success notification
✅ Starts syncing data to database
✅ No manual configuration needed!

---

## Installation (One-Time Only)

Unfortunately, browsers don't allow automatic extension installation for security reasons. You need to install it once manually:

### Steps:

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` folder
5. Done! ✅

---

## Using the Extension

### First Time:

1. **Install extension** (see above)
2. **Login to dashboard** at http://localhost:5173
3. **See notification**: "Time Tracker Active"
4. **Start browsing** - tracking begins automatically!

### After First Login:

- ✅ Extension remembers you
- ✅ Continues tracking automatically
- ✅ Syncs data every 30 seconds
- ✅ No further action needed

### Check Status:

Click the extension icon to see:
- ✓ Connection status (green = active)
- Today's tracked websites
- Time spent on each site
- Total time today

---

## Features

### Auto-Configuration
- Detects login automatically
- Configures itself without user input
- Shows confirmation notification
- Remembers your account

### Auto-Sync
- Syncs data every 30 seconds
- Works in background
- No manual sync needed
- Automatic retry on failure

### Smart Tracking
- Only tracks when browser is active
- Pauses when you switch away
- Ignores chrome:// pages
- Tracks all other websites

### Status Indicators
- Green badge: Connected and tracking
- Yellow badge: Not logged in
- Shows your name when connected
- Clear error messages

---

## Notifications

You'll see notifications for:

### ✅ Success
- "Time Tracker Active - Tracking enabled for [Your Name]"
- Shown when extension auto-configures

### ⚠️ Warnings
- "Not connected. Please login to the dashboard."
- Shown in popup when not logged in

---

## Troubleshooting

### Extension not auto-configuring?

**Check these:**
1. Is the extension installed and enabled?
2. Did you login to http://localhost:5173?
3. Is the backend running on port 3000?
4. Check browser console for errors (F12)

**Solution:**
- Refresh the dashboard page after logging in
- Extension will detect and configure automatically

### Not seeing notifications?

**Check:**
- Browser notifications are enabled
- Extension has notification permission
- Check chrome://settings/content/notifications

### Data not syncing?

**Check:**
1. Click extension icon
2. Look for green "Tracking active" message
3. If yellow warning, login to dashboard again
4. Backend must be running (http://localhost:3000)

---

## Manual Configuration (Not Needed!)

The extension auto-configures, but if you want to manually check:

1. Click extension icon
2. See connection status
3. If not connected, just login to dashboard
4. Extension will auto-configure

---

## Privacy & Security

### What Gets Stored
- Your user ID (for syncing)
- Your name (for display)
- Website domains you visit
- Time spent on each site

### What Doesn't Get Stored
- Passwords
- Personal information
- Full URLs (only domains)
- Private browsing data

### Where Data Goes
- Local: Chrome extension storage
- Server: Your PostgreSQL database (localhost:3000)
- No third-party services
- You control everything

---

## Technical Details

### Auto-Detection Method
```javascript
// Extension checks dashboard page
// Reads localStorage.userId
// Saves to extension storage
// Shows notification
// Starts tracking
```

### Permissions Used
- `tabs` - Detect dashboard visits
- `storage` - Save user ID
- `scripting` - Read localStorage
- `notifications` - Show success message
- `activeTab` - Track current tab

### Sync Frequency
- Every 30 seconds
- Only when browser is active
- Automatic retry on failure
- Batched updates

---

## Benefits

### For You
- ✅ No manual setup
- ✅ Works immediately after login
- ✅ No configuration needed
- ✅ Just install and login

### For Development
- ✅ Seamless user experience
- ✅ Automatic synchronization
- ✅ Error handling built-in
- ✅ Status feedback

---

## Summary

**Old Way:**
1. Install extension
2. Manually configure user ID
3. Manually enable tracking
4. Complex setup

**New Way:**
1. Install extension (one-time)
2. Login to dashboard
3. Done! ✅

**The extension automatically detects your login and configures itself!** 🎉

---

## Next Steps

1. **Install extension** (if not already)
2. **Login to dashboard**
3. **See notification** confirming activation
4. **Start browsing** - tracking is automatic!

**That's it! The extension handles everything else automatically.** 🚀
