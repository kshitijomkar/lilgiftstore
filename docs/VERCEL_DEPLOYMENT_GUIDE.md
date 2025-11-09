# Deploying to Vercel
### The Lil Gift Corner - Complete Vercel Deployment Guide

---

## Overview

Vercel is ideal for deploying the **frontend** React application. For the backend, you'll need a separate service like Render, Railway, or Heroku.

**Deployment Architecture**:
- Frontend (React) → Vercel
- Backend (FastAPI) → Render/Railway/Heroku
- Database (MongoDB) → MongoDB Atlas

---

## Prerequisites

- ✅ GitHub/GitLab/Bitbucket account
- ✅ Vercel account (free tier available)
- ✅ MongoDB Atlas account (or hosted MongoDB)
- ✅ Deployed backend API (see RENDER_DEPLOYMENT_GUIDE.md)

---

## Step-by-Step Guide

### 1. Prepare Your Repository

#### Frontend Structure

Ensure your project structure is:
```
/
├── frontend/          # React app
│   ├── package.json
│   ├── src/
│   ├── public/
│   └── .env
├── backend/           # FastAPI (deploy separately)
└── README.md
```

#### Update package.json

Verify these scripts exist in `frontend/package.json`:

```json
{
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test"
  }
}
```

### 2. Deploy Backend First

**Important**: Deploy your backend to Render/Railway first and note the URL.
Example: `https://your-app.onrender.com`

See [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md) for details.

### 3. Set Up MongoDB Atlas

1. **Create Cluster**:
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free M0 cluster
   - Choose region (same as backend)

2. **Configure Access**:
   - Database Access: Create user
   - Network Access: Add IP (0.0.0.0/0 for access from anywhere)

3. **Get Connection String**:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

### 4. Connect Vercel to Repository

1. **Go to Vercel Dashboard**:
   - Visit https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import Repository**:
   - Connect GitHub/GitLab/Bitbucket
   - Select your repository
   - Click "Import"

3. **Configure Project**:
   - Framework Preset: **Create React App**
   - Root Directory: `frontend` (important!)
   - Build Command: `yarn build` or `npm run build`
   - Output Directory: `build`
   - Install Command: `yarn install` or `npm install`

### 5. Configure Environment Variables

In Vercel project settings → "Environment Variables":

| Name | Value | Environment |
|------|-------|-------------|
| REACT_APP_BACKEND_URL | https://your-backend.onrender.com | Production |
| REACT_APP_BACKEND_URL | https://your-backend.onrender.com | Preview |
| REACT_APP_BACKEND_URL | http://localhost:8001 | Development |

**Critical**: Ensure the backend URL is correct and includes `https://`

### 6. Deploy

1. **Initial Deployment**:
   - Click "Deploy"
   - Wait for build to complete (~2-5 minutes)

2. **Verify Deployment**:
   - Visit your Vercel URL (e.g., `your-app.vercel.app`)
   - Check console for any errors
   - Test login, browsing products

---

## Vercel Configuration File

Create `vercel.json` in the root directory (optional but recommended):

```json
{
  "buildCommand": "cd frontend && yarn build",
  "outputDirectory": "frontend/build",
  "framework": "create-react-app",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend.onrender.com/api/:path*"
    }
  ]
}
```

**Note**: Replace `your-backend.onrender.com` with your actual backend URL.

---

## Custom Domain (Optional)

### Add Custom Domain

1. **In Vercel Dashboard**:
   - Go to Project → Settings → Domains
   - Add your domain (e.g., `www.thelilgiftcorner.com`)

2. **Configure DNS**:
   - Add CNAME record:
     ```
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```

3. **SSL Certificate**:
   - Vercel automatically provisions SSL
   - Usually takes 1-2 minutes

---

## Continuous Deployment

Vercel automatically deploys:
- **Production**: On push to `main` branch
- **Preview**: On push to any other branch
- **Pull Requests**: Automatic preview deployments

### Disable Auto-Deploy (if needed)

