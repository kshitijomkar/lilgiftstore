# 🎁 The Lil Gift Corner - Next.js 15 Full-Stack E-Commerce

A complete, production-ready e-commerce platform for handcrafted gifts, wedding favors, and personalized hampers. Fully migrated from React + FastAPI to **Next.js 15** with real MongoDB integration, JWT authentication, and Stripe payments.

**Status**: ✅ **PRODUCTION READY**  
**Version**: 3.0.0  
**Last Updated**: November 22, 2025

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB database (MongoDB Atlas free tier recommended)

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server (runs on http://localhost:5000)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Setup

Create `.env.local` with:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lilgiftcorner_db
JWT_SECRET=your-secret-key-change-in-production
NEXT_PUBLIC_DOMAIN=http://localhost:5000
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
```

---

## ✨ Key Features

- ✅ **20 Pages** - Home, Shop, Product Details, Cart, Checkout, Profile, Admin Dashboard, and more
- ✅ **62 API Endpoints** - Complete REST API with authentication, products, orders, payments
- ✅ **Real MongoDB** - 14 collections with proper relationships and indexing
- ✅ **JWT Authentication** - Secure user login with bcryptjs password hashing
- ✅ **Shopping Features** - Cart, wishlist, reviews, coupons, order tracking
- ✅ **Admin Dashboard** - Product, order, user management with analytics
- ✅ **Responsive Design** - Mobile, tablet, desktop optimized
- ✅ **Zero Console Errors** - No hydration mismatches or warnings

---

## 📚 Documentation

**For complete documentation, see `replit.md`** which includes:
- Full project overview and statistics
- Complete list of all 20 pages
- All 62 API endpoints with descriptions
- Database schema and collections
- Technology stack details
- Deployment instructions
- Development workflow
- Security features

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15.1.5, React 19, TypeScript, TailwindCSS 3.4.17 |
| **Backend** | Next.js API Routes, MongoDB 6.12.0, JWT, bcryptjs |
| **Database** | MongoDB 6.12.0 (14 collections) |
| **Validation** | Zod 3.24.1 |
| **UI Components** | Radix UI (46) |
| **Animations** | Framer Motion 12.23.24 |

---

## 📁 Project Structure

```
nextjs-app/
├── src/
│   ├── app/              # 20 pages + 62 API routes
│   ├── components/       # 64+ React components
│   ├── lib/              # Utilities & services
│   ├── types/            # TypeScript definitions
│   └── styles/           # Global CSS
├── public/               # Static assets
└── [config files]
```

See `replit.md` for detailed file structure and organization.

---

## 🚀 Deployment

Ready to deploy to:
- **Vercel** (recommended)
- AWS, Google Cloud, Netlify, Railway, or any Node.js hosting

---

## 📝 License

This project is proprietary. All rights reserved.

---

**Need help?** Check `replit.md` for comprehensive documentation.
