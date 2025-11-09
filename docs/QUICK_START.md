# ⚡ Quick Start Guide - 5 Minutes Setup

## TL;DR - Get Running Fast!

### Prerequisites Check:
```bash
node --version   # Need v16+
python --version # Need 3.11+
mongod --version # Need v4.4+
```

---

## 🚀 3-Step Setup

### Step 1: Install Dependencies (3 minutes)

```bash
# Extract the project
cd /path/to/lil-gift-corner

# Backend setup
cd backend
pip install -r requirements.txt
python seed_products.py

# Frontend setup (in new terminal)
cd frontend
yarn install
```

### Step 2: Start Services (30 seconds)

```bash
# Terminal 1 - Backend
cd backend
python server.py

# Terminal 2 - Frontend  
cd frontend
yarn start
```

### Step 3: Open & Test (30 seconds)

- **Website**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
  - Email: `admin@thelilgiftcorner.com`
  - Password: `Admin@123`
- **API Docs**: http://localhost:8001/api/docs

---

## ✅ Verify It Works

```bash
# Health check
curl http://localhost:8001/api/health

# Get products
curl http://localhost:8001/api/products?limit=5
```

If you see JSON responses → **You're good to go!** 🎉

---

## 🛑 Troubleshooting

### MongoDB Not Running?
```bash
# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Windows: Start MongoDB from Services
```

### Port Already in Use?
```bash
# Kill process on port
lsof -ti:8001 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

### Missing Packages?
```bash
cd backend && pip install -r requirements.txt
cd frontend && yarn install
```

---

## 🎯 What You Get

- ✅ **20 Sample Products** across 5 categories
- ✅ **Admin Dashboard** with full CRUD
- ✅ **Customer Features** (cart, wishlist, checkout)
- ✅ **Stripe Payments** (test mode)
- ✅ **JWT Authentication**
- ✅ **Order Tracking**
- ✅ **Review System**
- ✅ **Responsive Design**

---

## 📖 Need More Help?

Read the full guide: **LOCAL_SETUP_GUIDE.md**

---

**Ready in 5 minutes!** ⚡
