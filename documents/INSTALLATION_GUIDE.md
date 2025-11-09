# Installation Guide - The Lil Gift Corner

**Document Version**: 1.0  
**Project Version**: 2.0.0  
**Last Updated**: January 2025

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installation Methods](#installation-methods)
4. [Quick Start (5 Minutes)](#quick-start-5-minutes)
5. [Detailed Installation](#detailed-installation)
6. [Platform-Specific Instructions](#platform-specific-instructions)
7. [Verification](#verification)
8. [Common Issues](#common-issues)
9. [Next Steps](#next-steps)

---

## Prerequisites

Before installing The Lil Gift Corner, ensure you have the following software installed on your system:

### Required Software

| Software | Minimum Version | Recommended Version | Purpose |
|----------|----------------|-------------------|---------|
| **Node.js** | 18.0.0 | 20.x.x or higher | JavaScript runtime for frontend |
| **Yarn** | 1.22.x | Latest | Package manager for frontend dependencies |
| **Python** | 3.10 | 3.11 or higher | Programming language for backend |
| **pip** | 21.0 | Latest | Package manager for Python |
| **MongoDB** | 4.4 | 6.0 or higher | NoSQL database |
| **Git** | 2.30 | Latest | Version control (for cloning repository) |

### Optional But Recommended

- **MongoDB Compass** - GUI for MongoDB database management
- **Postman** - API testing and development
- **VS Code** - Recommended code editor
- **Python virtual environment** - For isolated Python dependencies

---

## System Requirements

### Minimum Requirements

- **Operating System**: Linux, macOS, or Windows 10/11
- **CPU**: Dual-core processor
- **RAM**: 4 GB
- **Disk Space**: 2 GB free space
- **Internet Connection**: Required for initial setup and dependencies

### Recommended Requirements

- **Operating System**: Linux (Ubuntu 20.04+) or macOS 12+
- **CPU**: Quad-core processor
- **RAM**: 8 GB or more
- **Disk Space**: 5 GB free space
- **Internet Connection**: Broadband for development

---

## Installation Methods

### Method 1: Quick Start (Recommended for Testing)

Fast installation for local development and testing.

**Time**: ~5 minutes  
**Complexity**: Easy  
**Use Case**: Development, testing, evaluation

### Method 2: Detailed Installation (Recommended for Production)

Step-by-step installation with explanations and customization options.

**Time**: ~15-20 minutes  
**Complexity**: Moderate  
**Use Case**: Production deployment, customization

### Method 3: Docker Installation (Future)

Containerized installation using Docker and Docker Compose.

**Status**: Not yet implemented  
**Time**: ~5 minutes once available  
**Complexity**: Easy

---

## Quick Start (5 Minutes)

This quick start guide will get you up and running in about 5 minutes.

### Step 1: Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/kshitijomkar/lilgiftstore.git
cd lilgiftstore

# Or using SSH
git clone git@github.com:kshitijomkar/lilgiftstore.git
cd lilgiftstore
```

### Step 2: Install Backend Dependencies

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

cd ..
```

### Step 3: Install Frontend Dependencies

```bash
cd frontend

# Install dependencies using Yarn
yarn install

cd ..
```

### Step 4: Set Up Environment Variables

```bash
# Backend environment variables
cd backend
cp .env.example .env
# Edit .env with your preferred text editor
# At minimum, set MONGO_URL and JWT_SECRET

# Frontend environment variables
cd ../frontend
cp .env.example .env
# Set REACT_APP_BACKEND_URL=http://localhost:8001

cd ..
```

**Quick .env setup for development**:

Backend `.env`:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=lilgiftcorner_db
JWT_SECRET=your-super-secret-key-change-this-in-production
STRIPE_API_KEY=your_stripe_key
CORS_ORIGINS=http://localhost:3000
HOST=0.0.0.0
PORT=8001
```

Frontend `.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Step 5: Start MongoDB

```bash
# Linux (systemd)
sudo systemctl start mongod

# macOS (Homebrew)
brew services start mongodb-community

# Windows
# Start MongoDB service from Services app
# Or run: net start MongoDB

# Or run MongoDB manually
mongod --dbpath /path/to/data
```

### Step 6: Seed the Database (Optional)

```bash
cd backend
python seed_products.py
cd ..
```

### Step 7: Start the Application

**Option A: Using Supervisor (Recommended)**

```bash
# Start all services
sudo supervisorctl restart all

# Check status
sudo supervisorctl status
```

**Option B: Manual Start (Two Terminals)**

Terminal 1 (Backend):
```bash
cd backend
source venv/bin/activate  # if using venv
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Terminal 2 (Frontend):
```bash
cd frontend
yarn start
```

### Step 8: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/api/docs
- **Admin Dashboard**: http://localhost:3000/admin

**Default Admin Credentials**:
- Email: `admin@thelilgiftcorner.com`
- Password: `Admin@123`

⚠️ **IMPORTANT**: Change these credentials before deploying to production!

---

## Detailed Installation

This section provides detailed, step-by-step instructions with explanations.

### Part 1: System Preparation

#### 1.1 Install Node.js and Yarn

**Linux (Ubuntu/Debian)**:
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update
sudo apt-get install -y yarn

# Verify installation
node --version  # Should be v18.x or higher
yarn --version  # Should be 1.22.x
```

**macOS**:
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install Yarn
brew install yarn

# Verify installation
node --version
yarn --version
```

**Windows**:
1. Download Node.js installer from https://nodejs.org/
2. Run installer and follow wizard
3. Open Command Prompt and run: `npm install -g yarn`
4. Verify: `node --version` and `yarn --version`

#### 1.2 Install Python

**Linux (Ubuntu/Debian)**:
```bash
# Install Python 3.11
sudo apt-get update
sudo apt-get install -y python3.11 python3.11-venv python3-pip

# Verify installation
python3.11 --version
pip3 --version
```

**macOS**:
```bash
# Install Python via Homebrew
brew install python@3.11

# Verify installation
python3.11 --version
pip3 --version
```

**Windows**:
1. Download Python installer from https://www.python.org/
2. Run installer
3. ✅ Check "Add Python to PATH"
4. Verify in Command Prompt: `python --version`

#### 1.3 Install MongoDB

**Linux (Ubuntu 22.04)**:
```bash
# Import MongoDB public GPG key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# Create list file
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify installation
mongod --version
```

**macOS**:
```bash
# Install MongoDB via Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0

# Verify installation
mongod --version
```

**Windows**:
1. Download MongoDB installer from https://www.mongodb.com/try/download/community
2. Run installer
3. Choose "Complete" installation
4. Install MongoDB Compass (optional GUI)
5. Start MongoDB from Services app

**Alternative: MongoDB Atlas (Cloud)**

Instead of local MongoDB, you can use MongoDB Atlas:
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster (M0 tier)
3. Get connection string
4. Use in `.env` file

### Part 2: Application Setup

#### 2.1 Clone Repository

```bash
# Choose a directory for the project
cd ~/projects  # or your preferred location

# Clone via HTTPS
git clone https://github.com/kshitijomkar/lilgiftstore.git
cd lilgiftstore

# View project structure
ls -la
```

**Expected output**:
```
backend/
frontend/
tests/
docs/
documents/
README.md
.gitignore
```

#### 2.2 Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# Linux/macOS:
source venv/bin/activate
# Windows (Command Prompt):
# venv\Scripts\activate.bat
# Windows (PowerShell):
# venv\Scripts\Activate.ps1

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Verify installation
pip list | grep -E "fastapi|motor|pydantic"
```

**Expected packages**:
```
fastapi==0.110.1
motor==3.3.1
pydantic==2.12.4
pymongo==4.6.1
uvicorn==0.25.0
```

#### 2.3 Frontend Setup

```bash
cd ../frontend

# Install dependencies
yarn install

# This will take 2-5 minutes depending on internet speed

# Verify installation
yarn list --pattern "react|axios" --depth=0
```

**Expected packages**:
```
react@19.0.0
react-dom@19.0.0
react-router-dom@7.5.1
axios@1.8.4
```

#### 2.4 Environment Configuration

**Backend Environment Variables**:

Create `backend/.env`:
```bash
cd backend
nano .env  # or use your preferred editor
```

Add the following:
```env
# Database Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=lilgiftcorner_db

# Security
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DAYS=7

# Stripe Payment
STRIPE_API_KEY=your_stripe_key

# CORS
CORS_ORIGINS=http://localhost:3000

# Server
HOST=0.0.0.0
PORT=8001

# Logging
LOG_LEVEL=INFO

# Admin Credentials (for initial setup)
ADMIN_EMAIL=admin@thelilgiftcorner.com
ADMIN_PASSWORD=Admin@123

# Pagination
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100

# Stock Management
DEFAULT_STOCK_QUANTITY=100
DEFAULT_LOW_STOCK_THRESHOLD=10
```

**Frontend Environment Variables**:

Create `frontend/.env`:
```bash
cd ../frontend
nano .env
```

Add the following:
```env
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8001

# Optional Development Settings
WDS_SOCKET_PORT=3000
REACT_APP_ENABLE_VISUAL_EDITS=false
ENABLE_HEALTH_CHECK=false
```

### Part 3: Database Setup

#### 3.1 Start MongoDB

```bash
# Verify MongoDB is running
# Linux:
sudo systemctl status mongod

# macOS:
brew services list | grep mongodb

# Or check if MongoDB is listening
netstat -an | grep 27017
```

#### 3.2 Create Database and Seed Data

```bash
cd backend

# Ensure virtual environment is activated
source venv/bin/activate  # if using venv

# Run seed script
python seed_products.py
```

**Expected output**:
```
✅ Admin user created
✅ 20 products seeded
✅ Database indexes created
✅ Setup complete
```

#### 3.3 Verify Database

```bash
# Connect to MongoDB shell
mongosh

# Use the database
use lilgiftcorner_db

# Check collections
show collections

# Count products
db.products.countDocuments()
# Should return 20 (or number of seeded products)

# Check admin user
db.users.findOne({email: "admin@thelilgiftcorner.com"})

# Exit MongoDB shell
exit
```

### Part 4: Application Startup

#### 4.1 Start Backend

```bash
cd backend
source venv/bin/activate  # if using venv

# Start with Uvicorn
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Expected output**:
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Application startup complete
INFO:     Waiting for connection...
```

#### 4.2 Start Frontend

Open a new terminal:

```bash
cd frontend

# Start React development server
yarn start
```

**Expected output**:
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.x:3000
```

Your browser should automatically open to http://localhost:3000

---

## Platform-Specific Instructions

### Windows-Specific Notes

1. **Use PowerShell or Command Prompt** as administrator
2. **Path Separators**: Use backslashes (`\`) or forward slashes (`/`)
3. **Virtual Environment Activation**:
   ```cmd
   venv\Scripts\activate
   ```
4. **MongoDB**: Install as Windows Service
5. **Port Conflicts**: Check if ports 3000, 8001, 27017 are available
6. **Firewall**: May need to allow Node.js and Python through firewall

### macOS-Specific Notes

1. **Homebrew**: Primary package manager
2. **Xcode Command Line Tools** required:
   ```bash
   xcode-select --install
   ```
3. **Python**: macOS comes with Python 2.7, ensure you use Python 3.11+
4. **MongoDB**: Runs as background service via Homebrew

### Linux-Specific Notes

1. **Permissions**: May need `sudo` for system packages
2. **Systemd**: MongoDB runs as systemd service
3. **Firewall**: Configure UFW if needed:
   ```bash
   sudo ufw allow 3000
   sudo ufw allow 8001
   ```
4. **SELinux**: May need to adjust policies on RHEL/CentOS

---

## Verification

### Backend Verification

1. **Health Check**:
   ```bash
   curl http://localhost:8001/api/health
   ```
   Expected response:
   ```json
   {
     "status": "healthy",
     "app": "The Lil Gift Corner API",
     "version": "2.0.0"
   }
   ```

2. **API Documentation**:
   Visit http://localhost:8001/api/docs
   Should see Swagger UI with all endpoints

3. **Product Endpoint**:
   ```bash
   curl http://localhost:8001/api/products
   ```
   Should return JSON array of products

### Frontend Verification

1. **Homepage**: Visit http://localhost:3000
   - Should see landing page with hero section
   - Navigation bar should be visible
   - No console errors

2. **Shop Page**: Visit http://localhost:3000/shop
   - Products should be displayed
   - Filters should work

3. **Admin Login**: Visit http://localhost:3000/admin
   - Login with default credentials
   - Should access admin dashboard

### Database Verification

```bash
mongosh

use lilgiftcorner_db

# Verify collections exist
show collections

# Count documents
db.products.countDocuments()
db.users.countDocuments()

# Check indexes
db.products.getIndexes()

exit
```

---

## Common Issues

### Issue 1: Port Already in Use

**Symptom**: Error message "Address already in use" or "EADDRINUSE"

**Solution**:
```bash
# Find process using port 3000 (frontend)
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=3001 yarn start  # Frontend
uvicorn server:app --port 8002  # Backend
```

### Issue 2: MongoDB Connection Failed

**Symptom**: "Connection refused" or "MongoServerError"

**Solution**:
```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list | grep mongodb  # macOS

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log  # Linux
brew services list  # macOS
```

### Issue 3: Python Package Installation Failed

**Symptom**: "Could not build wheels" or "Installation failed"

**Solution**:
```bash
# Upgrade pip
pip install --upgrade pip setuptools wheel

# Install build dependencies (Linux)
sudo apt-get install python3-dev build-essential

# Install packages one by one
pip install fastapi
pip install motor
pip install pydantic
```

### Issue 4: Yarn Install Fails

**Symptom**: "Network error" or "Integrity check failed"

**Solution**:
```bash
# Clear Yarn cache
yarn cache clean

# Delete node_modules and yarn.lock
rm -rf node_modules yarn.lock

# Reinstall
yarn install

# Or use npm as fallback
npm install
```

### Issue 5: CORS Errors in Browser

**Symptom**: "CORS policy blocked" in browser console

**Solution**:
1. Check `CORS_ORIGINS` in backend `.env`
2. Ensure it includes `http://localhost:3000`
3. Restart backend server
4. Clear browser cache

### Issue 6: JWT Token Invalid

**Symptom**: 401 Unauthorized errors after login

**Solution**:
1. Check `JWT_SECRET` in backend `.env` (must be same value always)
2. Clear browser localStorage
3. Login again
4. Ensure JWT_SECRET is at least 32 characters

---

## Next Steps

After successful installation:

1. **Explore the Application**:
   - Browse products on frontend
   - Test shopping cart functionality
   - Login to admin dashboard

2. **Read Documentation**:
   - [Configuration Guide](CONFIGURATION_GUIDE.md) - Customize settings
   - [Developer Guide](DEVELOPER_GUIDE.md) - Development workflow
   - [API Reference](API_REFERENCE.md) - API endpoints

3. **Customize**:
   - Add your own products
   - Modify styling and branding
   - Configure payment settings

4. **Deploy**:
   - Follow [Deployment Guide](DEPLOYMENT_GUIDE.md)
   - Set up production environment
   - Configure domain and SSL

---

## Getting Help

If you encounter issues not covered here:

1. **Check Documentation**: See other docs in `/documents` folder
2. **GitHub Issues**: https://github.com/kshitijomkar/lilgiftstore/issues
3. **Logs**: Check backend and frontend console logs
4. **Community**: Ask in discussions or forums

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Next Review**: March 2025

---

[← Back to README](README.md) | [Configuration Guide →](CONFIGURATION_GUIDE.md)
