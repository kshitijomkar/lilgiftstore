# 🪟 Windows Setup Guide - The Lil Gift Corner

## Complete Setup Instructions for Windows

---

## 📋 Step 1: Install Prerequisites

### 1.1 Install Node.js
1. Download from: https://nodejs.org/ (LTS version)
2. Run installer
3. Verify installation:
   ```cmd
   node --version
   ```

### 1.2 Install Yarn
After Node.js is installed:
```cmd
npm install -g yarn
```

Verify:
```cmd
yarn --version
```

### 1.3 Install Python
1. Download Python 3.11+ from: https://www.python.org/downloads/
2. **IMPORTANT**: Check "Add Python to PATH" during installation
3. Verify:
   ```cmd
   python --version
   ```

### 1.4 Install MongoDB
1. Download from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB should auto-start as a Windows Service

Verify MongoDB is running:
```cmd
sc query MongoDB
```

If not running:
```cmd
net start MongoDB
```

---

## 🔧 Step 2: Fix Backend Dependencies

### 2.1 Navigate to Backend
```cmd
cd backend
```

### 2.2 Activate Virtual Environment
```cmd
venv\Scripts\activate
```

### 2.3 Install Fixed Dependencies
The `emergentintegrations` package is not publicly available. Use the fixed requirements file:

```cmd
pip install -r requirements-local.txt
```

This will install all necessary packages without the emergentintegrations dependency.

### 2.4 Verify Installation
```cmd
python -c "import fastapi, motor, stripe, pydantic; print('✅ All packages installed!')"
```

---

## 🗄️ Step 3: Setup Database

### 3.1 Seed Database with Products
```cmd
python seed_products.py
```

You should see:
```
✅ Successfully added 20 new products!
```

---

## 🚀 Step 4: Start Backend

### Option A: Using Python (Recommended)
```cmd
python server.py
```

### Option B: Using Uvicorn
```cmd
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Important**: Make sure you're in the activated virtual environment!

### 4.1 Verify Backend is Running
Open new Command Prompt:
```cmd
curl http://localhost:8001/api/health
```

Or open in browser: http://localhost:8001/api/health

You should see:
```json
{
  "status": "healthy",
  "app": "The Lil Gift Corner API",
  "version": "2.0.0"
}
```

---

## 💻 Step 5: Setup Frontend

### 5.1 Open New Command Prompt
Navigate to frontend folder:
```cmd
cd frontend
```

### 5.2 Install Dependencies
```cmd
yarn install
```

This will take 2-3 minutes.

### 5.3 Start Frontend
```cmd
yarn start
```

The browser should automatically open to http://localhost:3000

If not, manually open: http://localhost:3000

---

## 🎯 Step 6: Test the Application

### 6.1 Access URLs
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API Docs**: http://localhost:8001/api/docs

### 6.2 Admin Login
- **Email**: admin@thelilgiftcorner.com
- **Password**: Admin@123

### 6.3 Test Features
1. Browse products in Shop page
2. Create customer account (Sign Up)
3. Add products to cart
4. Test checkout (use Stripe test card: 4242 4242 4242 4242)
5. Access admin dashboard

---

## 🛠️ Troubleshooting Windows-Specific Issues

### Issue 1: "yarn is not recognized"
**Solution**:
```cmd
npm install -g yarn
```

Then close and reopen Command Prompt.

### Issue 2: "python is not recognized"
**Solution**:
Add Python to PATH:
1. Search "Environment Variables" in Windows
2. Edit System Environment Variables
3. Add Python installation path (e.g., `C:\Python312\`)
4. Add Scripts path (e.g., `C:\Python312\Scripts\`)
5. Restart Command Prompt

### Issue 3: MongoDB not starting
**Solution**:
```cmd
# Start MongoDB service
net start MongoDB

# Or restart it
net stop MongoDB
net start MongoDB
```

### Issue 4: Port 8001 already in use
**Solution**:
```cmd
# Find process using port 8001
netstat -ano | findstr :8001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Issue 5: Port 3000 already in use
**Solution**:
```cmd
# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue 6: Module Not Found errors
**Solution**:
Make sure you're in the virtual environment:
```cmd
cd backend
venv\Scripts\activate
pip install -r requirements-local.txt
```

### Issue 7: Permission Denied on Windows
**Solution**:
Run Command Prompt as Administrator:
- Right-click Command Prompt
- Select "Run as administrator"

### Issue 8: Cannot connect to MongoDB
**Solution**:
```cmd
# Check MongoDB service status
sc query MongoDB

