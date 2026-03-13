# SWIS Deployment Guide

## 100% Free Hosting Setup

### Architecture
- **Frontend**: Vercel (React + Vite)
- **Backend + ML**: Render Web Service (Node.js + Python)
- **Database**: Supabase PostgreSQL (already configured)
- **Extension**: Chrome Web Store

---

## Step 1: Prepare Your Code

### 1.1 Update Frontend API URL
Edit `frontend/src/app/App.tsx` or create a config file:

```typescript
// Add this at the top of your API calls
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Example: Update fetch calls
fetch(`${API_URL}/api/login`, { ... })
```

### 1.2 Update Extension API URL
Edit `extension/background.js`:

```javascript
// Change this line:
const API_URL = 'https://your-app-name.onrender.com';
```

### 1.3 Ensure Python Dependencies
Create `server/requirements.txt`:

```
pandas==2.0.3
numpy==1.24.3
scikit-learn==1.3.0
joblib==1.3.2
```

---

## Step 2: Deploy Backend to Render

### 2.1 Sign Up
1. Go to https://render.com
2. Sign up with GitHub

### 2.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `swis-backend` (or your choice)
   - **Region**: Oregon (Free)
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: Node
   - **Build Command**: `cd server && npm install && pip install -r requirements.txt`
   - **Start Command**: `cd server && node index.js`
   - **Plan**: Free

### 2.3 Add Environment Variables
Click "Environment" tab and add:

```
DATABASE_URL = your_supabase_connection_string
NODE_ENV = production
EMAIL_USER = your_email@gmail.com (optional)
EMAIL_PASSWORD = your_app_password (optional)
```

### 2.4 Deploy
- Click "Create Web Service"
- Wait 5-10 minutes for first deploy
- Copy your backend URL: `https://swis-backend.onrender.com`

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Sign Up
1. Go to https://vercel.com
2. Sign up with GitHub

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Add Environment Variable
In Vercel project settings → Environment Variables:

```
VITE_API_URL = https://swis-backend.onrender.com
```

### 3.4 Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Your frontend URL: `https://your-project.vercel.app`

---

## Step 4: Update Extension

### 4.1 Update API URL
Edit `extension/background.js`:

```javascript
const API_URL = 'https://swis-backend.onrender.com';
```

### 4.2 Test Locally
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `extension` folder
5. Test the extension

### 4.3 Publish to Chrome Web Store (Optional)
1. Go to https://chrome.google.com/webstore/devconsole
2. Pay $5 one-time developer fee
3. Zip extension folder
4. Upload and submit for review

---

## Step 5: Configure CORS

Update `server/index.js` CORS settings:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-project.vercel.app',
    'chrome-extension://*'
  ],
  credentials: true
}));
```

Redeploy backend on Render (auto-deploys on git push).

---

## Step 6: Test Everything

### 6.1 Test Backend
Visit: `https://swis-backend.onrender.com/api/health`

Should return:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

### 6.2 Test Frontend
1. Visit your Vercel URL
2. Register a new account
3. Login
4. Check all pages work

### 6.3 Test Extension
1. Install extension
2. Login to web app
3. Browse some websites
4. Check Analytics page shows data

---

## Important Notes

### Free Tier Limitations

**Render (Backend)**
- ✅ 750 hours/month (enough for 24/7)
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ Cold start: 30-60 seconds on first request
- ✅ Auto-deploys on git push

**Vercel (Frontend)**
- ✅ Unlimited bandwidth
- ✅ No sleep/cold starts
- ✅ Global CDN
- ✅ Auto-deploys on git push

**Supabase (Database)**
- ✅ 500MB storage
- ✅ 2GB bandwidth/month
- ✅ No sleep (always-on)
- ✅ Auto backups

### Preventing Backend Sleep

**Option 1: Use a Ping Service (Free)**
- https://uptimerobot.com (free)
- Ping your backend every 5 minutes
- Keeps it awake 24/7

**Option 2: Accept Cold Starts**
- First request after 15 min takes 30-60s
- Subsequent requests are instant
- Most users won't notice

---

## Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify DATABASE_URL is correct
- Ensure Python dependencies installed

### Frontend can't connect to backend
- Check VITE_API_URL is correct
- Verify CORS settings in server/index.js
- Check browser console for errors

### Extension not syncing
- Verify API_URL in background.js
- Check extension console for errors
- Ensure user is logged in

### Database connection failed
- Verify Supabase connection string
- Check if database is paused (free tier)
- Ensure IP allowlist includes 0.0.0.0/0

---

## Updating Your App

### Update Backend
1. Push changes to GitHub
2. Render auto-deploys (2-3 min)

### Update Frontend
1. Push changes to GitHub
2. Vercel auto-deploys (1-2 min)

### Update Extension
1. Update code
2. Reload extension in Chrome
3. Or publish new version to Chrome Web Store

---

## Cost Summary

- Render: $0/month (free tier)
- Vercel: $0/month (free tier)
- Supabase: $0/month (free tier)
- Chrome Web Store: $5 one-time (optional)

**Total: $0/month** 🎉

---

## Support

If you encounter issues:
1. Check Render logs: Dashboard → Logs
2. Check Vercel logs: Project → Deployments → Logs
3. Check browser console: F12 → Console
4. Check extension console: chrome://extensions → Details → Inspect views

---

## Next Steps

1. Set up custom domain (optional, free with Vercel)
2. Enable UptimeRobot to prevent backend sleep
3. Add analytics (Vercel Analytics is free)
4. Set up error monitoring (Sentry free tier)
