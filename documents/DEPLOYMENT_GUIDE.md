# Deployment Guide - The Lil Gift Corner

**Version**: 1.0  
**Last Updated**: January 2025

---

## Overview

This guide covers deploying The Lil Gift Corner to production.

### Recommended Architecture

- **Frontend**: Vercel (or Netlify)
- **Backend**: Render (or Railway/Heroku)
- **Database**: MongoDB Atlas

---

## Pre-Deployment Checklist

- [ ] Test application locally
- [ ] Create MongoDB Atlas account
- [ ] Get Stripe production keys
- [ ] Prepare environment variables
- [ ] Change default admin password
- [ ] Review security settings

---

## Deploy MongoDB Atlas

1. Sign up at mongodb.com/cloud/atlas
2. Create cluster (free M0 tier available)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 or specific IPs)
5. Get connection string
6. Save for backend deployment

---

## Deploy Backend (Render)

1. Create Render account
2. New \u2192 Web Service
3. Connect GitHub repository
4. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (see Configuration Guide)
6. Deploy

---

## Deploy Frontend (Vercel)

1. Create Vercel account
2. Import GitHub repository
3. Configure:
   - **Framework**: Create React App
   - **Build Command**: `yarn build`
   - **Output Directory**: `build`
4. Add environment variable: `REACT_APP_BACKEND_URL`
5. Deploy

---

## Custom Domain

1. Purchase domain
2. Configure DNS in Vercel/Render
3. Enable SSL (automatic)

---

## Post-Deployment

1. Test all features
2. Monitor logs
3. Set up error tracking (Sentry)
4. Configure analytics (Google Analytics)

---

[\u2190 Testing Guide](TESTING_GUIDE.md) | [Maintenance Guide \u2192](MAINTENANCE_GUIDE.md)
