# 🚀 Supabase Quick Start (5 Minutes)

## Why Supabase?
- ✅ No installation needed
- ✅ Free forever (500MB database)
- ✅ PostgreSQL database
- ✅ Built-in dashboard
- ✅ Automatic backups
- ✅ Setup in 5 minutes

---

## Step-by-Step Setup

### Step 1: Create Account (1 minute)

1. Go to: **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with:
   - GitHub (recommended - one click)
   - Or email address
4. No credit card required!

---

### Step 2: Create Project (2 minutes)

1. After login, click **"New Project"**

2. If prompted, create an organization:
   - Name: `My Projects` (or anything you like)
   - Click **"Create organization"**

3. Fill in project details:
   - **Name**: `academic-dashboard`
   - **Database Password**: Click "Generate a password" and **COPY IT!**
     - Save it somewhere safe (you'll need it in Step 3)
   - **Region**: Choose closest to you (e.g., US East, Europe West)
   - **Pricing Plan**: Free (already selected)

4. Click **"Create new project"**

5. Wait 1-2 minutes while Supabase sets up your database
   - You'll see a progress indicator
   - Don't close the page!

---

### Step 3: Get Connection String (1 minute)

1. Once project is ready, click **"Project Settings"** (gear icon in left sidebar)

2. Click **"Database"** in the left menu

3. Scroll down to **"Connection string"** section

4. Click the **"URI"** tab

5. You'll see something like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijk.supabase.co:5432/postgres
   ```

6. **Important**: Replace `[YOUR-PASSWORD]` with the password you copied in Step 2
   - Remove the brackets `[]`
   - Just paste your password

7. **Copy the complete connection string**

Example final string:
```
postgresql://postgres:MySecurePass123@db.abcdefghijk.supabase.co:5432/postgres
```

---

### Step 4: Update .env File (30 seconds)

1. Open your project folder:
   ```
   dummy application/Academic Web Dashboard Design
   ```

2. Open the `.env` file in a text editor

3. Find this line:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/academic_dashboard
   ```

4. Replace it with your Supabase connection string:
   ```
   DATABASE_URL=postgresql://postgres:MySecurePass123@db.abcdefghijk.supabase.co:5432/postgres
   ```

5. **Save the file**

---

### Step 5: Start the Server (30 seconds)

1. Open terminal/command prompt

2. Navigate to project folder:
   ```bash
   cd "dummy application/Academic Web Dashboard Design"
   ```

3. Start the server:
   ```bash
   npm run server
   ```

4. You should see:
   ```
   ✅ Connected to PostgreSQL
   📊 Database: postgres
   ✅ Database tables synchronized
   🚀 Server running on http://localhost:3000
   ```

---

## ✅ Verify It Works

### Test 1: Health Check

Open in browser: **http://localhost:3000/api/health**

You should see:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-03-09T..."
}
```

### Test 2: Register a User

Open a new terminal and run:
```bash
curl -X POST http://localhost:3000/api/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"test123\",\"name\":\"Test User\"}"
```

You should see:
```json
{"success":true,"userId":1}
```

### Test 3: Check Supabase Dashboard

1. Go back to Supabase dashboard
2. Click **"Table Editor"** in left sidebar
3. You should see your tables:
   - users
   - website_tracking
   - study_sessions
   - assignments
4. Click on **"users"** table
5. You should see your test user!

---

## 🎉 Success!

Your database is now set up and working! You can:

1. **Start the frontend**:
   ```bash
   npm run dev
   ```

2. **Open the dashboard**: http://localhost:5173

3. **Register an account** and start using the app!

4. **Install browser extension** (see INSTALL_GUIDE.md)

---

## 🔍 Supabase Dashboard Features

### Table Editor
- View and edit data
- Add/delete rows
- Filter and search

### SQL Editor
- Run custom SQL queries
- Save queries
- View query history

### Database
- Connection strings
- Connection pooling
- Database settings

### API
- Auto-generated REST API
- Real-time subscriptions
- Authentication

---

## 🐛 Troubleshooting

### "Connection refused" or "Authentication failed"

**Check your connection string:**
1. Make sure you replaced `[YOUR-PASSWORD]` with actual password
2. No brackets `[]` should remain
3. No extra spaces
4. Password is correct

**Example of WRONG string:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

**Example of CORRECT string:**
```
postgresql://postgres:MyActualPassword123@db.xxx.supabase.co:5432/postgres
```

### "Database does not exist"

- This shouldn't happen with Supabase
- The database is created automatically
- Make sure you're using the connection string from Supabase dashboard

### Can't find connection string?

1. Go to Supabase dashboard
2. Click your project
3. Click "Project Settings" (gear icon)
4. Click "Database"
5. Scroll to "Connection string"
6. Click "URI" tab

### Forgot your password?

1. Go to Supabase dashboard
2. Project Settings → Database
3. Click "Reset database password"
4. Generate new password
5. Update `.env` file with new connection string

---

## 💡 Tips

### Keep Your Password Safe
- Don't share your connection string
- Don't commit `.env` file to git
- Save password in a password manager

### Use Supabase Dashboard
- View your data in real-time
- Run SQL queries
- Monitor database usage

### Free Tier Limits
- 500MB database storage
- Unlimited API requests
- 2GB bandwidth
- More than enough for this project!

---

## 📊 What's Next?

1. ✅ Database is set up
2. ✅ Server is running
3. ⏳ Start the frontend (`npm run dev`)
4. ⏳ Register an account
5. ⏳ Install browser extension
6. ⏳ Start tracking your time!

---

## 🆘 Need Help?

If you're stuck:
1. Check the troubleshooting section above
2. Verify your connection string is correct
3. Make sure you replaced `[YOUR-PASSWORD]`
4. Let me know what error you're seeing!

---

**Congratulations! Your PostgreSQL database is ready!** 🎉

Now start the frontend and begin using your Academic Dashboard!
