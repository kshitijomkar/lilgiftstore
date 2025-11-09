# Configuration Guide - The Lil Gift Corner

**Document Version**: 1.0  
**Project Version**: 2.0.0  
**Last Updated**: January 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Environment Variables](#environment-variables)
3. [Backend Configuration](#backend-configuration)
4. [Frontend Configuration](#frontend-configuration)
5. [Database Configuration](#database-configuration)
6. [Payment Configuration](#payment-configuration)
7. [Security Configuration](#security-configuration)
8. [Email Configuration](#email-configuration-future)
9. [Deployment Configurations](#deployment-configurations)
10. [Configuration Best Practices](#configuration-best-practices)

---

## Overview

The Lil Gift Corner uses environment variables for configuration, following the [12-Factor App](https://12factor.net/) methodology. This approach ensures:

- **Security**: Sensitive data never committed to version control
- **Flexibility**: Different configs for dev, staging, production
- **Portability**: Easy deployment across platforms
- **Separation**: Configuration separated from code

### Configuration Files

- **Backend**: `backend/.env` - Python/FastAPI configuration
- **Frontend**: `frontend/.env` - React configuration
- **Example Files**: `.env.example` files for reference

---

## Environment Variables

### Variable Naming Conventions

- **All caps**: `MONGO_URL`, `JWT_SECRET`
- **Underscore separation**: `JWT_EXPIRATION_DAYS`
- **Frontend prefix**: `REACT_APP_` for React variables

### Environment-Specific Values

| Environment | Purpose | Security Level |
|-------------|---------|----------------|
| **Development** | Local development | Low (test keys ok) |
| **Staging** | Pre-production testing | Medium (similar to prod) |
| **Production** | Live application | High (real secrets) |

---

## Backend Configuration

### Complete Backend .env File

Location: `backend/.env`

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
# MongoDB connection string
MONGO_URL=mongodb://localhost:27017
# For MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/

# Database name
DB_NAME=lilgiftcorner_db

# ============================================
# SECURITY CONFIGURATION
# ============================================
# JWT Secret Key (MUST be 32+ characters)
# Generate: openssl rand -hex 32
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars

# JWT Algorithm
JWT_ALGORITHM=HS256

# JWT Token Expiration (in days)
JWT_EXPIRATION_DAYS=7

# ============================================
# PAYMENT CONFIGURATION
# ============================================
# Stripe API Key
# Test mode: sk_test_...
# Live mode: sk_live_...
STRIPE_API_KEY=sk_test_your_test_key

# ============================================
# CORS CONFIGURATION
# ============================================
# Allowed origins (comma-separated)
# Development:
CORS_ORIGINS=http://localhost:3000
# Production:
# CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# ============================================
# SERVER CONFIGURATION
# ============================================
# Server host (0.0.0.0 to accept all connections)
HOST=0.0.0.0

# Server port
PORT=8001

# ============================================
# APPLICATION SETTINGS
# ============================================
# Application name
APP_NAME=The Lil Gift Corner API

# Application version
APP_VERSION=2.0.0

# Debug mode (True/False)
DEBUG=False

# ============================================
# LOGGING CONFIGURATION
# ============================================
# Log level: DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_LEVEL=INFO

# ============================================
# ADMIN CONFIGURATION
# ============================================
# Default admin email
ADMIN_EMAIL=admin@thelilgiftcorner.com

# Default admin password (CHANGE IN PRODUCTION!)
ADMIN_PASSWORD=Admin@123

# ============================================
# PAGINATION SETTINGS
# ============================================
# Default number of items per page
DEFAULT_PAGE_SIZE=20

# Maximum items per page
MAX_PAGE_SIZE=100

# ============================================
# STOCK MANAGEMENT
# ============================================
# Default stock quantity for new products
DEFAULT_STOCK_QUANTITY=100

# Low stock threshold for alerts
DEFAULT_LOW_STOCK_THRESHOLD=10
```

### Backend Environment Variables Reference

#### Database Variables

| Variable | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `MONGO_URL` | string | `mongodb://localhost:27017` | Yes | MongoDB connection string |
| `DB_NAME` | string | `lilgiftcorner_db` | Yes | Database name |

**Examples**:
```env
# Local MongoDB
MONGO_URL=mongodb://localhost:27017

# MongoDB Atlas (cloud)
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/

# MongoDB with authentication
MONGO_URL=mongodb://user:pass@localhost:27017/admin

# MongoDB replica set
MONGO_URL=mongodb://host1:27017,host2:27017,host3:27017/?replicaSet=rs0
```

#### Security Variables

| Variable | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `JWT_SECRET` | string | `your-secret-key...` | Yes | Secret key for JWT tokens (32+ chars) |
| `JWT_ALGORITHM` | string | `HS256` | Yes | JWT signing algorithm |
| `JWT_EXPIRATION_DAYS` | integer | `7` | Yes | Token expiration in days |

**Generating Secure JWT_SECRET**:
```bash
# Method 1: OpenSSL
openssl rand -hex 32

# Method 2: Python
python -c "import secrets; print(secrets.token_hex(32))"

# Method 3: Online
# Visit: https://generate-secret.vercel.app/32
```

#### Payment Variables

| Variable | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `STRIPE_API_KEY` | string | `sk_test_your_test_key` | Yes | Stripe secret API key |

**Getting Stripe Keys**:
1. Sign up at https://stripe.com
2. Go to Developers → API keys
3. Use test keys for development: `sk_test_...`
4. Use live keys for production: `sk_live_...`

#### Server Variables

| Variable | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `HOST` | string | `0.0.0.0` | No | Server bind address |
| `PORT` | integer | `8001` | No | Server port |
| `CORS_ORIGINS` | string | `*` | Yes | Allowed CORS origins |

#### Application Variables

| Variable | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `APP_NAME` | string | `The Lil Gift Corner API` | No | Application name |
| `APP_VERSION` | string | `2.0.0` | No | Application version |
| `DEBUG` | boolean | `False` | No | Debug mode |
| `LOG_LEVEL` | string | `INFO` | No | Logging level |

---

## Frontend Configuration

### Complete Frontend .env File

Location: `frontend/.env`

```env
# ============================================
# BACKEND API CONFIGURATION
# ============================================
# Backend API base URL
# Development:
REACT_APP_BACKEND_URL=http://localhost:8001
# Production:
# REACT_APP_BACKEND_URL=https://api.yourdomain.com

# ============================================
# DEVELOPMENT SETTINGS
# ============================================
# WebSocket port for dev server
WDS_SOCKET_PORT=3000

# Enable visual edits
REACT_APP_ENABLE_VISUAL_EDITS=false

# Enable health checks
ENABLE_HEALTH_CHECK=false

# ============================================
# FEATURE FLAGS (Optional)
# ============================================
# Enable product reviews
REACT_APP_ENABLE_REVIEWS=true

# Enable wishlist
REACT_APP_ENABLE_WISHLIST=true

# Enable coupons
REACT_APP_ENABLE_COUPONS=true

# ============================================
# ANALYTICS (Optional)
# ============================================
# Google Analytics ID
# REACT_APP_GA_ID=G-XXXXXXXXXX

# Facebook Pixel ID
# REACT_APP_FB_PIXEL_ID=1234567890
```

### Frontend Environment Variables Reference

| Variable | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `REACT_APP_BACKEND_URL` | string | none | Yes | Backend API base URL |
| `WDS_SOCKET_PORT` | integer | `3000` | No | Dev server socket port |
| `REACT_APP_ENABLE_VISUAL_EDITS` | boolean | `false` | No | Enable visual editing |
| `ENABLE_HEALTH_CHECK` | boolean | `false` | No | Enable health checks |

**Important Notes**:
- All React environment variables must be prefixed with `REACT_APP_`
- Variables are embedded in the build at build time
- Changing .env requires restart of dev server
- In production, set variables in hosting platform (Vercel, Netlify)

---

## Database Configuration

### MongoDB Connection Strings

#### Local MongoDB
```env
MONGO_URL=mongodb://localhost:27017
```

#### MongoDB with Authentication
```env
MONGO_URL=mongodb://username:password@localhost:27017/admin
```

#### MongoDB Atlas (Cloud)
```env
MONGO_URL=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

#### MongoDB Replica Set
```env
MONGO_URL=mongodb://host1:27017,host2:27017,host3:27017/?replicaSet=myReplicaSet
```

### MongoDB Atlas Setup

1. **Create Cluster**: Sign up at https://cloud.mongodb.com
2. **Create Database User**:
   - Go to Database Access
   - Add New Database User
   - Set username and password
   - Grant "Read and write to any database" permissions

3. **Configure Network Access**:
   - Go to Network Access
   - Add IP Address
   - Allow access from anywhere: `0.0.0.0/0` (or specific IPs)

4. **Get Connection String**:
   - Go to Database → Connect
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with actual password

---

## Payment Configuration

### Stripe Setup

#### 1. Create Stripe Account
Sign up at https://stripe.com

#### 2. Get API Keys

**Test Mode** (for development):
```env
STRIPE_API_KEY=sk_test_your_test_key
```

**Live Mode** (for production):
```env
STRIPE_API_KEY=sk_live_your_live_key
```

#### 3. Configure Webhooks (Production)

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook/stripe`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Get webhook signing secret
5. Add to `.env`: `STRIPE_WEBHOOK_SECRET=whsec_...`

#### 4. Test Stripe Integration

Test card numbers:
```
# Success
4242 4242 4242 4242

# Declined
4000 0000 0000 0002

# Requires authentication
4000 0025 0000 3155
```

Expiry: Any future date  
CVV: Any 3 digits  
ZIP: Any 5 digits

---

## Security Configuration

### JWT Configuration

#### Best Practices

1. **Secret Key Length**: Minimum 32 characters
2. **Rotation**: Rotate JWT_SECRET periodically (quarterly)
3. **Storage**: Never commit to Git
4. **Expiration**: Balance security vs. user experience

#### Token Expiration Guidelines

| Use Case | Recommended Expiration |
|----------|------------------------|
| Web Application | 7 days |
| Mobile App | 30 days |
| Admin Panel | 24 hours |
| API Integration | 90 days (refresh tokens) |

### CORS Configuration

#### Development
```env
CORS_ORIGINS=http://localhost:3000
```

#### Production (Single Domain)
```env
CORS_ORIGINS=https://yourdomain.com
```

#### Production (Multiple Domains)
```env
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://admin.yourdomain.com
```

#### Allow All (Not Recommended for Production)
```env
CORS_ORIGINS=*
```

---

## Email Configuration (Future)

For email notifications (not yet implemented):

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@thelilgiftcorner.com
SMTP_FROM_NAME=The Lil Gift Corner

# Or use SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
```

---

## Deployment Configurations

### Development Environment

**Backend `.env`**:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=lilgiftcorner_dev
JWT_SECRET=dev-secret-key-not-for-production
STRIPE_API_KEY=sk_test_your_test_key
CORS_ORIGINS=http://localhost:3000
DEBUG=True
LOG_LEVEL=DEBUG
```

**Frontend `.env`**:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Staging Environment

**Backend**:
```env
MONGO_URL=mongodb+srv://user:pass@staging-cluster.mongodb.net/
DB_NAME=lilgiftcorner_staging
JWT_SECRET=staging-secret-32-chars-minimum-length
STRIPE_API_KEY=sk_test_your_test_key
CORS_ORIGINS=https://staging.yourdomain.com
DEBUG=False
LOG_LEVEL=INFO
```

**Frontend**:
```env
REACT_APP_BACKEND_URL=https://staging-api.yourdomain.com
```

### Production Environment

**Backend**:
```env
MONGO_URL=mongodb+srv://user:pass@prod-cluster.mongodb.net/
DB_NAME=lilgiftcorner_prod
JWT_SECRET=production-super-secret-min-32-chars
STRIPE_API_KEY=sk_live_your_live_key
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
DEBUG=False
LOG_LEVEL=WARNING
ADMIN_PASSWORD=SecureProductionPassword123!
```

**Frontend**:
```env
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

---

## Configuration Best Practices

### Security

1. ✅ **Never commit `.env` files** to version control
2. ✅ **Use `.env.example`** as template (with dummy values)
3. ✅ **Rotate secrets** regularly (JWT_SECRET, API keys)
4. ✅ **Use different values** for dev, staging, production
5. ✅ **Store production secrets** in secure vaults (AWS Secrets Manager, etc.)
6. ✅ **Limit CORS origins** in production
7. ✅ **Use HTTPS** in production
8. ✅ **Enable rate limiting** in production

### Development

1. ✅ **Use test/sandbox modes** for third-party services
2. ✅ **Enable debug mode** for detailed error messages
3. ✅ **Use local databases** when possible
4. ✅ **Document all variables** in README or this guide
5. ✅ **Provide `.env.example`** files

### Deployment

1. ✅ **Set environment variables** in hosting platform
2. ✅ **Don't rely on `.env` files** in production
3. ✅ **Use platform-specific configuration** (Vercel, Render, etc.)
4. ✅ **Validate configuration** before deployment
5. ✅ **Monitor configuration changes**

### Validation Checklist

Before deploying, verify:

- [ ] All required variables are set
- [ ] JWT_SECRET is 32+ characters
- [ ] CORS_ORIGINS includes your domain
- [ ] STRIPE_API_KEY is correct for environment
- [ ] ADMIN_PASSWORD is changed from default
- [ ] MONGO_URL points to correct database
- [ ] DEBUG is False in production
- [ ] LOG_LEVEL is appropriate (WARNING/ERROR for prod)

---

## Troubleshooting

### Common Issues

#### Issue: "Environment variable not found"

**Solution**:
```bash
# Verify .env file exists
ls -la backend/.env
ls -la frontend/.env

# Check file contents
cat backend/.env

# Restart application after changes
```

#### Issue: "CORS error"

**Solution**:
```env
# Ensure CORS_ORIGINS includes frontend URL
CORS_ORIGINS=http://localhost:3000

# For multiple origins
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

#### Issue: "MongoDB connection failed"

**Solution**:
```bash
# Test connection string
mongosh "mongodb://localhost:27017"

# For Atlas, check:
# 1. IP whitelist includes your IP
# 2. Password is correct (no special chars need escaping)
# 3. Connection string format is correct
```

#### Issue: "Stripe payments not working"

**Solution**:
```bash
# Verify Stripe key format
# Test mode: sk_test_...
# Live mode: sk_live_...

# Check Stripe dashboard for errors
# Ensure webhook endpoint is configured (production)
```

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Next Review**: March 2025

---

[← Installation Guide](INSTALLATION_GUIDE.md) | [Database Schema →](DATABASE_SCHEMA.md)
