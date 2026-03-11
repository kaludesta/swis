# Email Notification Setup Guide

## Overview
The system can now send automated email notifications for:
- 📅 Deadline reminders (24h before assignments are due)
- ⚠️ Workload alerts (when weekly study time exceeds 50 hours)
- 📊 Weekly summaries (every Sunday at 8 PM)

## Setup Instructions

### Step 1: Get a Gmail Account
You need a Gmail account to send emails from. You can use an existing account or create a new one specifically for the app.

### Step 2: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com
2. Click "Security" in the left sidebar
3. Under "Signing in to Google", click "2-Step Verification"
4. Follow the steps to enable 2FA

### Step 3: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. You may need to sign in again
3. In the "Select app" dropdown, choose "Mail"
4. In the "Select device" dropdown, choose "Other (Custom name)"
5. Type "SWIS Dashboard" and click "Generate"
6. Google will show you a 16-character password
7. **Copy this password** (you won't be able to see it again)

### Step 4: Update .env File
1. Open the `.env` file in the project root
2. Replace the placeholder values:
   ```
   EMAIL_USER=your-actual-email@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ```
3. Save the file

### Step 5: Restart the Server
Stop and restart the backend server:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run server
```

You should see:
```
✅ Email service is ready
📅 All notification schedulers initialized
✅ Deadline reminder scheduler started (runs hourly)
✅ Workload alert scheduler started (runs daily at 6 PM)
✅ Weekly summary scheduler started (runs Sundays at 8 PM)
```

## Notification Schedule

### Deadline Reminders
- **When:** Every hour (on the hour)
- **Condition:** Assignment due in 24 hours
- **Sent to:** Users with "Deadline Reminders" enabled in Settings

### Workload Alerts
- **When:** Every day at 6:00 PM
- **Condition:** Weekly study time exceeds 50 hours
- **Sent to:** Users with "Workload Alerts" enabled in Settings

### Weekly Summaries
- **When:** Every Sunday at 8:00 PM
- **Contains:** 
  - Total study hours
  - Number of study sessions
  - Screen time
  - Completed assignments
  - Upcoming deadlines
- **Sent to:** Users with "Weekly Summary" enabled in Settings

## Testing Notifications

### Test Deadline Reminder
1. Create an assignment with due date = tomorrow (same time)
2. Wait for the next hour (e.g., if it's 2:30 PM, wait until 3:00 PM)
3. Check your email

### Test Workload Alert
1. Add study sessions totaling more than 50 hours for the past week
2. Wait until 6:00 PM
3. Check your email

### Test Weekly Summary
1. Wait until Sunday at 8:00 PM
2. Check your email

## Troubleshooting

### "Email not configured" message
- Make sure EMAIL_USER and EMAIL_PASSWORD are set in .env
- Restart the server after updating .env

### "Invalid login" error
- Make sure you're using an App Password, not your regular Gmail password
- Check that 2-Factor Authentication is enabled
- Generate a new App Password if needed

### Emails not being received
- Check spam/junk folder
- Verify the email address in your user account is correct
- Check server logs for error messages
- Make sure the notification preference is enabled in Settings

### "Less secure app access" error
- This means you're using your regular password instead of an App Password
- Follow Step 3 to generate an App Password

## Security Notes

1. **Never commit .env file to Git** - It contains sensitive credentials
2. **Use a dedicated email account** - Consider creating a separate Gmail account just for the app
3. **App Passwords are safer** - They can be revoked without changing your main password
4. **Keep credentials private** - Don't share your EMAIL_PASSWORD with anyone

## Disabling Notifications

Users can disable notifications individually in Settings:
- Go to Settings page
- Scroll to "Notifications" section
- Uncheck the notifications they don't want

The system will respect these preferences and only send emails to users who have opted in.
