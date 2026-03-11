# 🐘 PostgreSQL Setup Guide

## Quick Setup Options

You have three easy options:

### Option 1: Supabase (Recommended - Cloud, Free, No Installation!)
- ✅ No installation needed
- ✅ Free tier (500MB database)
- ✅ Setup in 5 minutes
- ✅ Automatic backups
- ✅ Built-in dashboard

### Option 2: Local PostgreSQL
- ✅ Full control
- ✅ Works offline
- ✅ Unlimited storage
- ✅ Fast performance

### Option 3: Other Cloud Providers
- Neon (free tier)
- Railway (free tier)
- ElephantSQL (free tier)

---

## 🚀 Option 1: Supabase (Easiest - 5 Minutes)

### Step 1: Create Account (1 minute)
1. Go to: https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email
4. No credit card required!

### Step 2: Create Project (2 minutes)
1. Click "New Project"
2. Choose organization (or create one)
3. Project name: `academic-dashboard`
4. Database password: Create a strong password (SAVE IT!)
5. Region: Choose closest to you
6. Click "Create new project"
7. Wait 2 minutes for setup

### Step 3: Get Connection String (1 minute)
1. Go to "Project Settings" (gear icon)
2. Click "Database" in left menu
3. Scroll to "Connection string"
4. Select "URI" tab
5. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your actual password

### Step 4: Update .env File (30 seconds)
1. Open `.env` file in project folder
2. Replace the DATABASE_URL line:
   ```
   DATABASE_URL=postgresql://postgres:yourpassword@db.xxxxx.supabase.co:5432/postgres
   ```
3. Save the file

### Step 5: Start Server
```bash
npm run server
```

You should see:
```
✅ Connected to PostgreSQL
📊 Database: postgres
✅ Database tables synchronized
🚀 Server running on http://localhost:3000
```

**Done! Your database is ready!** 🎉

---

## 💻 Option 2: Local PostgreSQL Installation

### Windows:

#### Method 1: Using Installer (Recommended)
1. **Download PostgreSQL**
   - Go to: https://www.postgresql.org/download/windows/
   - Download the installer (latest version)

2. **Install PostgreSQL**
   - Run the installer
   - Default port: 5432 (keep it)
   - Set password for postgres user: `postgres` (or your choice)
   - Install Stack Builder: Optional
   - Install pgAdmin: Yes (GUI tool)

3. **Verify Installation**
   ```bash
   psql --version
   ```

4. **Create Database**
   Open Command Prompt or PowerShell:
   ```bash
   psql -U postgres
   # Enter password when prompted
   CREATE DATABASE academic_dashboard;
   \q
   ```

#### Method 2: Using Chocolatey
```bash
choco install postgresql
```

### Mac:

#### Using Homebrew (Recommended)
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Create database
createdb academic_dashboard
```

#### Using Postgres.app
1. Download from: https://postgresapp.com/
2. Install and run
3. Click "Initialize" to create server
4. Database ready!

### Linux (Ubuntu/Debian):

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres createdb academic_dashboard

# Set password for postgres user
sudo -u postgres psql
ALTER USER postgres PASSWORD 'postgres';
\q
```

### Verify Local Setup:

The `.env` file is already configured for local PostgreSQL:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/academic_dashboard
```

If you used a different password, update it in `.env`.

---

## 🌐 Option 3: Other Cloud Providers

### Neon (Serverless PostgreSQL)
1. Go to: https://neon.tech
2. Sign up (free tier: 3GB)
3. Create project
4. Copy connection string
5. Update `.env` file

### Railway
1. Go to: https://railway.app
2. Sign up with GitHub
3. New Project → PostgreSQL
4. Copy connection string
5. Update `.env` file

### ElephantSQL
1. Go to: https://www.elephantsql.com
2. Sign up (free tier: 20MB)
3. Create instance
4. Copy connection URL
5. Update `.env` file

---

## 🧪 Test Your Setup

### 1. Start the server
```bash
cd "dummy application/Academic Web Dashboard Design"
npm run server
```

Expected output:
```
✅ Connected to PostgreSQL
📊 Database: academic_dashboard
✅ Database tables synchronized
🚀 Server running on http://localhost:3000
```

### 2. Check health endpoint
Open in browser: http://localhost:3000/api/health

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-03-09T..."
}
```

### 3. Test registration
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

Expected response:
```json
{"success":true,"userId":1}
```

---

## 🔧 Troubleshooting

### "Connection refused" error

**Local PostgreSQL:**
- Make sure PostgreSQL is running
- Windows: Check Services for "postgresql" service
- Mac: `brew services list`
- Linux: `sudo systemctl status postgresql`

**Cloud PostgreSQL:**
- Check your connection string
- Verify password is correct
- Check if IP is whitelisted (Supabase allows all by default)

### "Database does not exist"

**Local:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE academic_dashboard;

# Exit
\q
```

**Cloud:**
- Database is created automatically
- Use the database name from connection string

### "Authentication failed"

- Check username and password in `.env`
- For local: default is `postgres:postgres`
- For cloud: use credentials from provider

### "Port 5432 already in use"

Another PostgreSQL instance is running:
- Stop other instances
- Or use a different port in connection string

---

## 📊 Database Management Tools

### pgAdmin (Desktop)
- Comes with PostgreSQL installer
- Full-featured GUI
- Great for complex queries

### Supabase Dashboard (Web)
- Built-in with Supabase
- Table editor
- SQL editor
- Real-time data

### DBeaver (Desktop)
- Free and open source
- Works with many databases
- Download: https://dbeaver.io/

### TablePlus (Desktop)
- Modern UI
- Mac, Windows, Linux
- Free tier available
- Download: https://tableplus.com/

---

## 🎯 Which Option Should I Choose?

### Choose Supabase if:
- ✅ You want the easiest setup
- ✅ You don't want to install anything
- ✅ You want automatic backups
- ✅ You want a web dashboard
- ✅ 500MB is enough (it is for this project!)

### Choose Local PostgreSQL if:
- ✅ You want full control
- ✅ You prefer offline development
- ✅ You need unlimited storage
- ✅ You want fastest performance

### Choose Other Cloud if:
- ✅ You have specific requirements
- ✅ You're already using that platform
- ✅ You need specific features

---

## 💡 My Recommendation

**Use Supabase** because:
1. No installation needed
2. Free forever (500MB)
3. Setup in 5 minutes
4. Professional-grade database
5. Built-in dashboard
6. Automatic backups
7. Easy to scale

**It's perfect for this project!**

---

## 🆘 Need Help?

Let me know:
- Which option you want to use
- Any errors you're seeing
- Where you're stuck

I'll help you get it working! 🚀

---

## 📝 Connection String Format

```
postgresql://username:password@host:port/database

Examples:
- Local: postgresql://postgres:postgres@localhost:5432/academic_dashboard
- Supabase: postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres
- Neon: postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname
```

---

**Ready to start?** Choose your option and follow the steps above!