# If not running, start it
net start MongoDB

# Test connection
mongo --eval "db.version()"
```

---

## 📝 Quick Commands Reference

### Backend Commands:
```cmd
# Activate venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements-local.txt

# Seed database
python seed_products.py

# Start server
python server.py
```

### Frontend Commands:
```cmd
# Install dependencies
yarn install

# Start development server
yarn start

# Build for production
yarn build
```

### MongoDB Commands:
```cmd
# Start MongoDB
net start MongoDB

# Stop MongoDB
net stop MongoDB

# Check status
sc query MongoDB
```

---

## 🔍 Step-by-Step Verification

### ✅ Checklist:

1. [ ] Node.js installed (`node --version`)
2. [ ] Yarn installed (`yarn --version`)
3. [ ] Python installed (`python --version`)
4. [ ] MongoDB installed and running (`sc query MongoDB`)
5. [ ] Backend venv created
6. [ ] Backend dependencies installed (requirements-local.txt)
7. [ ] Database seeded (20 products)
8. [ ] Backend running (http://localhost:8001/api/health)
9. [ ] Frontend dependencies installed (yarn install)
10. [ ] Frontend running (http://localhost:3000)
11. [ ] Can access admin panel
12. [ ] Can browse products

---

## 🎨 Directory Structure

```
app_clean (17)\
├── backend\
│   ├── venv\                      # Virtual environment
│   ├── api\                       # API modules
│   ├── server.py                  # Main server file
│   ├── requirements.txt           # Original (has emergentintegrations)
│   ├── requirements-local.txt     # Fixed for local setup
│   ├── seed_products.py           # Database seeding
│   └── .env                       # Environment variables
│
└── frontend\
    ├── node_modules\              # Dependencies (after yarn install)
    ├── public\                    # Static files
    ├── src\                       # React source code
    ├── package.json               # Node dependencies
    └── .env                       # Environment variables
```

---

## 🚀 Running Both Services (Two Terminals)

### Terminal 1 - Backend:
```cmd
cd backend
venv\Scripts\activate
python server.py
```

### Terminal 2 - Frontend:
```cmd
cd frontend
yarn start
```

**Leave both terminals running!**

---

## 🌐 Important URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main website |
| Admin Panel | http://localhost:3000/admin | Admin dashboard |
| Backend API | http://localhost:8001 | API base |
| API Docs | http://localhost:8001/api/docs | Interactive API docs |
| MongoDB | mongodb://localhost:27017 | Database |

---

## 🔐 Default Credentials

### Admin:
- Email: `admin@thelilgiftcorner.com`
- Password: `Admin@123`

### Stripe Test Cards:
- Success: `4242 4242 4242 4242`
- Any future expiry, any 3-digit CVC

---

## 💡 Pro Tips for Windows

1. **Use Windows Terminal** (better than CMD):
   - Install from Microsoft Store
   - Supports multiple tabs

2. **Keep terminals open**:
   - Don't close backend terminal
   - Don't close frontend terminal
   - Both need to run simultaneously

3. **Firewall prompts**:
   - Click "Allow" when Windows Firewall asks
   - Node.js and Python need network access

4. **Hot reload works**:
   - Backend auto-reloads on code changes
   - Frontend auto-reloads on code changes

5. **MongoDB as Windows Service**:
   - Starts automatically with Windows
   - No need to manually start each time

---

## 🆘 Still Having Issues?

### Check Logs:

**Backend logs**: Check the terminal running `python server.py`

**Frontend logs**: Check the terminal running `yarn start`

**MongoDB logs**: 
```cmd
type "C:\Program Files\MongoDB\Server\7.0\log\mongod.log"
```

### Get Help:
- Check existing documentation in `/docs` folder
- Review API documentation: http://localhost:8001/api/docs
- Check browser console (F12) for frontend errors

---

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ Backend terminal shows: "Application started successfully"
2. ✅ Frontend opens browser automatically to http://localhost:3000
3. ✅ You can see products on the Shop page
4. ✅ You can login to admin panel
5. ✅ API docs load at http://localhost:8001/api/docs

---

**Setup Time**: 10-15 minutes  
**Last Updated**: November 8, 2025  
**Tested On**: Windows 10/11

🎉 **Happy Coding on Windows!** 🚀
