# 🚀 Local Setup Guide - The Lil Gift Corner

## Complete Step-by-Step Guide to Run on Your Local Machine

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

### Required Software:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.11 or higher) - [Download](https://www.python.org/downloads/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Yarn** - Install via: `npm install -g yarn`
- **Git** - [Download](https://git-scm.com/downloads)

### Verify Installation:
```bash
node --version    # Should show v16.x.x or higher
python --version  # Should show 3.11.x or higher
mongod --version  # Should show MongoDB v4.4.x or higher
yarn --version    # Should show 1.22.x or higher
```

---

## 📦 Step 1: Extract the Project

1. **Extract the ZIP file** to your desired location:
   ```bash
   unzip "app_clean (17).zip" -d ~/Projects/lil-gift-corner
   cd ~/Projects/lil-gift-corner
   ```

2. **Verify folder structure**:
   ```bash
   ls -la
   ```
   You should see:
   - `backend/` - FastAPI backend
   - `frontend/` - React frontend
   - `docs/` - Documentation
   - `tests/` - Test files
   - `README.md`

---

## 🗄️ Step 2: Setup MongoDB

### Option A: Local MongoDB (Recommended for Development)

1. **Start MongoDB service**:

   **On macOS:**
   ```bash
   brew services start mongodb-community
   ```

   **On Linux:**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod  # Start on boot
   ```

   **On Windows:**
   - Open Services (Win + R → `services.msc`)
   - Find "MongoDB Server" and click "Start"

2. **Verify MongoDB is running**:
   ```bash
   mongo --eval "db.version()"
   # Or for newer versions:
   mongosh --eval "db.version()"
   ```

### Option B: MongoDB Atlas (Cloud - Free Tier)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
4. Update `.env` file with this connection string

---

## 🔧 Step 3: Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create Python virtual environment** (Optional but recommended):
   ```bash
   python -m venv venv
   
   # Activate virtual environment:
   # On macOS/Linux:
   source venv/bin/activate
   
   # On Windows:
   venv\Scripts\activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   This will install 126 packages including FastAPI, MongoDB drivers, Stripe, etc.

4. **Configure environment variables**:
   
   The `.env` file already exists in the `backend/` folder with these defaults:
   ```env
   MONGO_URL="mongodb://localhost:27017"
   DB_NAME="lilgiftcorner_db"
   CORS_ORIGINS="*"
   JWT_SECRET="your-secret-key-change-in-production"
   STRIPE_API_KEY="sk_test_emergent"
   ```

   **For production, update:**
   - `JWT_SECRET` - Use a strong random string
   - `STRIPE_API_KEY` - Use your real Stripe key
   - `MONGO_URL` - If using MongoDB Atlas

5. **Seed the database with sample products**:
   ```bash
   python seed_products.py
   ```
   This creates:
   - 20 sample products across 5 categories
   - Admin user (admin@thelilgiftcorner.com / Admin@123)
   - Database indexes for performance

6. **Start the backend server**:
   ```bash
   python server.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   ```

7. **Verify backend is running**:
   ```bash
   # In a new terminal:
   curl http://localhost:8001/api/health
   ```
   Should return:
   ```json
   {
     "status": "healthy",
     "app": "The Lil Gift Corner API",
     "version": "2.0.0"
   }
   ```

8. **View API documentation**:
   Open in browser: http://localhost:8001/api/docs
   
   This shows all available API endpoints with interactive testing!

---

## 💻 Step 4: Frontend Setup

1. **Open a new terminal** and navigate to frontend:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   yarn install
   ```
   This installs React 19, TailwindCSS, Radix UI components, and 60+ other packages.

3. **Configure environment variables**:
   
   The `.env` file already exists in `frontend/` folder:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:8001
   WDS_SOCKET_PORT=443
   REACT_APP_ENABLE_VISUAL_EDITS=false
   ENABLE_HEALTH_CHECK=false
   ```

   **Note:** Don't change `REACT_APP_BACKEND_URL` unless your backend runs on a different port.

4. **Start the frontend development server**:
   ```bash
   yarn start
   ```

5. **Access the application**:
   The browser should automatically open to: **http://localhost:3000**
   
   If not, manually open: http://localhost:3000

---

## 🎯 Step 5: Test the Application

### Default Admin Login:
- **URL**: http://localhost:3000/admin
- **Email**: admin@thelilgiftcorner.com
- **Password**: Admin@123

### Test Customer Features:

1. **Browse Products**:
   - Go to "Shop" page
   - Filter by categories (Gift Boxes, Hampers, Wedding Gifts, etc.)
   - Search for products
   - Sort by price/newest

2. **Create Customer Account**:
   - Click "Sign Up" (on homepage or in navbar)
   - Fill in details
   - Login with your credentials

3. **Test Shopping Flow**:
   - Add products to cart
   - View cart
   - Update quantities
   - Apply coupon (if available)
   - Proceed to checkout
   - Fill shipping address
   - **Payment**: Uses Stripe test mode
     - Test Card: `4242 4242 4242 4242`
     - Expiry: Any future date
     - CVC: Any 3 digits

4. **Test Other Features**:
   - ❤️ Add to Wishlist
   - 📦 Track orders
   - ⭐ Leave reviews
   - 📧 Contact form
   - 🎁 Custom gift requests

### Test Admin Features:

1. **Dashboard**:
   - View sales analytics
   - Total orders, revenue, customers
   - Recent orders

2. **Product Management**:
   - Add new products
   - Edit existing products
   - Delete products
   - Upload product images

3. **Order Management**:
   - View all orders
   - Update order status
   - View order details

4. **Customer Management**:
   - View all customers
   - View customer orders

5. **Custom Gift Requests**:
   - View custom gift requests
   - Update status
   - Respond to customers

---

## 🛠️ Step 6: Development Workflow

### Running Both Services:

**Option 1: Using Two Terminals**
```bash
# Terminal 1 - Backend
cd backend
python server.py

# Terminal 2 - Frontend
cd frontend
yarn start
```

**Option 2: Using tmux/screen (Linux/macOS)**
```bash
# Install tmux if not available
brew install tmux  # macOS
sudo apt install tmux  # Linux

# Start backend in background
tmux new -s backend -d "cd backend && python server.py"

# Start frontend in background
tmux new -s frontend -d "cd frontend && yarn start"

# View logs:
tmux attach -t backend   # Ctrl+B, D to detach
tmux attach -t frontend
```

### Hot Reload:

- **Backend**: Automatically reloads on code changes (uvicorn --reload)
- **Frontend**: Automatically reloads on code changes (React Fast Refresh)

### Stop Services:

```bash
# Stop backend: Ctrl + C in terminal
# Stop frontend: Ctrl + C in terminal

# Or kill processes:
pkill -f "uvicorn server:app"
pkill -f "react-scripts start"
```

---

## 🧪 Step 7: Run Tests

### Backend Tests:

```bash
cd backend
pytest tests/
# Or run specific test:
python tests/backend_test.py
```

### Test All API Endpoints:

```bash
cd tests
python comprehensive_api_test.py
```

---

## 📊 Step 8: Verify Everything Works

### Health Checks:

```bash
# Backend health
curl http://localhost:8001/api/health

# Frontend (should return HTML)
curl http://localhost:3000

# Database connection (should show products)
curl http://localhost:8001/api/products?limit=5
```

### Check Logs:

**Backend logs** - Terminal running `python server.py`

**Frontend logs** - Terminal running `yarn start`

**MongoDB logs**:
```bash
# Linux:
tail -f /var/log/mongodb/mongod.log

# macOS:
tail -f /usr/local/var/log/mongodb/mongo.log
```

---

## 🚨 Troubleshooting

### Backend Issues:

**Problem**: `ModuleNotFoundError: No module named 'xyz'`
```bash
cd backend
pip install -r requirements.txt --force-reinstall
```

**Problem**: `Connection refused` to MongoDB
```bash
# Check if MongoDB is running:
pgrep mongod

# Start MongoDB:
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

**Problem**: `Port 8001 already in use`
```bash
# Find and kill process:
lsof -ti:8001 | xargs kill -9
# Or change port in backend/.env
```

### Frontend Issues:

**Problem**: `Cannot find module` errors
```bash
cd frontend
rm -rf node_modules yarn.lock
yarn install
```

**Problem**: `Port 3000 already in use`
```bash
# Kill process on port 3000:
lsof -ti:3000 | xargs kill -9
# Or start on different port:
PORT=3001 yarn start
```

**Problem**: Blank page or won't load
```bash
# Clear browser cache
# Check browser console (F12) for errors
# Verify backend is running (curl http://localhost:8001/api/health)
```

### Database Issues:

**Problem**: Database connection errors
```bash
# Test MongoDB connection:
mongo  # or mongosh for newer versions

# If connection fails, check MongoDB status:
sudo systemctl status mongod

# Restart MongoDB:
sudo systemctl restart mongod
```

**Problem**: No products showing
```bash
cd backend
python seed_products.py
```

---

## 🔑 Important URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main website |
| **Backend API** | http://localhost:8001 | API base URL |
| **API Docs (Swagger)** | http://localhost:8001/api/docs | Interactive API documentation |
| **API Docs (ReDoc)** | http://localhost:8001/api/redoc | Alternative API docs |
| **Admin Panel** | http://localhost:3000/admin | Admin dashboard |
| **MongoDB** | mongodb://localhost:27017 | Database connection |

---

## 📝 Default Credentials

### Admin User:
- **Email**: admin@thelilgiftcorner.com
- **Password**: Admin@123

### Test Stripe Cards:
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Requires Auth**: 4000 0025 0000 3155

**Note:** Any future expiry date and any 3-digit CVC works for test cards.

---

## 🎨 Project Structure

```
lil-gift-corner/
├── backend/
│   ├── api/
│   │   ├── routes/        # API endpoint handlers
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   ├── repositories/  # Database operations
│   │   ├── middleware/    # Custom middleware
│   │   ├── config/        # Configuration
│   │   └── utils/         # Utility functions
│   ├── server.py          # Main FastAPI app
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables
│
├── frontend/
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   ├── App.js        # Main App component
│   │   └── index.js      # Entry point
│   ├── package.json      # Node dependencies
│   └── .env             # Environment variables
│
├── docs/                # Detailed documentation
├── tests/               # Test files
└── README.md           # Project overview
```

---

## 🚀 Next Steps

### For Development:
1. ✅ Follow this guide to setup local environment
2. ✅ Test all features manually
3. 📝 Make code changes as needed
4. 🧪 Run tests to verify changes
5. 🔄 Repeat

### For Production Deployment:
1. 📖 Read: `docs/DEPLOYMENT_GUIDE.md`
2. 🌐 Deploy frontend to Vercel
3. 🖥️ Deploy backend to Render
4. 🗄️ Setup MongoDB Atlas
5. 🔐 Update environment variables with production values
6. ⚙️ Configure custom domain (optional)

---

## 📚 Additional Resources

- **API Documentation**: `docs/API_DOCS.md`
- **Deployment Guide**: `docs/DEPLOYMENT_GUIDE.md`
- **Testing Report**: `docs/FINAL_COMPREHENSIVE_TESTING_REPORT.md`
- **Future Enhancements**: `docs/FUTURE_ENHANCEMENTS.md`
- **Changelog**: `docs/CHANGELOG.md`

---

## 🆘 Need Help?

### Check Documentation:
- Read the `/docs` folder for detailed guides
- Check API docs at http://localhost:8001/api/docs

### Common Issues:
- Database connection → Check MongoDB is running
- Port conflicts → Kill process or change port
- Missing modules → Reinstall dependencies
- Frontend errors → Check browser console (F12)

### Debug Mode:
```bash
# Backend verbose logs:
LOG_LEVEL=DEBUG python server.py

# Frontend debug:
REACT_APP_DEBUG=true yarn start
```

---

## ✅ Setup Checklist

Use this checklist to ensure everything is configured:

- [ ] Node.js v16+ installed
- [ ] Python 3.11+ installed
- [ ] MongoDB v4.4+ installed
- [ ] Yarn installed
- [ ] MongoDB service running
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`yarn install`)
- [ ] Database seeded (`python seed_products.py`)
- [ ] Backend running on port 8001
- [ ] Frontend running on port 3000
- [ ] API health check passes (http://localhost:8001/api/health)
- [ ] Frontend loads in browser (http://localhost:3000)
- [ ] Can login as admin (admin@thelilgiftcorner.com / Admin@123)
- [ ] Products are visible in Shop page
- [ ] Can add items to cart
- [ ] Can create customer account

---

## 🎉 Success!

If all steps completed successfully, you should now have:
- ✅ Backend API running on http://localhost:8001
- ✅ Frontend website running on http://localhost:3000
- ✅ MongoDB database with 20 sample products
- ✅ Admin dashboard accessible
- ✅ All features working

**Happy Coding!** 🚀

---

**Last Updated**: November 8, 2025  
**Version**: 2.0.0  
**Tested On**: macOS, Linux, Windows
