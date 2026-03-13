# 🚀 Complete Beginner's Deployment Guide

## What You'll Need
- A GitHub account (free)
- Your Supabase database connection string
- 2 hours of time
- This guide (follow step by step!)

---

## 📋 PART 1: Prepare Your Code (15 minutes)

### Step 1: Create a GitHub Account (if you don't have one)

1. Go to https://github.com
2. Click "Sign up"
3. Enter your email, create a password
4. Verify your email
5. Done!

### Step 2: Install Git on Your Computer

**Windows:**
1. Go to https://git-scm.com/download/win
2. Download the installer
3. Run it and click "Next" for everything (use defaults)
4. Done!

**To check if Git is installed:**
1. Open Command Prompt (search "cmd" in Windows)
2. Type: `git --version`
3. You should see something like "git version 2.x.x"

### Step 3: Upload Your Code to GitHub

1. Open Command Prompt in your project folder:
   - Navigate to your project folder in File Explorer
   - Type `cmd` in the address bar and press Enter

2. Type these commands ONE BY ONE (press Enter after each):

```bash
git init
```
(This creates a git repository)

```bash
git add .
```
(This adds all your files)

```bash
git commit -m "Initial commit"
```
(This saves your files)

3. Now go to GitHub website:
   - Click the "+" icon (top right)
   - Click "New repository"
   - Name it: `swis-app` (or any name you like)
   - Keep it PUBLIC
   - DON'T check any boxes
   - Click "Create repository"

4. GitHub will show you commands. Copy the ones that look like this:

```bash
git remote add origin https://github.com/YOUR-USERNAME/swis-app.git
git branch -M main
git push -u origin main
```

5. Paste them in your Command Prompt and press Enter
6. Enter your GitHub username and password when asked
7. Your code is now on GitHub! 🎉

---

## 📋 PART 2: Deploy Backend to Render (30 minutes)

### Step 1: Sign Up for Render

1. Go to https://render.com
2. Click "Get Started for Free"
3. Click "GitHub" to sign up with GitHub
4. Authorize Render to access your GitHub
5. You're in!

### Step 2: Create a Web Service

1. Click the big blue "New +" button (top right)
2. Select "Web Service"
3. Click "Connect" next to your `swis-app` repository
   - If you don't see it, click "Configure account" and give Render access
4. You'll see a form. Fill it like this:

**Name:** `swis-backend` (or any name)
**Region:** Oregon (US West)
**Branch:** main
**Root Directory:** (leave EMPTY)
**Runtime:** Node
**Build Command:** 
```
cd server && npm install
```
**Start Command:**
```
cd server && node index.js
```
**Instance Type:** Free

5. Scroll down to "Environment Variables"
6. Click "Add Environment Variable"
7. Add these ONE BY ONE:

**First variable:**
- Key: `DATABASE_URL`
- Value: (paste your Supabase connection string here)
  - Go to Supabase → Project Settings → Database → Connection String
  - Copy the "URI" format
  - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@...`

**Second variable:**
- Key: `NODE_ENV`
- Value: `production`

8. Click "Create Web Service" (bottom of page)

### Step 3: Wait for Deployment

1. Render will start building your app
2. You'll see logs scrolling (this is normal!)
3. Wait 5-10 minutes
4. When you see "✅ Server running on http://0.0.0.0:3000" - it's done!
5. At the top, you'll see your URL: `https://swis-backend-xxxx.onrender.com`
6. **COPY THIS URL** - you'll need it!

### Step 4: Test Your Backend

1. Click on your backend URL
2. Add `/api/health` to the end
3. Full URL: `https://swis-backend-xxxx.onrender.com/api/health`
4. You should see:
```json
{
  "status": "ok",
  "database": "connected"
}
```
5. If you see this - SUCCESS! ✅

---

## 📋 PART 3: Deploy Frontend to Vercel (20 minutes)

### Step 1: Sign Up for Vercel

1. Go to https://vercel.com
2. Click "Sign Up"
3. Click "Continue with GitHub"
4. Authorize Vercel
5. You're in!

### Step 2: Import Your Project

1. Click "Add New..." button
2. Select "Project"
3. Find your `swis-app` repository
4. Click "Import"

### Step 3: Configure the Project

You'll see a configuration page. Fill it like this:

**Framework Preset:** Vite
**Root Directory:** Click "Edit" → Type `frontend` → Click "Continue"
**Build Command:** (should auto-fill as `npm run build`)
**Output Directory:** (should auto-fill as `dist`)

### Step 4: Add Environment Variable

1. Click "Environment Variables" section
2. Add this:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://swis-backend-xxxx.onrender.com/api`
     (Use YOUR backend URL from Render, add `/api` at the end)
3. Click "Add"

### Step 5: Deploy!

1. Click "Deploy" button
2. Wait 2-3 minutes
3. You'll see confetti when it's done! 🎉
4. Click "Continue to Dashboard"
5. At the top, click "Visit" to see your app
6. **COPY YOUR VERCEL URL** - it looks like: `https://swis-app-xxxx.vercel.app`

### Step 6: Test Your Frontend

1. Visit your Vercel URL
2. You should see your login page
3. Try to register a new account
4. If it works - SUCCESS! ✅

---

