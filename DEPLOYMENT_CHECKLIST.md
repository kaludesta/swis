# 🚀 Deployment Checklist

Follow this checklist step by step. Check off each item as you complete it.

---

## ✅ PART 1: GitHub Setup (15 min)

- [ ] 1. Create GitHub account at https://github.com
- [ ] 2. Download and install Git from https://git-scm.com/download/win
- [ ] 3. Open Command Prompt in your project folder
- [ ] 4. Run: `git init`
- [ ] 5. Run: `git add .`
- [ ] 6. Run: `git commit -m "Initial commit"`
- [ ] 7. Create new repository on GitHub (name: `swis-app`, keep it PUBLIC)
- [ ] 8. Copy the commands GitHub shows you and run them
- [ ] 9. Refresh GitHub page - you should see your code!

**✅ Checkpoint:** Your code is now on GitHub

---

## ✅ PART 2: Deploy Backend (30 min)

- [ ] 1. Go to https://render.com and sign up with GitHub
- [ ] 2. Click "New +" → "Web Service"
- [ ] 3. Connect your `swis-app` repository
- [ ] 4. Fill in the form:
  - Name: `swis-backend`
  - Region: Oregon (US West)
  - Branch: main
  - Root Directory: (leave empty)
  - Runtime: Node
  - Build Command: `cd server && npm install`
  - Start Command: `cd server && node index.js`
  - Instance Type: Free

- [ ] 5. Add Environment Variables:
  - `DATABASE_URL` = (your Supabase connection string)
  - `NODE_ENV` = production

- [ ] 6. Click "Create Web Service"
- [ ] 7. Wait 5-10 minutes for deployment
- [ ] 8. Copy your backend URL: `https://swis-backend-xxxx.onrender.com`
- [ ] 9. Test it: Visit `https://swis-backend-xxxx.onrender.com/api/health`
- [ ] 10. You should see: `{"status":"ok","database":"connected"}`

**✅ Checkpoint:** Backend is live!

**Your Backend URL:** ________________________________

---

## ✅ PART 3: Deploy Frontend (20 min)

- [ ] 1. Go to https://vercel.com and sign up with GitHub
- [ ] 2. Click "Add New..." → "Project"
- [ ] 3. Import your `swis-app` repository
- [ ] 4. Configure:
  - Framework Preset: Vite
  - Root Directory: `frontend`
  - Build Command: (auto-filled)
  - Output Directory: (auto-filled)

- [ ] 5. Add Environment Variable:
  - Key: `VITE_API_URL`
  - Value: `https://swis-backend-xxxx.onrender.com/api` (YOUR backend URL + /api)

- [ ] 6. Click "Deploy"
- [ ] 7. Wait 2-3 minutes
- [ ] 8. Click "Visit" to see your app
- [ ] 9. Copy your frontend URL: `https://swis-app-xxxx.vercel.app`
- [ ] 10. Test: Try to register and login

**✅ Checkpoint:** Frontend is live!

**Your Frontend URL:** ________________________________

---

## ✅ PART 4: Update Extension (15 min)

- [ ] 1. Open `extension/background.js` in your code editor
- [ ] 2. Find these lines:
```javascript
const API_URL = 'http://localhost:3000/api';
const DASHBOARD_URL = 'http://localhost:5173';
```

- [ ] 3. Change them to YOUR URLs:
```javascript
const API_URL = 'https://swis-backend-xxxx.onrender.com/api';
const DASHBOARD_URL = 'https://swis-app-xxxx.vercel.app';
```

- [ ] 4. Save the file
- [ ] 5. Open `server/index.js`
- [ ] 6. Find: `app.use(cors());`
- [ ] 7. Replace with:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://swis-app-xxxx.vercel.app',
    'chrome-extension://*'
  ],
  credentials: true
}));
```
(Use YOUR Vercel URL!)

- [ ] 8. Save the file
- [ ] 9. Open Command Prompt in project folder
- [ ] 10. Run: `git add .`
- [ ] 11. Run: `git commit -m "Update URLs for production"`
- [ ] 12. Run: `git push`
- [ ] 13. Wait 2-3 minutes for auto-redeploy

**✅ Checkpoint:** Code updated and redeployed!

---

## ✅ PART 5: Install Extension (5 min)

- [ ] 1. Open Chrome browser
- [ ] 2. Go to: `chrome://extensions/`
- [ ] 3. Turn ON "Developer mode" (top right)
- [ ] 4. Click "Load unpacked"
- [ ] 5. Select your project's `extension` folder
- [ ] 6. Extension icon appears in toolbar!

**✅ Checkpoint:** Extension installed!

---

## ✅ PART 6: Test Everything (10 min)

- [ ] 1. Visit your Vercel URL
- [ ] 2. Register a new account
- [ ] 3. Login successfully
- [ ] 4. Check Dashboard page loads
- [ ] 5. Add a test assignment
- [ ] 6. Log a study session
- [ ] 7. Browse some websites (YouTube, Google, etc.)
- [ ] 8. Wait 1 minute
- [ ] 9. Go to Analytics page
- [ ] 10. You should see the websites you visited!
- [ ] 11. Check Insights page shows data

**✅ Checkpoint:** Everything works!

---

## ✅ PART 7: Keep Backend Awake (Optional - 10 min)

- [ ] 1. Go to https://uptimerobot.com
- [ ] 2. Sign up for free account
- [ ] 3. Verify email
- [ ] 4. Click "Add New Monitor"
- [ ] 5. Fill in:
  - Monitor Type: HTTP(s)
  - Friendly Name: SWIS Backend
  - URL: `https://swis-backend-xxxx.onrender.com/api/health`
  - Monitoring Interval: 5 minutes

- [ ] 6. Click "Create Monitor"

**✅ Checkpoint:** Backend will never sleep!

---

## 🎉 YOU'RE DONE!

Your app is now live on the internet!

**Save these URLs:**
- Frontend: ________________________________
- Backend: ________________________________

**Share with friends:**
Send them your frontend URL and they can register!

---

## 📝 Quick Reference

**Update your app:**
```bash
git add .
git commit -m "your message"
git push
```
(Render and Vercel auto-deploy in 2-3 minutes)

**Check backend logs:**
Go to Render dashboard → Your service → Logs

**Check frontend logs:**
Go to Vercel dashboard → Your project → Deployments → Click latest → Logs

**Extension not working?**
1. Make sure you're logged into the web app
2. Check extension popup shows your name
3. Reload extension: chrome://extensions → Click reload icon

---

## 🆘 Need Help?

Read the full guide: `BEGINNER_DEPLOYMENT_GUIDE.md`

Common issues:
- Backend slow? Normal on free tier (30s cold start)
- Can't connect? Check CORS settings in server/index.js
- Extension not syncing? Check API_URL in background.js
- Database error? Verify DATABASE_URL in Render

---

**Congratulations! You deployed a full-stack app! 🚀**
