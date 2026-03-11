# MongoDB Setup Guide

You have two options for MongoDB:

## Option 1: MongoDB Atlas (Cloud - Recommended, No Installation)

This is the easiest option - no local installation needed!

### Steps:

1. **Create Free Account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free (no credit card required)

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a cloud provider and region close to you
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `admin`
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Allow Network Access**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add database name at the end: `mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/academic-dashboard`

6. **Set Environment Variable**
   
   Create a file named `.env` in the project root:
   ```
   MONGODB_URI=mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/academic-dashboard
   ```

7. **Install dotenv**
   ```bash
   npm install dotenv
   ```

8. **Update server to use .env**
   The server is already configured to use environment variables!

---

## Option 2: Local MongoDB Installation

### For Windows:

1. **Download MongoDB**
   - Go to https://www.mongodb.com/try/download/community
   - Select "Windows" and download the MSI installer
   - Version: Latest (7.0 or higher)

2. **Install MongoDB**
   - Run the downloaded MSI file
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (GUI tool) - optional but helpful

3. **Verify Installation**
   ```bash
   mongod --version
   ```

4. **Start MongoDB Service**
   - MongoDB should start automatically as a Windows service
   - Or manually: Open Services (Win+R, type `services.msc`)
   - Find "MongoDB Server" and start it

5. **Default Connection**
   - MongoDB runs on `mongodb://localhost:27017`
   - No configuration needed - server will connect automatically!

### For Mac:

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

### For Linux:

```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

## Quick Start with MongoDB Atlas (Recommended)

I'll help you set this up quickly:

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create free cluster (M0)
4. Create database user
5. Allow network access (0.0.0.0/0 for development)
6. Get connection string
7. Create `.env` file with your connection string

Then just restart the server and it will connect automatically!

---

## Verify Connection

Once MongoDB is set up, start the server:

```bash
npm run server
```

You should see:
```
✅ Connected to MongoDB
📊 Database: academic-dashboard
🚀 Server running on http://localhost:3000
```

If you see connection errors, check:
- MongoDB service is running (local) or connection string is correct (Atlas)
- Network access is allowed (Atlas)
- Username and password are correct (Atlas)

---

## Which Option Should I Choose?

**Choose MongoDB Atlas (Cloud) if:**
- ✅ You want the easiest setup
- ✅ You don't want to install anything locally
- ✅ You want automatic backups
- ✅ You want to access data from anywhere
- ✅ Free tier is sufficient (512MB storage)

**Choose Local MongoDB if:**
- ✅ You want full control
- ✅ You prefer local development
- ✅ You don't want to rely on internet connection
- ✅ You need unlimited storage

---

## Need Help?

I can help you set up either option! Just let me know which one you prefer.
