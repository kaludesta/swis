# 🚀 Quick MongoDB Setup (5 Minutes)

## Easiest Option: MongoDB Atlas (Cloud - No Installation!)

### Step 1: Create Free Account (2 minutes)
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google account
3. No credit card required!

### Step 2: Create Free Cluster (1 minute)
1. Click "Build a Database"
2. Choose **"M0 FREE"** tier
3. Pick any cloud provider and region
4. Click "Create"
5. Wait 1-3 minutes for cluster to deploy

### Step 3: Create Database User (1 minute)
1. Click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Username: `admin`
4. Password: Click "Autogenerate Secure Password" and **COPY IT**
5. User Privileges: "Atlas admin"
6. Click "Add User"

### Step 4: Allow Network Access (30 seconds)
1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. Click "Confirm"

### Step 5: Get Connection String (1 minute)
1. Click "Database" (left sidebar)
2. Click "Connect" button on your cluster
3. Choose "Drivers"
4. Copy the connection string (looks like this):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/
   ```
5. Replace `<password>` with the password you copied in Step 3
6. Add database name at the end: `academic-dashboard`

Final string should look like:
```
mongodb+srv://admin:YourPassword123@cluster0.xxxxx.mongodb.net/academic-dashboard
```

### Step 6: Update .env File (30 seconds)
1. Open `.env` file in the project folder
2. Replace the line with your connection string:
   ```
   MONGODB_URI=mongodb+srv://admin:YourPassword123@cluster0.xxxxx.mongodb.net/academic-dashboard
   ```
3. Save the file

### Step 7: Start the Server
```bash
npm run server
```

You should see:
```
✅ Connected to MongoDB
📊 Database: academic-dashboard
🚀 Server running on http://localhost:3000
```

**Done! Your database is ready!** 🎉

---

## Alternative: Install MongoDB Locally

If you prefer local installation:

### Windows:
1. Download: https://www.mongodb.com/try/download/community
2. Run the MSI installer
3. Choose "Complete" installation
4. Install as Windows Service
5. MongoDB will start automatically

### Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu):
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

The `.env` file is already configured for local MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/academic-dashboard
```

---

## Troubleshooting

### "MongooseServerSelectionError: connect ECONNREFUSED"
- **Atlas**: Check your connection string and password
- **Local**: Make sure MongoDB service is running

### "Authentication failed"
- Double-check your username and password in the connection string
- Make sure you copied the password correctly (no extra spaces)

### "IP not whitelisted"
- Go to Network Access in Atlas
- Make sure "0.0.0.0/0" is added (allows all IPs)

---

## Which Should I Choose?

**MongoDB Atlas (Recommended):**
- ✅ No installation
- ✅ Works immediately
- ✅ Free 512MB storage
- ✅ Automatic backups
- ✅ Access from anywhere

**Local MongoDB:**
- ✅ Full control
- ✅ Works offline
- ✅ Unlimited storage
- ✅ Faster (no network latency)

---

## Need Help?

Just let me know which option you want and I can guide you through it!
