# Deployment Guide - The Lil Gift Corner

Step-by-step guide to deploy The Lil Gift Corner to production.

---

## 🌐 Deployment Architecture

**Recommended Setup**:
- **Frontend**: Vercel (or Netlify)
- **Backend**: Render (or Railway/Heroku)
- **Database**: MongoDB Atlas
- **Storage**: Cloudinary (for product images)

---

## 📦 Pre-Deployment Checklist

- [ ] Test application locally
- [ ] Create MongoDB Atlas account
- [ ] Create Stripe account (production keys)
- [ ] Prepare environment variables
- [ ] Test admin functionality
- [ ] Verify payment flow

---

## 1️⃣ Deploy MongoDB (Atlas)

### Step 1: Create Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. Click **Build a Database**
4. Choose **FREE** tier (M0)
5. Select region closest to your users
6. Name cluster: `lilgiftcorner-prod`
7. Click **Create**

### Step 2: Create Database User

1. Go to **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Username: `lilgift_admin`
5. Generate strong password (save securely!)
6. Database User Privileges: **Read and write to any database**
7. Click **Add User**

### Step 3: Whitelist IP Addresses

1. Go to **Network Access**
2. Click **Add IP Address**
3. Choose **Allow Access from Anywhere** (`0.0.0.0/0`)
   - Or add specific IPs for better security
4. Click **Confirm**

### Step 4: Get Connection String

1. Go to **Database** → **Connect**
2. Choose **Connect your application**
3. Copy connection string:
   ```
   mongodb+srv://lilgift_admin:<password>@lilgiftcorner-prod.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with actual password
5. Save for backend deployment

---

## 2️⃣ Deploy Backend (Render)

### Step 1: Prepare Repository

1. Create GitHub repository
2. Push backend code:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/lilgiftcorner-backend.git
   git push -u origin main
   ```

### Step 2: Create Render Service

1. Go to [Render.com](https://render.com/)
2. Sign up / Log in with GitHub
3. Click **New +** → **Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Name**: `lilgiftcorner-api`
   - **Region**: Select nearest
   - **Branch**: `main`
   - **Root Directory**: Leave blank (or `/backend` if monorepo)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port 8001`

### Step 3: Add Environment Variables

1. Scroll to **Environment Variables**
2. Add the following:

```env
MONGO_URL=mongodb+srv://lilgift_admin:yourpassword@lilgiftcorner-prod.xxxxx.mongodb.net/
DB_NAME=lilgiftcorner
JWT_SECRET=your-super-secret-production-jwt-key-min-32-chars
STRIPE_API_KEY=sk_live_your_production_stripe_key
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
REACT_APP_BACKEND_URL=https://lilgiftcorner-api.onrender.com
```

3. Click **Create Web Service**
4. Wait for deployment (5-10 minutes)
5. Note your backend URL: `https://lilgiftcorner-api.onrender.com`

### Step 4: Verify Deployment

Visit: `https://lilgiftcorner-api.onrender.com/docs`

You should see Swagger API documentation.

---

## 3️⃣ Deploy Frontend (Vercel)

### Step 1: Prepare Repository

1. Push frontend to GitHub:
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/lilgiftcorner-frontend.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com/)
2. Sign up / Log in with GitHub
3. Click **Add New** → **Project**
4. Import your frontend repository
5. Configure:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: Leave blank (or `/frontend`)
   - **Build Command**: `yarn build`
   - **Output Directory**: `build`

### Step 3: Add Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add:

```env
REACT_APP_BACKEND_URL=https://lilgiftcorner-api.onrender.com
```

3. Click **Deploy**
4. Wait for build (3-5 minutes)
5. Get your URL: `https://lilgiftcorner.vercel.app`

### Step 4: Update Backend CORS

Go back to Render backend settings and update:

```env
CORS_ORIGINS=https://lilgiftcorner.vercel.app
```

Redeploy backend.

---

## 4️⃣ Custom Domain Setup

### Frontend Domain (Vercel)

1. Go to Vercel project **Settings** → **Domains**
2. Add your domain: `www.thelilgiftcorner.com`
3. Follow DNS instructions (add CNAME record)
4. Wait for SSL certificate (automatic)

### Backend Domain (Optional)

1. In Render, go to **Settings** → **Custom Domain**
2. Add: `api.thelilgiftcorner.com`
3. Update DNS with provided records

---

## 5️⃣ Production Checklist

### Security
- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Use production Stripe keys
- [ ] Limit CORS to specific domains
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Set up database backups on Atlas

### Performance
- [ ] Enable MongoDB indexes
- [ ] Configure Cloudflare (optional CDN)
- [ ] Optimize images (WebP format)
- [ ] Enable gzip compression

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up log aggregation
- [ ] Enable Stripe webhook notifications

### SEO
- [ ] Submit sitemap to Google
- [ ] Configure Google Analytics
- [ ] Set up Google Search Console
- [ ] Add social media meta tags

---

## 6️⃣ Stripe Production Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Switch to **Live Mode** (toggle in sidebar)
3. Go to **Developers** → **API Keys**
4. Copy **Live Secret Key**
5. Update `STRIPE_API_KEY` in Render backend
6. Configure webhooks:
   - URL: `https://lilgiftcorner-api.onrender.com/api/webhook/stripe`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`

---

## 🔄 Continuous Deployment

Both Vercel and Render support auto-deployment:

1. Push changes to GitHub
2. Services automatically rebuild and deploy
3. Monitor deployment logs

---

## 📊 Post-Deployment Testing

1. **Homepage**: Load all products
2. **Product Page**: View details
3. **Add to Cart**: Test cart functionality
4. **Checkout**: Complete test payment
5. **Admin Login**: Access dashboard
6. **Create Product**: Test admin CRUD

---

## 🆘 Troubleshooting

### Frontend can't reach backend
- Check `REACT_APP_BACKEND_URL` matches backend URL
- Verify CORS settings in backend
- Check browser console for errors

### Payment failing
- Verify Stripe keys are production keys
- Check webhook is configured
- Review Stripe dashboard logs

### Database connection failed
- Verify MongoDB Atlas whitelist includes `0.0.0.0/0`
- Check connection string has correct password
- Ensure database user has proper permissions

---

## 📈 Scaling Considerations

- Upgrade MongoDB Atlas tier for more storage
- Use Render paid plan for better performance
- Implement Redis for caching
- Use CDN for static assets
- Add load balancer for high traffic

---

## 🎉 Congratulations!

Your Lil Gift Corner eCommerce site is now live!

Share it with the world:
- 🌐 Website: https://yoursite.com
- 📸 Instagram: @_thelilgiftcorner
- 📧 Email: hello@thelilgiftcorner.com
