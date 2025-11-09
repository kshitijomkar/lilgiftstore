# Local Development Setup Guide
### The Lil Gift Corner - Complete Local Setup Instructions

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Node.js**: v18.x or higher (recommend v20.x)
  - Check: `node --version`
  - Download: https://nodejs.org/

- **Python**: 3.11 or higher
  - Check: `python3 --version`
  - Download: https://www.python.org/downloads/

- **MongoDB**: 4.4 or higher
  - Check: `mongod --version`
  - Download: https://www.mongodb.com/try/download/community
  - Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

- **Yarn**: Package manager (recommended over npm)
  - Install: `npm install -g yarn`
  - Check: `yarn --version`

### Optional but Recommended

- **Git**: For version control
- **VS Code**: IDE with Python and React extensions
- **Docker**: For containerized MongoDB
- **Postman**: For API testing

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd the-lil-gift-corner
```

### 2. Backend Setup

#### Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

#### Configure Backend Environment

Create `.env` file in the `/backend` directory:

```env
# Database Configuration
MONGO_URL="mongodb://localhost:27017"
DB_NAME="lilgiftcorner_db"

# Security
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# CORS (use * for development, specific domains for production)
CORS_ORIGINS="*"

# Stripe Payment (test key for development)
STRIPE_API_KEY=
```

**Security Note**: Always use strong, unique secrets in production!

#### Start MongoDB

If using Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Or start MongoDB service:
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

#### Seed Initial Data

The backend automatically seeds:
- 8 sample products
- 1 admin user (admin@thelilgiftcorner.com / Admin@123)
- Database indexes for performance

This happens on first startup.

#### Start Backend Server

```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Application startup complete.
```

**Verify Backend**:
- API Health: http://localhost:8001/api/
- Swagger UI: http://localhost:8001/api/docs
- ReDoc: http://localhost:8001/api/redoc

### 3. Frontend Setup

#### Install Node Dependencies

```bash
cd ../frontend
yarn install
```

Or with npm:
```bash
npm install
```

#### Configure Frontend Environment

Create `.env` file in the `/frontend` directory:

```env
# Backend API URL (adjust port if different)
REACT_APP_BACKEND_URL=http://localhost:8001

# Development Server
WDS_SOCKET_PORT=443

# Feature Flags
REACT_APP_ENABLE_VISUAL_EDITS=false
ENABLE_HEALTH_CHECK=false
```

#### Start Frontend Server

```bash
yarn start
```

Or with npm:
```bash
npm start
```

The application will open automatically at: http://localhost:3000

---

## Accessing the Application

### Customer Portal
- **URL**: http://localhost:3000
- **Features**: Browse products, add to cart, checkout, register, login

### Admin Dashboard
- **URL**: http://localhost:3000/admin
- **Credentials**:
  - Email: `admin@thelilgiftcorner.com`
  - Password: `Admin@123`
- **Features**: Product management, orders, analytics, users

### API Documentation
- **Swagger UI**: http://localhost:8001/api/docs
- **ReDoc**: http://localhost:8001/api/redoc
- **OpenAPI JSON**: http://localhost:8001/api/openapi.json

---

## Development Workflow

### Running Tests

#### Backend Tests
```bash
cd backend
pytest
```

#### Frontend Tests
```bash
cd frontend
yarn test
```

### Code Quality

#### Python Linting
```bash
cd backend
flake8 server.py
black server.py --check
mypy server.py
```

#### JavaScript Linting
```bash
cd frontend
yarn lint
```

### Database Management

#### Access MongoDB Shell
```bash
mongosh
use lilgiftcorner_db
show collections
```

#### Clear Database (reset)
```bash
mongosh
use lilgiftcorner_db
db.dropDatabase()
```

Restart backend to re-seed data.

---

## Troubleshooting

### Backend Issues

#### Port Already in Use
```bash
# Find process using port 8001
lsof -i :8001
# Kill process
kill -9 <PID>
```

#### MongoDB Connection Failed
- Ensure MongoDB is running: `mongosh --eval "db.runCommand({ ping: 1 })"`
- Check MONGO_URL in .env
- Verify port 27017 is accessible

#### Import Errors
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues

#### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules yarn.lock
yarn install
```

#### CORS Errors
- Verify REACT_APP_BACKEND_URL in frontend/.env
- Check CORS_ORIGINS in backend/.env
- Ensure backend is running

#### White Screen
- Check browser console for errors
- Clear browser cache
- Verify all environment variables are set

### Common Errors

| Error | Solution |
|-------|----------|
| "Cannot connect to MongoDB" | Start MongoDB service |
| "Port 3000 already in use" | Kill process or use different port |
| "Stripe API key invalid" | Use test key: sk_test_emergent |
| "Login failed" | Check backend logs, verify admin user seeded |

---

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|--------|
| MONGO_URL | MongoDB connection string | Yes | mongodb://localhost:27017 |
| DB_NAME | Database name | Yes | lilgiftcorner_db |
| JWT_SECRET | Secret key for JWT tokens | Yes | (generate unique) |
| CORS_ORIGINS | Allowed origins (* for dev) | Yes | * |
| STRIPE_API_KEY | Stripe API key | Yes | sk_test_emergent |

### Frontend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|--------|
| REACT_APP_BACKEND_URL | Backend API base URL | Yes | http://localhost:8001 |
| WDS_SOCKET_PORT | Webpack dev server port | No | 443 |

---

## Development Tips

### Hot Reload
- Backend: `--reload` flag enables auto-restart on code changes
- Frontend: Built-in with React development server

### Debug Mode

#### Backend Debugging
Add to server.py:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

#### Frontend Debugging
Use React DevTools browser extension

### Database Indexing

Indexes are created automatically on startup. Verify:
```javascript
use lilgiftcorner_db
db.products.getIndexes()
```

### API Testing with cURL

```bash
# Test login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@thelilgiftcorner.com","password":"Admin@123"}'

# Get products
curl http://localhost:8001/api/products

# Get product by ID (with authentication)
curl -H "Authorization: Bearer <token>" \
  http://localhost:8001/api/products/<product-id>
```

---

## Next Steps

1. ✅ Complete local setup
2. ✅ Test all features (customer & admin)
3. ✅ Review API documentation
4. 📖 Read deployment guides:
   - [Vercel Deployment](./VERCEL_DEPLOYMENT_GUIDE.md)
   - [Render Deployment](./RENDER_DEPLOYMENT_GUIDE.md)
5. 🚀 Deploy to production

---

## Need Help?

- **Documentation**: Check README_COMPREHENSIVE.md
- **API Reference**: /api/docs
- **Issues**: Create issue in repository
- **Email**: support@thelilgiftcorner.com

---

**Made with ❤️ by The Lil Gift Corner Team**