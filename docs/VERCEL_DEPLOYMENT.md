# Vercel Deployment Guide
## The Lil Gift Corner - Frontend Deployment

**Platform**: Vercel  
**Last Updated**: January 2025  
**Estimated Setup Time**: 15-30 minutes  
**Difficulty**: Beginner

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Backend Deployment Options](#backend-deployment-options)
4. [Frontend Deployment to Vercel](#frontend-deployment-to-vercel)
5. [Environment Configuration](#environment-configuration)
6. [Custom Domain Setup](#custom-domain-setup)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)
9. [CI/CD & Automation](#cicd--automation)
10. [Performance Optimization](#performance-optimization)

---

## Overview

### What is Vercel?

Vercel is a cloud platform optimized for frontend deployments, especially React, Next.js, and modern web applications. It offers:
- ⚡ Lightning-fast CDN
- 🔄 Automatic deployments from Git
- 🌐 Free SSL certificates
- 🚀 Instant rollbacks
- 💰 Generous free tier
- 🎯 Zero configuration for React apps

### Deployment Architecture

```
┌────────────────────────────────────────────┐
│          Vercel Edge Network              │
│  ┌──────────────────────────────────────┐ │
│  │  Frontend (React Static Site)        │ │
│  │  - https://lilgiftcorner.vercel.app  │ │
│  │  - Deployed to Global CDN            │ │
│  └──────────────────────────────────────┘ │
│               ↓ API Calls                 │
└───────────────────────────────────────────┘
                ↓
┌───────────────────────────────────────────┐
│   Backend (Choose One Option)             │
│  ┌──────────────────────────────────────┐ │
│  │ Option A: Render                     │ │
│  │ Option B: Railway                    │ │
│  │ Option C: Heroku                     │ │
│  │ Option D: AWS/GCP/Azure              │ │
│  └──────────────────────────────────────┘ │
└───────────────────────────────────────────┘
                ↓
┌───────────────────────────────────────────┐
│       MongoDB Atlas (Database)            │
└───────────────────────────────────────────┘
```

### What You'll Deploy

1. **Frontend** (Vercel) - React production build
2. **Backend** (External service) - FastAPI application
3. **Database** (MongoDB Atlas) - Cloud database

**Note**: Vercel is optimized for frontend/serverless. For this full-stack app, we'll deploy:
- Frontend → Vercel (this guide)
- Backend → Render/Railway (see other guides)

---

## Prerequisites

### 1. Accounts Needed

#### Vercel Account
- Sign up at: https://vercel.com/signup
- Recommended: Sign up with GitHub
- **Free tier includes**:
  - Unlimited static sites
  - 100GB bandwidth/month
  - Automatic HTTPS
  - Deploy previews

#### GitHub Account
- Required for automatic deployments
- Sign up at: https://github.com

#### Backend Service Account (Choose one)
- **Render** (recommended): https://render.com
- **Railway**: https://railway.app
- **Heroku**: https://heroku.com
- See `RENDER_DEPLOYMENT.md` for backend setup

#### MongoDB Atlas Account
- Sign up at: https://www.mongodb.com/cloud/atlas
- Free M0 cluster available

### 2. Project Requirements

- [ ] Project in Git repository (GitHub, GitLab, Bitbucket)
- [ ] Backend deployed and accessible (see Backend Options)
- [ ] MongoDB Atlas configured
- [ ] All dependencies in `package.json`

### 3. Local Testing

Before deploying, ensure app works locally:
```bash
cd frontend
npm install
npm run build
npx serve -s build
```

App should run at http://localhost:3000

---

## Backend Deployment Options

**Important**: Deploy backend first, then frontend.

### Option A: Render (Recommended)

**Pros**: 
- Easy setup
- Free tier available
- Good documentation

**Setup**: See `RENDER_DEPLOYMENT.md`

**Result**: Backend at `https://your-backend.onrender.com`

### Option B: Railway

**Pros**:
- Modern UI
- Fast deployments
- Good free tier

**Steps**:
1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Select repository, choose `backend` folder
4. Railway auto-detects Python
5. Add environment variables
6. Deploy

**Result**: Backend at `https://your-backend.railway.app`

### Option C: Heroku

**Pros**:
- Well established
- Lots of documentation

**Cons**:
- No free tier (starts at $5/month)

**Steps**:
```bash
# Install Heroku CLI
# Login
heroku login

# Create app
cd backend
heroku create lilgiftcorner-backend

# Add buildpack
heroku buildpacks:set heroku/python

# Set env vars
heroku config:set MONGO_URL="your-connection-string"

# Deploy
git push heroku main
```

### Option D: Vercel Serverless Functions

**Note**: FastAPI can be adapted to serverless, but requires restructuring.

**Not recommended** for this project due to:
- FastAPI better suited for traditional hosting
- Startup tasks (database seeding) need persistent server
- Free tier limitations on serverless execution time

**If you want to try**:
- Convert endpoints to individual serverless functions
- Use Vercel's Python runtime
- See: https://vercel.com/docs/functions/serverless-functions

---

## Frontend Deployment to Vercel

### Step 1: Prepare Repository

#### 1.1 Ensure Project is on GitHub

```bash
# If not already on GitHub
cd /path/to/project
git init
git add .
git commit -m "Prepare for Vercel deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/lilgiftcorner.git
git branch -M main
git push -u origin main
```

#### 1.2 Verify Frontend Structure

```bash
frontend/
├── public/
│   ├── index.html
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── App.js
│   ├── index.js
│   ├── pages/
│   └── components/
├── package.json
└── README.md
```

#### 1.3 Create Production Environment File

Create `frontend/.env.production`:

```env
# Replace with your actual backend URL
REACT_APP_BACKEND_URL=https://your-backend.onrender.com
```

**Commit this file**:
```bash
git add frontend/.env.production
git commit -m "Add production environment config"
git push
```

### Step 2: Import Project to Vercel

#### 2.1 Login to Vercel

1. Go to https://vercel.com/login
2. Sign in with GitHub (recommended)
3. Authorize Vercel to access your repositories

#### 2.2 Create New Project

1. Click **"Add New..."** → **"Project"**
2. Select **"Import Git Repository"**
3. Choose your repository: `yourusername/lilgiftcorner`
4. Click **"Import"**

### Step 3: Configure Project

#### 3.1 Project Settings

| Setting | Value |
|---------|-------|
| **Framework Preset** | Create React App |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` or `yarn build` |
| **Output Directory** | `build` |
| **Install Command** | `npm install` or `yarn install` |

**Important**: 
- Click "Edit" next to Root Directory
- Select `frontend` folder
- Vercel will auto-detect Create React App

#### 3.2 Environment Variables

Click **"Environment Variables"** section:

Add the following:

| Name | Value | Environment |
|------|-------|-------------|
| `REACT_APP_BACKEND_URL` | `https://your-backend.onrender.com` | Production |
| `REACT_APP_BACKEND_URL` | `https://your-backend.onrender.com` | Preview |
| `REACT_APP_BACKEND_URL` | `http://localhost:8001` | Development (optional) |

**Replace** `https://your-backend.onrender.com` with your actual backend URL.

**Important Notes**:
- Must start with `REACT_APP_` for Create React App
- No trailing slash in URL
- Include `https://` protocol

### Step 4: Deploy

1. Review all settings
2. Click **"Deploy"** button
3. Vercel will:
   - Clone repository
   - Install dependencies
   - Run build
   - Deploy to CDN
   - Generate preview URL

**Build Process** (~2-3 minutes):
```
1. Cloning repository...
2. Installing dependencies (npm install)...
3. Building application (npm run build)...
4. Optimizing assets...
5. Deploying to Edge Network...
6. ✓ Deployment complete!
```

**Result**: 
- Production URL: `https://lilgiftcorner.vercel.app`
- Or custom subdomain if you set one

### Step 5: Verify Deployment

#### 5.1 Check Deployment Status

1. Click on deployment in Vercel dashboard
2. Status should show **"Ready"**
3. Click **"Visit"** to open site

#### 5.2 Test Functionality

**Homepage**:
- [ ] Site loads without errors
- [ ] Images display
- [ ] Navigation works

**Shop Page**:
- [ ] Products load (from backend API)
- [ ] Search works
- [ ] Filters work

**Browser Console**:
- [ ] No errors in console (F12)
- [ ] API calls succeed
- [ ] No CORS errors

---

## Environment Configuration

### Managing Environment Variables

#### Via Vercel Dashboard

1. Go to project in Vercel
2. **Settings** → **Environment Variables**
3. Add/Edit/Delete variables
4. Select environments:
   - **Production**: `main` branch deploys
   - **Preview**: Pull request/branch deploys
   - **Development**: Local development

#### Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Add environment variable
vercel env add REACT_APP_BACKEND_URL production
# Enter value when prompted

# Pull environment variables locally
vercel env pull
```

### Environment Variable Best Practices

**✅ DO**:
- Prefix with `REACT_APP_` for Create React App
- Use different values for production/preview/development
- Keep sensitive values in Vercel (not in code)
- Document all required variables

**❌ DON'T**:
- Commit `.env` files with secrets
- Hardcode API URLs in code
- Use production keys in development

### Required Environment Variables

```env
# Frontend (Vercel)
REACT_APP_BACKEND_URL=https://your-backend-url.com  # Required
```

**Note**: Backend environment variables are managed in backend hosting (Render/Railway/etc.)

---

## Custom Domain Setup

### Step 1: Purchase Domain

Recommended registrars:
- **Namecheap**: https://www.namecheap.com
- **Google Domains**: https://domains.google
- **GoDaddy**: https://www.godaddy.com
- **Vercel Domains**: https://vercel.com/domains (integrated)

Example: `thelilgiftcorner.com`

### Step 2: Add Domain to Vercel

#### 2.1 In Vercel Dashboard

1. Go to your project
2. **Settings** → **Domains**
3. Enter your domain: `thelilgiftcorner.com`
4. Click **"Add"**

#### 2.2 Vercel Will Show DNS Records

Two options:

**Option A: Nameservers (Recommended)**

Vercel provides nameservers:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

Change at your registrar:
1. Login to domain registrar
2. Find "Nameservers" or "DNS Settings"
3. Change to custom nameservers
4. Enter Vercel's nameservers
5. Save (propagation: 24-48 hours, usually faster)

**Option B: DNS Records (A/CNAME)**

Add these records at your registrar:

```
# For root domain (example.com)
Type: A
Name: @
Value: 76.76.21.21

# For www subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Add Subdomain (Optional)

Add `www` subdomain:

1. Vercel → Domains
2. Add: `www.thelilgiftcorner.com`
3. Vercel auto-configures

### Step 4: SSL Certificate

- Vercel automatically provisions SSL
- Takes 1-5 minutes
- Free Let's Encrypt certificate
- Auto-renews every 90 days

Wait for:
```
✓ SSL certificate issued
✓ Domain active
```

### Step 5: Update Backend CORS

**Important**: Update backend to allow your new domain.

In backend environment variables:
```env
CORS_ORIGINS=https://thelilgiftcorner.com,https://www.thelilgiftcorner.com
```

Redeploy backend after updating.

### Step 6: Test Custom Domain

1. Visit: `https://thelilgiftcorner.com`
2. Should redirect to HTTPS automatically
3. Site should load correctly
4. Check SSL certificate (padlock icon)

---

## Verification

### Deployment Verification Checklist

#### Build Verification

- [ ] Build completed without errors
- [ ] No warnings in build log (or only minor ones)
- [ ] Output size reasonable (<5MB main bundle)
- [ ] Source maps generated

#### Runtime Verification

**Open deployed site and check**:

1. **Homepage** (`/`)
   - [ ] Loads in <2 seconds
   - [ ] Images load
   - [ ] No layout shifts
   - [ ] Hero section displays

2. **Shop Page** (`/shop`)
   - [ ] Products load from backend
   - [ ] Search functionality works
   - [ ] Category filters work
   - [ ] Sorting works
   - [ ] Images load

3. **Product Details** (`/product/:id`)
   - [ ] Product loads
   - [ ] Add to cart works
   - [ ] Image gallery works

4. **Authentication** (`/login`)
   - [ ] Register new user
   - [ ] Login existing user
   - [ ] JWT token saved
   - [ ] Redirect after login

5. **Shopping Cart** (`/cart`)
   - [ ] Cart displays items
   - [ ] Quantity updates work
   - [ ] Remove item works
   - [ ] Total calculates correctly

6. **Admin Dashboard** (`/admin`)
   - [ ] Login as admin works
   - [ ] Dashboard loads
   - [ ] Stats display
   - [ ] Product management works

#### Technical Verification

**Browser Console** (F12):
- [ ] No JavaScript errors
- [ ] No CORS errors
- [ ] API calls succeed (200 status)
- [ ] No 404s for assets

**Network Tab**:
- [ ] API requests go to correct backend URL
- [ ] Assets load from Vercel CDN
- [ ] Response times <500ms

**Performance**:
- [ ] Lighthouse score >90
- [ ] First Contentful Paint <2s
- [ ] Time to Interactive <3s

### Testing Commands

```bash
# Test from command line
curl -I https://lilgiftcorner.vercel.app
# Should return: HTTP/2 200

# Test API connectivity
curl https://lilgiftcorner.vercel.app/api/products
# Should return products JSON (via proxy)
```

### Browser Testing

**Test in multiple browsers**:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Edge

**Test responsive design**:
- [ ] Mobile (375px width)
- [ ] Tablet (768px width)
- [ ] Desktop (1920px width)

---

## Troubleshooting

### Build Errors

#### 1. Build Failed - Module Not Found

**Error**:
```
Module not found: Can't resolve 'component-name'
```

**Solution**:
```bash
# Ensure all imports are correct
# Check case sensitivity (imports vs filenames)
# Verify package is in package.json

# Test build locally first:
cd frontend
npm run build
```

#### 2. Build Failed - Out of Memory

**Error**:
```
JavaScript heap out of memory
```

**Solution**:

Add to `package.json`:
```json
{
  "scripts": {
    "build": "react-scripts --max_old_space_size=4096 build"
  }
}
```

#### 3. Environment Variables Not Working

**Issue**: `process.env.REACT_APP_BACKEND_URL` is undefined

**Solution**:
1. Verify variable name starts with `REACT_APP_`
2. Check spelling exactly matches
3. Ensure added to Vercel dashboard
4. Redeploy after adding variables

**Test locally**:
```bash
REACT_APP_BACKEND_URL=https://test.com npm run build
# Check if build succeeds
```

### Runtime Errors

#### 1. Blank Page After Deployment

**Issue**: Site loads but shows blank screen

**Check**:
1. Open browser console (F12)
2. Look for errors

**Common causes**:

**A. Router Issue**:
```javascript
// Make sure BrowserRouter is set up correctly
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      {/* routes */}
    </BrowserRouter>
  );
}
```

**B. 404 on Routes**:

Vercel handles this automatically for Create React App, but verify:
- Check `vercel.json` not overriding defaults
- SPA routing should work out of box

#### 2. API Calls Failing - CORS Error

**Error in Console**:
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**:

1. **Verify Backend CORS**:
   ```python
   # backend/server.py
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://lilgiftcorner.vercel.app"],  # Your Vercel URL
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **Update Backend Environment**:
   ```env
   CORS_ORIGINS=https://lilgiftcorner.vercel.app
   ```

3. **Redeploy Backend**

#### 3. API Calls Failing - Wrong URL

**Error**: `Network Error` or `404`

**Check**:
```javascript
// In browser console:
console.log(process.env.REACT_APP_BACKEND_URL);
// Should print: https://your-backend.onrender.com

// If undefined:
// - Add to Vercel environment variables
// - Redeploy
```

**Verify**:
1. Backend URL is correct
2. Backend is running (test directly)
3. No trailing slash in URL

#### 4. Images Not Loading

**Issue**: Broken image icons

**Solutions**:

**A. Check Image Paths**:
```javascript
// ✅ Correct (relative)
import logo from './logo.png';
<img src={logo} />

// ✅ Correct (public folder)
<img src={process.env.PUBLIC_URL + '/logo.png'} />

// ❌ Wrong (absolute)
<img src="/Users/me/project/logo.png" />
```

**B. Verify Images in Public Folder**:
- Images in `public/` folder deploy automatically
- Access via `<img src="/image.png" />`

**C. External Images**:
- Check CORS if loading from external domain
- Use CDN or convert to base64 if needed

### Performance Issues

#### 1. Slow Load Times

**Check**:
```bash
# Run Lighthouse audit
# Chrome DevTools → Lighthouse tab → Generate Report
```

**Optimizations**:

1. **Code Splitting** (already enabled in CRA):
```javascript
import React, { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminDashboard />
    </Suspense>
  );
}
```

2. **Image Optimization**:
- Use WebP format
- Compress images
- Lazy load images

3. **Reduce Bundle Size**:
```bash
# Analyze bundle
npm run build
npx source-map-explorer build/static/js/*.js
```

#### 2. API Calls Slow

**Issue**: Products take long to load

**Check**:
1. Test backend directly (should be <500ms)
2. If slow, optimize backend:
   - Add database indexes
   - Use pagination
   - Cache responses

3. If backend fast, check:
   - Network latency (backend far from users?)
   - Cold starts (free tier backends sleep)

---

## CI/CD & Automation

### Automatic Deployments

Vercel automatically deploys:

1. **Production** - Every push to `main` branch
2. **Preview** - Every push to other branches
3. **Preview** - Every pull request

**How it works**:
```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically:
# 1. Detects push
# 2. Builds project
# 3. Deploys to production (if main branch)
# 4. Sends deployment notification
```

### Preview Deployments

**Every branch gets its own URL**:
```
main branch → https://lilgiftcorner.vercel.app (production)
feature branch → https://lilgiftcorner-git-feature.vercel.app
pull request → https://lilgiftcorner-pr-123.vercel.app
```

**Benefits**:
- Test changes before merging
- Share previews with team
- QA on different branches

### Deployment Notifications

**Vercel can notify**:
- Slack
- Discord  
- Email
- GitHub comments

**Setup**:
1. Project Settings → Git
2. Enable "Comments on Pull Requests"
3. Vercel comments with preview URL

### Rollback

**If deployment breaks production**:

1. Go to Vercel dashboard
2. **Deployments** tab
3. Find previous working deployment
4. Click **"⋯"** → **"Promote to Production"**
5. Previous version instantly restored

**Or via CLI**:
```bash
vercel rollback
```

### Deploy Hooks

**Trigger deployments via API**:

1. Project Settings → Git → Deploy Hooks
2. Create hook: `rebuild-on-data-change`
3. Get URL: `https://api.vercel.com/v1/integrations/deploy/...`
4. Trigger:
   ```bash
   curl -X POST https://api.vercel.com/v1/integrations/deploy/...
   ```

**Use cases**:
- Rebuild when CMS content changes
- Scheduled rebuilds
- Rebuild from backend events

---

## Performance Optimization

### Built-in Optimizations

Vercel automatically provides:

1. **Edge Network CDN**:
   - 70+ global locations
   - Assets cached close to users
   - Instant cache invalidation

2. **Smart Compression**:
   - Brotli compression
   - Gzip fallback
   - ~60-70% size reduction

3. **HTTP/2 & HTTP/3**:
   - Multiplexing
   - Server push
   - Faster connections

4. **Image Optimization**:
   - Use Next.js Image component (if migrating to Next.js)
   - Or optimize images before deployment

### Additional Optimizations

#### 1. Optimize Build

```json
// package.json
{
  "scripts": {
    "build": "react-scripts build",
    "analyze": "source-map-explorer build/static/js/*.js"
  },
  "devDependencies": {
    "source-map-explorer": "^2.5.3"
  }
}
```

Run:
```bash
npm run build
npm run analyze
# Visual breakdown of bundle size
```

#### 2. Code Splitting

Already enabled in Create React App:
```javascript
import React, { lazy, Suspense } from 'react';

// Lazy load heavy components
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Dashboard />
    </Suspense>
  );
}
```

#### 3. Remove Unused Dependencies

```bash
# Check for unused packages
npx depcheck

# Remove unused
npm uninstall unused-package
```

#### 4. Enable Production Mode

Vercel automatically sets `NODE_ENV=production`

Verify:
```javascript
if (process.env.NODE_ENV === 'production') {
  // Production-only code
  console.log = () => {}; // Disable console logs
}
```

### Performance Monitoring

#### Vercel Analytics

**Enable**:
1. Project Settings → Analytics
2. Enable "Web Analytics"
3. Add package:
   ```bash
   npm install @vercel/analytics
   ```
4. Add to app:
   ```javascript
   import { Analytics } from '@vercel/analytics/react';
   
   function App() {
     return (
       <>
         <YourApp />
         <Analytics />
       </>
     );
   }
   ```

**Provides**:
- Real user metrics
- Core Web Vitals
- Page load times
- User demographics

#### Lighthouse CI

Run Lighthouse on every deployment:

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Audit with Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://lilgiftcorner.vercel.app
          uploadArtifacts: true
```

---

## Advanced Configuration

### vercel.json Configuration

**Usually not needed** for Create React App, but here's a template:

```json
{
  "version": 2,
  "name": "lilgiftcorner",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      },
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "regions": ["iad1"],
  "env": {
    "REACT_APP_BACKEND_URL": "@backend_url"
  }
}
```

### Environment-Specific Builds

**Different builds for different environments**:

```json
// package.json
{
  "scripts": {
    "build": "react-scripts build",
    "build:staging": "env-cmd -f .env.staging react-scripts build",
    "build:production": "env-cmd -f .env.production react-scripts build"
  }
}
```

Configure in Vercel:
- Production branch: `main` → uses production env vars
- Staging branch: `staging` → uses preview env vars

---

## Cost Estimate

### Free Tier (Hobby)

| Feature | Free Limit |
|---------|------------|
| Deployments | Unlimited |
| Bandwidth | 100GB/month |
| Build Minutes | 6000 minutes/month |
| Serverless Functions | 100GB-hours |
| Team Members | 1 (personal) |
| Custom Domains | Unlimited |
| SSL | Free |

**Good for**: 
- Personal projects
- Small businesses
- Low-medium traffic sites (<100k visitors/month)

### Pro Tier

**$20/month** per user

| Feature | Pro Limit |
|---------|------------|
| Bandwidth | 1TB/month |
| Build Minutes | 24,000 minutes/month |
| Serverless Functions | 1000GB-hours |
| Team Members | Unlimited |
| Advanced Analytics | Included |
| Concurrent Builds | 10 |
| Priority Support | Included |

**Good for**:
- Production applications
- Medium-high traffic
- Team collaboration

---

## Security Best Practices

### 1. Environment Variables

```bash
# ✅ DO: Use Vercel dashboard
# ❌ DON'T: Commit .env files

# Add to .gitignore:
.env
.env.local
.env.production
.env.*.local
```

### 2. Secure Headers

Vercel adds security headers automatically:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`

Customize in `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'"
        }
      ]
    }
  ]
}
```

### 3. HTTPS Only

Vercel enforces HTTPS automatically:
- HTTP requests redirect to HTTPS
- HSTS headers enabled
- TLS 1.2+ only

### 4. Secrets Management

```bash
# Store secrets in Vercel
vercel env add SECRET_KEY production

# Never in code:
# ❌ const key = "sk_live_1234567890";

# Use environment variables:
# ✅ const key = process.env.STRIPE_SECRET_KEY;
```

---

## Summary

### Quick Deploy Steps

```bash
# 1. Deploy backend first (Render/Railway/Heroku)
# See RENDER_DEPLOYMENT.md

# 2. Get backend URL
BACKEND_URL="https://your-backend.onrender.com"

# 3. Update frontend config
cd frontend
cat > .env.production << EOF
REACT_APP_BACKEND_URL=$BACKEND_URL
EOF

# 4. Commit and push
git add .
git commit -m "Configure for Vercel"
git push

# 5. Deploy to Vercel
# - Go to https://vercel.com/new
# - Import repository
# - Select frontend folder
# - Add environment variable
# - Deploy

# 6. Update backend CORS
# Add Vercel URL to backend CORS_ORIGINS

# Done! 🎉
```

### Key URLs

- **Frontend**: `https://lilgiftcorner.vercel.app`
- **Backend**: `https://lilgiftcorner-backend.onrender.com`
- **Database**: MongoDB Atlas

### Next Steps

1. ✅ Test thoroughly
2. ✅ Set up custom domain
3. ✅ Enable analytics
4. ✅ Monitor performance
5. ✅ Set up error tracking (Sentry)

---

**Made with ❤️ for The Lil Gift Corner**  
**Deployed on Vercel**