## 📋 PART 4: Update Browser Extension (15 minutes)

### Step 1: Update Extension Code

1. Open your project in your code editor
2. Open file: `extension/background.js`
3. Find these lines (near the top):

```javascript
const API_URL = 'http://localhost:3000/api';
const DASHBOARD_URL = 'http://localhost:5173';
```

4. Change them to:

```javascript
const API_URL = 'https://swis-backend-xxxx.onrender.com/api';
const DASHBOARD_URL = 'https://swis-app-xxxx.vercel.app';
```
(Use YOUR actual URLs!)

5. Save the file

### Step 2: Update CORS in Backend

1. Go to your project folder
2. Open file: `server/index.js`
3. Find this line (around line 18):

```javascript
app.use(cors());
```

4. Replace it with:

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

5. Save the file

### Step 3: Push Changes to GitHub

1. Open Command Prompt in your project folder
2. Type these commands:

```bash
git add .
git commit -m "Update URLs for production"
git push
```

3. Render and Vercel will automatically redeploy (wait 2-3 minutes)

### Step 4: Install Extension in Chrome

1. Open Chrome browser
2. Type in address bar: `chrome://extensions/`
3. Turn ON "Developer mode" (top right toggle)
4. Click "Load unpacked" button
5. Navigate to your project folder → `extension` folder
6. Click "Select Folder"
7. Extension is now installed! 🎉

---

## 📋 PART 5: Test Everything (10 minutes)

### Test 1: Frontend Works

1. Go to your Vercel URL
2. Register a new account
3. Login
4. Check all pages load:
   - Dashboard
   - Assignments
   - Study Sessions
   - Analytics
   - Insights
   - Settings

### Test 2: Extension Works

1. Make sure you're logged into your web app
2. Browse some websites (YouTube, Google, etc.)
3. Wait 1 minute
4. Go back to your web app
5. Click "Analytics" page
6. You should see the websites you visited!

### Test 3: Everything Syncs

1. Add an assignment
2. Log a study session
3. Check the dashboard updates
4. Check insights page shows data

---

## 📋 PART 6: Keep Backend Awake (Optional - 10 minutes)

Your backend sleeps after 15 minutes of no activity. To prevent this:

### Step 1: Sign Up for UptimeRobot

1. Go to https://uptimerobot.com
2. Click "Free Sign Up"
3. Create account
4. Verify email

### Step 2: Create Monitor

1. Click "Add New Monitor"
2. Fill in:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** SWIS Backend
   - **URL:** `https://swis-backend-xxxx.onrender.com/api/health`
     (Use YOUR backend URL)
   - **Monitoring Interval:** 5 minutes
3. Click "Create Monitor"
4. Done! Your backend will never sleep now! 🎉

---

## 🎉 YOU'RE DONE!

Your app is now live on the internet!

**Your URLs:**
- Frontend: `https://swis-app-xxxx.vercel.app`
- Backend: `https://swis-backend-xxxx.onrender.com`
- Extension: Installed in Chrome

**Share your app:**
- Send the Vercel URL to friends
- They can register and use it!

---

## 🆘 Troubleshooting

### Problem: "Cannot connect to backend"

**Solution:**
1. Check your backend is running: Visit `https://your-backend.onrender.com/api/health`
2. Check VITE_API_URL in Vercel settings matches your backend URL
3. Check CORS settings in `server/index.js` include your Vercel URL

### Problem: "Extension not tracking"

**Solution:**
1. Make sure you're logged into the web app
2. Check extension popup shows your name
3. Check API_URL in `extension/background.js` is correct
4. Reload the extension: chrome://extensions → Click reload icon

### Problem: "Database connection failed"

**Solution:**
1. Check DATABASE_URL in Render environment variables
2. Make sure Supabase database is not paused
3. Check connection string is correct (includes password)

### Problem: "Render backend is slow"

**Solution:**
- This is normal on free tier (cold start after 15 min)
- Set up UptimeRobot (see Part 6) to keep it awake
- First request takes 30-60 seconds, then it's fast

### Problem: "Can't push to GitHub"

**Solution:**
1. Make sure you're in the project folder
2. Check you ran `git init` first
3. Use GitHub personal access token instead of password:
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Generate new token (classic)
   - Use token as password when pushing

---

## 📝 Important Notes

1. **Free tier limitations:**
   - Render: Backend sleeps after 15 min (use UptimeRobot to prevent)
   - Vercel: No limitations on frontend
   - Supabase: 500MB storage, 2GB bandwidth/month

2. **Updating your app:**
   - Just push to GitHub: `git add .` → `git commit -m "message"` → `git push`
   - Render and Vercel auto-deploy in 2-3 minutes

3. **Costs:**
   - Everything is FREE
   - No credit card needed
   - No hidden charges

4. **Support:**
   - Render docs: https://render.com/docs
   - Vercel docs: https://vercel.com/docs
   - If stuck, check the logs in Render/Vercel dashboard

---

## 🎓 What You Learned

- How to use Git and GitHub
- How to deploy a Node.js backend
- How to deploy a React frontend
- How to configure environment variables
- How to install a Chrome extension
- How to keep a server awake
- How to troubleshoot deployment issues

**Congratulations! You're now a deployment expert! 🚀**