Settings → Git → Disable "Production Branch"

---

## Performance Optimization

### Enable Vercel Analytics

1. Go to Project → Analytics
2. Enable Web Vitals
3. Monitor Core Web Vitals

### Optimize Build

```json
// package.json
{
  "scripts": {
    "build": "craco build && echo 'Build complete!'"
  }
}
```

### Environment-Specific Builds

```javascript
// src/config.js
export const config = {
  apiUrl: process.env.REACT_APP_BACKEND_URL,
  isDev: process.env.NODE_ENV === 'development',
  version: '2.0.0'
};
```

---

## Troubleshooting

### Build Fails

**Error**: "Module not found"
```bash
# Solution: Check package.json dependencies
# Rebuild locally
cd frontend
rm -rf node_modules yarn.lock
yarn install
yarn build
```

**Error**: "Command failed with exit code 1"
```bash
# Solution: Check build logs
# Common fixes:
- Remove .env.local (should not be committed)
- Verify all imports are correct
- Check for TypeScript errors
```

### CORS Errors

**Issue**: API calls fail with CORS error

**Solution**:
1. Backend CORS configuration must include Vercel URL:
   ```python
   CORS_ORIGINS="https://your-app.vercel.app,https://www.yourdomain.com"
   ```

2. Verify `REACT_APP_BACKEND_URL` in Vercel environment variables

### Page Not Found (404)

**Issue**: Refresh causes 404 error

**Solution**: Create `public/_redirects` file:
```
/*    /index.html   200
```

Or in `vercel.json`:
```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
```

### Environment Variables Not Working

**Issue**: Variables are undefined

**Checklist**:
- ✅ Variable name starts with `REACT_APP_`
- ✅ Variable set in Vercel dashboard
- ✅ Redeployed after adding variables
- ✅ No typos in variable names

### Slow Build Times

**Optimization**:
1. Enable Vercel build cache
2. Reduce dependencies
3. Use `yarn` instead of `npm`
4. Consider upgrade to Vercel Pro

---

## Monitoring & Logs

### View Deployment Logs

1. Dashboard → Project → Deployments
2. Click on deployment
3. View "Building" and "Runtime" logs

### Real-time Function Logs

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# View logs
vercel logs your-app.vercel.app
```

---

## Rollback

### Revert to Previous Deployment

1. Dashboard → Deployments
2. Find working deployment
3. Click "•••" → "Promote to Production"

---

## Security Best Practices

### Secure Environment Variables
- Never commit .env files
- Use Vercel Environment Variables
- Different values for dev/preview/production

### HTTPS Only
- Vercel enforces HTTPS automatically
- Redirect HTTP to HTTPS

### Content Security Policy

Add to `public/index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               connect-src 'self' https://your-backend.onrender.com;">
```

---

## Cost Optimization

### Vercel Pricing

**Free Tier** (Hobby):
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ HTTPS included
- ✅ Custom domains (100 max)

**Pro Tier** ($20/month):
- 1TB bandwidth
- Priority builds
- Advanced analytics

### Tips
- Use Vercel for frontend only
- Optimize images (use WebP)
- Enable caching headers
- Use CDN for static assets

---

## Deployment Checklist

- [ ] Backend deployed and tested
- [ ] MongoDB Atlas configured
- [ ] Environment variables set in Vercel
- [ ] Build succeeds locally
- [ ] CORS configured on backend
- [ ] Custom domain added (optional)
- [ ] SSL certificate active
- [ ] Test all pages and features
- [ ] Monitor performance
- [ ] Set up error tracking (Sentry)

---

## Next Steps

1. ✅ Deploy frontend to Vercel
2. ✅ Configure custom domain
3. 📊 Enable analytics
4. 🔔 Set up monitoring alerts
5. 📈 Optimize performance

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Vercel Support](https://vercel.com/support)

---

**Deployment successful? Don't forget to celebrate! 🎉**

---

**Made with ❤️ by The Lil Gift Corner Team**
