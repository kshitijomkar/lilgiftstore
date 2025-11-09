# Render Deployment Guide
## The Lil Gift Corner - Full Stack Deployment

**Platform**: Render.com  
**Last Updated**: January 2025  
**Estimated Setup Time**: 30-45 minutes  
**Difficulty**: Intermediate

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [MongoDB Atlas Setup](#mongodb-atlas-setup)
4. [Repository Preparation](#repository-preparation)
5. [Backend Deployment](#backend-deployment)
6. [Frontend Deployment](#frontend-deployment)
7. [Environment Configuration](#environment-configuration)
8. [Custom Domain Setup](#custom-domain-setup)
9. [Verification](#verification)
10. [Troubleshooting](#troubleshooting)
11. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Overview

### What is Render?

Render is a cloud platform that makes it easy to deploy web applications, databases, and static sites. It offers:
- 🚀 Automatic deployments from Git
- 🔄 Continuous deployment on push
- 🌐 Free SSL certificates
- 📊 Built-in monitoring
- 💰 Free tier available

### Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Render Platform                  │
│  ┌────────────────────────────────────┐ │
│  │  Frontend (Static Site)            │ │
│  │  - React Build                     │ │
│  │  - https://lilgiftcorner.onrender. │ │
│  └────────────────────────────────────┘ │
│              ↓ API Calls                 │
│  ┌────────────────────────────────────┐ │
│  │  Backend (Web Service)             │ │
│  │  - FastAPI                         │ │
│  │  - https://api-lilgiftcorner.onrend│ │
│  └────────────────────────────────────┘ │
│              ↓ Database Queries          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│       MongoDB Atlas (Cloud)             │
│  - Managed MongoDB Database             │
│  - mongodb+srv://...                    │
└─────────────────────────────────────────┘
```

### What You'll Deploy

1. **Backend** (Web Service) - FastAPI Python application
2. **Frontend** (Static Site) - React production build
3. **Database** (External) - MongoDB Atlas

---

## Prerequisites

### 1. Accounts Needed

#### Render Account
- Sign up at: https://render.com/
- Can sign up with:
  - GitHub account (recommended)
  - GitLab account
  - Email
- **Free tier includes**:
  - 750 hours/month of web services
  - Static sites (unlimited)
  - SSL certificates

#### MongoDB Atlas Account
- Sign up at: https://www.mongodb.com/cloud/atlas
- Free M0 cluster available (512MB storage)

#### GitHub Account (Recommended)
- Sign up at: https://github.com/
- Needed for automatic deployments

### 2. Tools Required

- Git installed locally
- Code editor (VS Code recommended)
- Terminal/Command Line access

### 3. Project Requirements

- Project must be in a Git repository
- All dependencies listed in `requirements.txt` (backend)
- All dependencies listed in `package.json` (frontend)

---

## MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" or "Sign Up"
3. Create account (can use Google/GitHub)
4. Complete the welcome survey (optional)

### Step 2: Create a Cluster

1. Click "Build a Database"
2. Select **FREE** tier (M0 Sandbox)
3. Choose a cloud provider:
   - **AWS** (recommended for Render)
   - Select region closest to you or Render servers
4. Cluster Name: `LilGiftCorner` (or keep default)
5. Click "Create Cluster"
6. Wait 3-5 minutes for cluster creation

### Step 3: Configure Database Access

#### Create Database User:

1. Click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. **Authentication Method**: Password
4. **Username**: `lilgiftcorner_admin` (choose your own)
5. **Password**: Click "Autogenerate Secure Password" and **SAVE IT**
   - Or create your own strong password
6. **Database User Privileges**: 
   - Select "Built-in Role"
   - Choose "Atlas Admin" (or "Read and write to any database")
7. Click "Add User"

**⚠️ IMPORTANT**: Save the username and password securely!

### Step 4: Configure Network Access

1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Choose one option:

   **Option A - Allow All (Easiest for Render)**:
   - Click "Allow Access from Anywhere"
   - IP Address: `0.0.0.0/0`
   - Description: "Render Access"
   - Click "Confirm"

   **Option B - Specific Render IPs** (More secure):
   - Add these Render IP addresses:
     ```
     216.24.57.1
     216.24.57.253
     ```
   - Description: "Render Static IPs"

4. Wait for status to change to "Active" (~1 minute)

### Step 5: Get Connection String

1. Go to "Database" tab
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. **Driver**: Python, **Version**: 3.11 or later
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```
6. **Replace** `<username>` and `<password>` with your actual credentials
7. **Add database name** at the end:
   ```
   mongodb+srv://lilgiftcorner_admin:yourpassword@cluster0.xxxxx.mongodb.net/lilgiftcorner_db
   ```

**Save this connection string** - you'll need it for Render!

### Step 6: Create Database and Collections (Optional)

The application will auto-create collections, but you can pre-create:

1. Click "Browse Collections"
2. Click "Add My Own Data"
3. **Database Name**: `lilgiftcorner_db`
4. **Collection Name**: `products`
5. Click "Create"

---

## Repository Preparation

### Step 1: Push to GitHub

If your project isn't on GitHub yet:

```bash
# Initialize git (if not already)
cd /path/to/your/project
git init

# Create .gitignore if not exists
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
venv/
*.env

# Node
node_modules/
build/
.env
.env.local

# IDE
.vscode/
.idea/
EOF

# Add all files
git add .
git commit -m "Initial commit for Render deployment"

# Create repo on GitHub and push
git remote add origin https://github.com/yourusername/lilgiftcorner.git
git branch -M main
git push -u origin main
```

### Step 2: Verify File Structure

Ensure your repository has:

```
/
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── .env.example (optional)
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
└── README.md
```

### Step 3: Create Render Configuration Files

#### For Backend - Create `backend/render.yaml` (optional):

```yaml
services:
  - type: web
    name: lilgiftcorner-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn server:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

#### For Frontend - Create `frontend/package.json` scripts:

Ensure these scripts exist:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}
```

---

## Backend Deployment

### Step 1: Create New Web Service

1. Log in to https://dashboard.render.com/
2. Click **"New +"** button (top right)
3. Select **"Web Service"**

### Step 2: Connect Repository

#### Option A - Connect GitHub:
1. Click "Connect GitHub"
2. Authorize Render to access your repositories
3. Select your repository: `yourusername/lilgiftcorner`
4. Click "Connect"

#### Option B - Public Git Repository:
1. Enter repository URL: `https://github.com/yourusername/lilgiftcorner`
2. Click "Continue"

### Step 3: Configure Web Service

**Basic Settings**:

| Field | Value |
|-------|-------|
| **Name** | `lilgiftcorner-backend` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn server:app --host 0.0.0.0 --port $PORT` |

**Instance Type**:
- Select **"Free"** ($0/month)
- Note: Free tier sleeps after 15 minutes of inactivity
- Upgrade to "Starter" ($7/month) for always-on service

### Step 4: Set Environment Variables

Scroll to **"Environment Variables"** section and add:

| Key | Value | Notes |
|-----|-------|-------|
| `MONGO_URL` | `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/` | From MongoDB Atlas |
| `DB_NAME` | `lilgiftcorner_db` | |
| `CORS_ORIGINS` | `https://lilgiftcorner-frontend.onrender.com,https://yourdomain.com` | Your frontend URLs |
| `STRIPE_API_KEY` | `sk_test_emergent` | Replace with real Stripe key for production |
| `JWT_SECRET` | Generate secure key | See below |

**Generate JWT Secret**:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
# Copy the output and paste as JWT_SECRET value
```

**⚠️ Important**: 
- Don't commit `.env` file to Git
- Use Render's environment variables instead
- Update `CORS_ORIGINS` after creating frontend

### Step 5: Advanced Settings (Optional)

- **Auto-Deploy**: Enable "Yes" (deploys on every push to main)
- **Health Check Path**: `/api/` (optional)
- **Python Version**: 3.11.0

### Step 6: Create Web Service

1. Click **"Create Web Service"** button
2. Render will start building and deploying
3. **Build process takes 3-5 minutes**

**Build Steps**:
```
1. Cloning repository...
2. Installing Python 3.11...
3. Running: pip install -r requirements.txt
4. Build complete
5. Starting server...
6. Server running on https://lilgiftcorner-backend.onrender.com
```

### Step 7: Verify Backend Deployment

Once status shows **"Live"**:

1. Copy your service URL (e.g., `https://lilgiftcorner-backend.onrender.com`)
2. Test in browser:
   ```
   https://lilgiftcorner-backend.onrender.com/api/
   ```
   Should return: `{"message": "Hello World"}`

3. Test API docs:
   ```
   https://lilgiftcorner-backend.onrender.com/docs
   ```
   Should show Swagger UI

4. Test products endpoint:
   ```
   https://lilgiftcorner-backend.onrender.com/api/products
   ```
   Should return array of products

**⚠️ Free Tier Note**: Backend will sleep after 15 minutes of inactivity. First request will take 30-60 seconds to wake up.

---

## Frontend Deployment

### Step 1: Update Frontend Environment

Before deploying frontend, update environment for production:

**In your local repository**, edit `frontend/.env.production`:

```env
REACT_APP_BACKEND_URL=https://lilgiftcorner-backend.onrender.com
```

Or create `frontend/.env.production` if it doesn't exist.

**Commit and push**:
```bash
git add frontend/.env.production
git commit -m "Update backend URL for production"
git push
```

### Step 2: Create Static Site on Render

1. Go to Render Dashboard
2. Click **"New +"** → **"Static Site"**

### Step 3: Connect Repository

1. Select the same repository: `yourusername/lilgiftcorner`
2. Click "Connect"

### Step 4: Configure Static Site

| Field | Value |
|-------|-------|
| **Name** | `lilgiftcorner-frontend` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `build` |

**Or if using Yarn**:
- **Build Command**: `yarn install && yarn build`

### Step 5: Environment Variables (Frontend)

Add environment variable:

| Key | Value |
|-----|-------|
| `REACT_APP_BACKEND_URL` | `https://lilgiftcorner-backend.onrender.com` |

### Step 6: Advanced Settings

**Redirects/Rewrites** (Important for React Router):

Add this redirect rule:

| Source | Destination | Action |
|--------|-------------|--------|
| `/*` | `/index.html` | Rewrite |

This ensures React Router works correctly.

**Or create `frontend/public/_redirects` file**:
```
/*  /index.html  200
```

### Step 7: Create Static Site

1. Click **"Create Static Site"**
2. Build process starts (~5-7 minutes)
3. Wait for status to show **"Live"**

**Build Steps**:
```
1. Cloning repository...
2. Installing Node.js...
3. Running: npm install
4. Running: npm run build
5. Optimizing build...
6. Deploying to CDN...
7. Site live at https://lilgiftcorner-frontend.onrender.com
```

### Step 8: Update Backend CORS

**Important**: Now that frontend is deployed, update backend CORS:

1. Go to backend service in Render dashboard
2. Navigate to **"Environment"** tab
3. Update `CORS_ORIGINS` variable:
   ```
   https://lilgiftcorner-frontend.onrender.com
   ```
4. Click **"Save Changes"**
5. Backend will automatically redeploy

---

## Environment Configuration

### Backend Environment Variables Summary

```env
# Required
MONGO_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
DB_NAME=lilgiftcorner_db
CORS_ORIGINS=https://lilgiftcorner-frontend.onrender.com
JWT_SECRET=your-secure-random-string-here

# Optional
STRIPE_API_KEY=  # Use real key for production
PYTHON_VERSION=3.11.0
```

### Frontend Environment Variables Summary

```env
REACT_APP_BACKEND_URL=https://lilgiftcorner-backend.onrender.com
```

### Managing Environment Variables

**To Update**:
1. Go to service in Render Dashboard
2. Click "Environment" tab
3. Edit value
4. Click "Save Changes"
5. Service will auto-redeploy

**To Add**:
1. Click "Add Environment Variable"
2. Enter key and value
3. Click "Save"

**Secrets Management**:
- Never commit secrets to Git
- Use Render's environment variables
- Rotate secrets regularly (JWT_SECRET, database password)

---

## Custom Domain Setup

### Step 1: Purchase Domain

Buy domain from:
- Namecheap (namecheap.com)
- GoDaddy (godaddy.com)
- Google Domains (domains.google)

Example: `thelilgiftcorner.com`

### Step 2: Configure Frontend Domain

#### In Render Dashboard:

1. Go to frontend static site
2. Click **"Settings"** tab
3. Scroll to **"Custom Domains"**
4. Click **"Add Custom Domain"**
5. Enter domain: `thelilgiftcorner.com` and `www.thelilgiftcorner.com`
6. Render will show DNS records to add

#### DNS Records for Frontend:

**For root domain** (`thelilgiftcorner.com`):
```
Type: A
Name: @
Value: 216.24.57.1
```

**For www subdomain**:
```
Type: CNAME
Name: www
Value: lilgiftcorner-frontend.onrender.com
```

### Step 3: Configure Backend Domain

#### In Render Dashboard:

1. Go to backend web service
2. Click **"Settings"** → **"Custom Domains"**
3. Add: `api.thelilgiftcorner.com`

#### DNS Record for Backend:

```
Type: CNAME
Name: api
Value: lilgiftcorner-backend.onrender.com
```

### Step 4: Update Environment Variables

After custom domain setup:

**Frontend** - Update backend URL:
```env
REACT_APP_BACKEND_URL=https://api.thelilgiftcorner.com
```

**Backend** - Update CORS:
```env
CORS_ORIGINS=https://thelilgiftcorner.com,https://www.thelilgiftcorner.com
```

### Step 5: SSL Certificate

Render automatically provisions SSL certificates:
- Takes 5-10 minutes
- Automatically renews
- No configuration needed

Wait for "SSL certificate provisioned" message.

---

## Verification

### Deployment Checklist

#### Backend Verification:

- [ ] Backend service status: "Live"
- [ ] No build errors in logs
- [ ] API root responds: `/api/`
- [ ] API docs accessible: `/docs`
- [ ] Products endpoint works: `/api/products`
- [ ] Database connection successful (check logs)
- [ ] Admin user created (check logs for "Admin user created")

**Test Commands**:
```bash
# Test API
curl https://lilgiftcorner-backend.onrender.com/api/products

# Should return JSON array of products
```

#### Frontend Verification:

- [ ] Frontend site status: "Live"
- [ ] No build errors in logs
- [ ] Homepage loads correctly
- [ ] No console errors in browser (F12)
- [ ] Products load in shop page
- [ ] Navigation works
- [ ] Forms submit correctly
- [ ] Images load
- [ ] Mobile responsive

**Manual Tests**:
1. Open: `https://lilgiftcorner-frontend.onrender.com`
2. Check homepage loads
3. Click "Shop" - products should load
4. Try login - should work
5. Add item to cart - should work
6. Check browser console - no errors

#### Database Verification:

- [ ] MongoDB Atlas cluster: "Active"
- [ ] Network access configured
- [ ] Database user exists
- [ ] Collections created
- [ ] Sample data seeded

**Verify in MongoDB Atlas**:
1. Go to "Browse Collections"
2. Check `lilgiftcorner_db` exists
3. Check collections: `products`, `users`, `orders`
4. Verify sample products exist

---

## Troubleshooting

### Backend Issues

#### 1. Build Failed - Dependencies Error

**Error**:
```
ERROR: Could not find a version that satisfies the requirement...
```

**Solution**:
```bash
# Update requirements.txt locally
cd backend
pip freeze > requirements.txt

# Commit and push
git add requirements.txt
git commit -m "Update dependencies"
git push
```

#### 2. Runtime Error - Cannot Connect to MongoDB

**Error in Logs**:
```
ServerSelectionTimeoutError: connection refused
```

**Solution**:
1. Verify `MONGO_URL` in environment variables
2. Check MongoDB Atlas network access (0.0.0.0/0)
3. Verify database user credentials
4. Ensure connection string includes database name

#### 3. CORS Error

**Error in Browser**:
```
CORS policy: No 'Access-Control-Allow-Origin' header
```

**Solution**:
1. Update backend `CORS_ORIGINS` environment variable
2. Include full frontend URL
3. No trailing slash
4. Redeploy backend

#### 4. Free Tier Sleep Issue

**Issue**: Backend takes 30-60 seconds on first request

**Solution**:
- This is normal for free tier
- Upgrade to paid plan for always-on
- Or use a ping service (e.g., UptimeRobot)

### Frontend Issues

#### 1. Build Failed - Out of Memory

**Error**:
```
JavaScript heap out of memory
```

**Solution**:

Add to `frontend/package.json`:
```json
{
  "scripts": {
    "build": "node --max_old_space_size=4096 node_modules/.bin/react-scripts build"
  }
}
```

#### 2. Blank Page After Deployment

**Issue**: Page loads but shows blank screen

**Solution**:
1. Check browser console for errors
2. Verify `REACT_APP_BACKEND_URL` is correct
3. Add `_redirects` file for React Router:
   ```
   /*  /index.html  200
   ```
4. Rebuild and redeploy

#### 3. API Calls Failing

**Error**: Network errors when calling API

**Solution**:
1. Verify backend is running
2. Check `REACT_APP_BACKEND_URL` matches backend URL exactly
3. Ensure CORS is configured on backend
4. Test backend API directly first

### Database Issues

#### 1. Connection String Invalid

**Solution**:
```
✅ Correct format:
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database_name

❌ Wrong formats:
mongodb+srv://username@cluster0.xxxxx.mongodb.net/  # Missing password
mongodb+srv://@cluster0.xxxxx.mongodb.net/  # Missing credentials
mongodb://localhost:27017  # Local URL instead of Atlas
```

#### 2. IP Not Whitelisted

**Error**: `MongoNetworkError: connection timed out`

**Solution**:
1. Go to MongoDB Atlas → Network Access
2. Add `0.0.0.0/0` (allow all IPs)
3. Or add specific Render IPs
4. Wait 1 minute for changes to apply

---

## Monitoring & Maintenance

### View Logs

#### Backend Logs:
1. Go to backend service in Render
2. Click "Logs" tab
3. View real-time logs
4. Search for errors or specific events

#### Frontend Logs:
1. Frontend builds are in "Events" tab
2. Runtime issues appear in browser console

### Metrics

Render provides:
- CPU usage
- Memory usage
- Request count
- Response times

View in "Metrics" tab of each service.

### Automatic Deployments

Every push to `main` branch triggers:
1. Backend redeploys automatically
2. Frontend rebuilds automatically
3. Takes 3-5 minutes

**Disable auto-deploy**:
1. Service Settings → "Auto-Deploy"
2. Toggle to "No"

### Manual Deployments

**Trigger manual deploy**:
1. Go to service dashboard
2. Click "Manual Deploy" button
3. Select branch
4. Click "Deploy"

### Health Checks

**Setup health check endpoint**:

```python
# In backend/server.py
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}
```

Configure in Render:
1. Service Settings → Health Check Path
2. Enter: `/api/health`

### Backup Strategy

**MongoDB Atlas Backups**:
1. Go to MongoDB Atlas
2. Free tier: Manual exports only
3. Paid tier: Automatic backups

**Manual backup**:
```bash
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/lilgiftcorner_db" --out=backup/
```

### Updating Application

**To deploy updates**:
```bash
# Make changes locally
# Test locally
# Commit and push
git add .
git commit -m "Update features"
git push

# Render auto-deploys
# Check deployment status in dashboard
```

---

## Cost Estimate

### Free Tier

| Service | Cost | Limitations |
|---------|------|-------------|
| Backend Web Service | $0 | 750 hours/month, sleeps after 15min |
| Frontend Static Site | $0 | Unlimited bandwidth |
| MongoDB Atlas M0 | $0 | 512MB storage |
| SSL Certificates | $0 | Auto-provisioned |
| **Total** | **$0/month** | Good for development/low traffic |

### Paid Tier (Production Ready)

| Service | Cost | Benefits |
|---------|------|----------|
| Backend (Starter) | $7/month | Always-on, no sleep |
| Frontend Static | $0 | Unlimited |
| MongoDB Atlas M10 | $0.08/hour (~$57/mo) | 10GB storage, backups |
| Custom Domain | $10-15/year | Your brand |
| **Total** | **~$64/month** | Production-ready |

---

## Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` files
- ✅ Use Render's environment variables
- ✅ Rotate JWT_SECRET regularly
- ✅ Use strong database passwords

### 2. CORS Configuration
```env
# Development
CORS_ORIGINS=*

# Production - Specific domains only
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. HTTPS
- ✅ Render provides free SSL
- ✅ Automatically renews
- ✅ Force HTTPS in production

### 4. Database Security
- ✅ Use MongoDB Atlas (managed security)
- ✅ Enable authentication
- ✅ Restrict network access
- ✅ Regular backups

### 5. API Security
- ✅ JWT token authentication
- ✅ Rate limiting (implement with middleware)
- ✅ Input validation (Pydantic)
- ✅ SQL injection protection (MongoDB)

---

## Performance Optimization

### Backend

1. **Use Gunicorn** (Production):
```bash
# Update start command in Render:
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```

2. **Database Indexes**:
- Already created automatically
- Monitor with MongoDB Atlas

3. **Caching**:
- Implement Redis for session storage
- Cache frequently accessed data

### Frontend

1. **Already Optimized**:
- Production build minified
- Code splitting enabled
- Lazy loading components

2. **CDN**:
- Render static sites use CDN automatically
- Assets cached globally

3. **Image Optimization**:
- Use WebP format
- Compress images
- Lazy load images

---

## Summary

### Quick Reference

**Backend URL**: `https://lilgiftcorner-backend.onrender.com`  
**Frontend URL**: `https://lilgiftcorner-frontend.onrender.com`  
**Database**: MongoDB Atlas (cloud)

**Key Commands**:
```bash
# Deploy updates
git push  # Auto-deploys on push

# View logs
# Use Render dashboard

# Rollback
# Use Render dashboard → Deploy previous version
```

**Admin Login**:
- Email: admin@thelilgiftcorner.com
- Password: Admin@123

### Next Steps

1. ✅ Set up custom domain
2. ✅ Configure monitoring/alerts
3. ✅ Set up backups
4. ✅ Add real Stripe keys
5. ✅ Test thoroughly
6. ✅ Monitor performance

---

**Made with ❤️ for The Lil Gift Corner**  
**Deployed on Render.com**