# Setup Guide - The Lil Gift Corner

Complete guide to set up and run The Lil Gift Corner eCommerce website locally.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or later) - [Download](https://nodejs.org/)
- **Python** (v3.9 or later) - [Download](https://python.org/)
- **MongoDB** - Either:
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud - Recommended)
  - [MongoDB Community Edition](https://www.mongodb.com/try/download/community) (Local)
- **Yarn** package manager - Install with: `npm install -g yarn`
- **Git** (optional, for version control)

---

## 🚀 Installation Steps

### 1. Extract the Project

```bash
# Extract the zip file
unzip thelilgiftcorner_fullstack_final_v5.zip
cd thelilgiftcorner
```

### 2. Backend Setup

#### A. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

#### B. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=lilgiftcorner

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Stripe API Key (use test key for development)
STRIPE_API_KEY=sk_test_your_stripe_test_key # Use real key for production

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Backend URL (for webhooks)
REACT_APP_BACKEND_URL=http://localhost:8001
```

#### C. Seed the Database (Optional but Recommended)

The backend automatically seeds sample products and an admin user on first startup.

**Default Admin Credentials**:
- Email: `admin@thelilgiftcorner.com`
- Password: `Admin@123`

---

### 3. Frontend Setup

#### A. Install Node Dependencies

```bash
cd ../frontend
yarn install
```

#### B. Configure Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8001
```

---

## ▶️ Running the Application

### Option 1: Run Both Services Separately (Recommended for Development)

#### Terminal 1 - Backend
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

#### Terminal 2 - Frontend
```bash
cd frontend
yarn start
```

### Option 2: Using Supervisor (Production-like)

If you have supervisor installed:

```bash
sudo supervisorctl start backend
sudo supervisorctl start frontend
```

---

## 🌐 Access the Application

Once both services are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs (Interactive Swagger UI)
- **Admin Panel**: http://localhost:3000/admin

---

## 🗄️ MongoDB Setup Options

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (Free tier available)
3. Go to **Database Access** → Add a database user
4. Go to **Network Access** → Add your IP (or use `0.0.0.0/0` for development)
5. Get your connection string from **Connect** → **Connect your application**
6. Update `MONGO_URL` in `backend/.env`:

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/lilgiftcorner?retryWrites=true&w=majority
```

### Option B: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Start from Services or MongoDB Compass
```

3. Use default connection string in `backend/.env`:

```env
MONGO_URL=mongodb://localhost:27017
```

---

## 🔑 Stripe Setup (Payment Integration)

1. Create a free account at [Stripe](https://stripe.com/)
2. Go to **Developers** → **API Keys**
3. Copy your **Test mode** secret key
4. Update `STRIPE_API_KEY` in `backend/.env`

```env
STRIPE_API_KEY=sk_test_your_stripe_test_key # Use real key for production
```

⚠️ **Note**: Use test mode keys for development. Real transactions won't be charged.

---

## ✅ Verify Installation

After starting both services:

### 1. Backend Health Check

Visit http://localhost:8001/docs and you should see the Swagger API documentation.

### 2. Frontend Check

Visit http://localhost:3000 and you should see the home page with products.

### 3. Test Admin Login

1. Go to http://localhost:3000
2. Click "Login" in the navbar
3. Use admin credentials:
   - Email: `admin@thelilgiftcorner.com`
   - Password: `Admin@123`
4. Navigate to http://localhost:3000/admin

---

## 🐛 Troubleshooting

### Backend won't start

**Error**: `ModuleNotFoundError: No module named 'fastapi'`
- **Solution**: Run `pip install -r requirements.txt` in backend directory

**Error**: `Connection refused - MongoDB`
- **Solution**: Ensure MongoDB is running or check MONGO_URL in `.env`

### Frontend won't start

**Error**: `Cannot find module 'react'`
- **Solution**: Run `yarn install` in frontend directory

**Error**: `Port 3000 already in use`
- **Solution**: Kill existing process or use different port:
  ```bash
  PORT=3001 yarn start
  ```

### CORS Errors

**Error**: `Access-Control-Allow-Origin` error in browser console
- **Solution**: Ensure `CORS_ORIGINS` in backend `.env` includes your frontend URL

### Products not loading

**Error**: Empty product list
- **Solution**: Backend auto-seeds on first start. Restart backend:
  ```bash
  cd backend
  uvicorn server:app --reload
  ```

---

## 🔧 Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend**: Changes auto-refresh in browser
- **Backend**: Uses `--reload` flag for auto-restart

### Viewing Logs

```bash
# Frontend logs
cd frontend
yarn start
# Output appears in terminal

# Backend logs  
cd backend
uvicorn server:app --log-level debug
```

### Database GUI

Use [MongoDB Compass](https://www.mongodb.com/products/compass) to view/edit database visually.

---

## 📱 Testing on Mobile Device

1. Find your computer's local IP:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. Update frontend `.env`:
   ```env
   REACT_APP_BACKEND_URL=http://YOUR_LOCAL_IP:8001
   ```

3. Access on mobile: `http://YOUR_LOCAL_IP:3000`

---

## 🎯 Next Steps

- [Deploy to production](./DEPLOYMENT_GUIDE.md)
- [Explore API endpoints](./API_DOCS.md)
- Customize products and branding
- Configure real Stripe payment keys
- Set up custom domain

---

## 💡 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Stripe Documentation](https://stripe.com/docs)

---

## 📞 Need Help?

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review error messages carefully
3. Ensure all environment variables are set correctly
4. Check that MongoDB and both services are running

---

**Happy Coding! 🎉**
