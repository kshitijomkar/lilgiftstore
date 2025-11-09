# 📊 Monitoring & Observability Setup Guide
## The Lil Gift Corner - Production Monitoring

**Last Updated**: November 9, 2025  
**Version**: 3.0.0  
**Purpose**: Ensure 99.9% uptime and rapid error detection

---

## 🎯 Monitoring Strategy

### Three Pillars of Observability

1. **Uptime Monitoring** - Is the application accessible?
2. **Error Tracking** - What's breaking and why?
3. **Performance Metrics** - How fast and efficient is it?

---

## 🚨 Uptime Monitoring - UptimeRobot (Free)

### Setup Instructions

1. **Create Account**: https://uptimerobot.com/signUp
2. **Add Monitors**:

#### Frontend Monitor
```
Monitor Type: HTTP(S)
Friendly Name: Lil Gift Corner - Frontend
URL: https://your-app.vercel.app
Monitoring Interval: 5 minutes
Monitor Timeout: 30 seconds
Expected Status Code: 200
```

#### Backend API Monitor
```
Monitor Type: HTTP(S)
Friendly Name: Lil Gift Corner - Backend API
URL: https://lil-gift-corner-api.onrender.com/api/health
Monitoring Interval: 5 minutes
Monitor Timeout: 30 seconds
Keyword Check: "healthy"
```

#### Database Health Monitor
```
Monitor Type: HTTP(S)
Friendly Name: Lil Gift Corner - DB Health
URL: https://lil-gift-corner-api.onrender.com/api/admin/dashboard
Monitoring Interval: 10 minutes
HTTP Method: GET
Headers: Authorization: Bearer [admin-token]
Expected Status Code: 200 or 403 (if not authenticated)
```

### Alert Configuration

1. **Alert Contacts**:
   ```
   Email: admin@thelilgiftcorner.com
   SMS: +91-XXXXXXXXXX (if available)
   Webhook: https://hooks.slack.com/services/xxx (Slack integration)
   ```

2. **Alert Rules**:
   - Send alert when monitor goes DOWN
   - Send alert after 2 consecutive failures (2 x 5 min = 10 min downtime)
   - Send recovery notification when UP again

3. **Maintenance Windows**:
   - Schedule: Sundays 2:00 AM - 4:00 AM UTC
   - Purpose: Database maintenance, updates
   - Action: Temporarily pause alerts

### Dashboard Access

**Public Status Page**: https://stats.uptimerobot.com/your-page

Features:
- ✅ Real-time uptime status
- ✅ 30/60/90 day uptime percentage
- ✅ Response time graphs
- ✅ Incident history

---

## 🐛 Error Tracking - Sentry (Free Tier)

### Setup Instructions

1. **Create Account**: https://sentry.io/signup
2. **Create Organization**: "The Lil Gift Corner"
3. **Create Project**: Select platform

---

### Frontend Integration (React)

#### Install Sentry SDK

```bash
cd frontend
yarn add @sentry/react
```

#### Configure Sentry

Update `src/index.js`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from "@sentry/react";
import App from './App';
import './index.css';

// Initialize Sentry
Sentry.init({
  dsn: "https://your-sentry-dsn@o123456.ingest.sentry.io/123456",
  environment: process.env.NODE_ENV || "development",
  
  // Performance Monitoring
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  tracesSampleRate: 1.0,
  
  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Filter out sensitive data
  beforeSend(event) {
    // Don't send password or token fields
    if (event.request) {
      delete event.request.headers?.['Authorization'];
    }
    return event;
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### Test Sentry Integration

Add test error button (remove after testing):

```javascript
<button onClick={() => {
  throw new Error("Test Sentry Integration");
}}>
  Test Error
</button>
```

---

### Backend Integration (FastAPI)

#### Install Sentry SDK

```bash
cd backend
pip install sentry-sdk[fastapi]
```

Update `requirements.txt`:
```
sentry-sdk[fastapi]==1.40.0
```

#### Configure Sentry

Update `server.py`:

```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration
import os

# Initialize Sentry
sentry_sdk.init(
    dsn=os.environ.get("SENTRY_DSN", ""),
    environment=os.environ.get("ENVIRONMENT", "development"),
    
    # Performance monitoring
    integrations=[
        StarletteIntegration(transaction_style="url"),
        FastApiIntegration(transaction_style="url"),
    ],
    
    # Set traces_sample_rate to 1.0 to capture 100% of transactions
    traces_sample_rate=1.0,
    
    # Filter sensitive data
    before_send=lambda event, hint: filter_sensitive_data(event, hint),
)

def filter_sensitive_data(event, hint):
    # Remove sensitive headers
    if event.get('request'):
        if event['request'].get('headers'):
            event['request']['headers'].pop('Authorization', None)
            event['request']['headers'].pop('Cookie', None)
    return event

# Rest of your FastAPI code...
```

#### Add to Environment Variables (Render)

```env
SENTRY_DSN=https://your-backend-dsn@o123456.ingest.sentry.io/123456
ENVIRONMENT=production
```

---

### Sentry Dashboard Configuration

1. **Alerts**: Settings → Alerts → New Alert Rule
   ```
   Alert Name: Critical Error in Production
   Condition: Error count is more than 10 in 1 hour
   Action: Send email + Slack notification
   ```

2. **Issue Grouping**: Settings → Inbound Filters
   - Enable grouping by error message
   - Filter out known warnings

3. **Performance Thresholds**:
   ```
   Transaction Duration: > 1000ms (warning)
   Apdex Score: < 0.8 (alert)
   ```

---

## 📈 Performance Monitoring

### Vercel Analytics (Built-in)

**Access**: https://vercel.com/dashboard/analytics

**Metrics Tracked**:
- Page views
- Unique visitors
- Top pages
- Geographic distribution
- Device types (mobile/desktop)
- Core Web Vitals:
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

### Render Metrics (Built-in)

**Access**: https://dashboard.render.com/metrics

**Metrics Tracked**:
- CPU usage
- Memory usage
- Request rate
- Response time (P50, P95, P99)
- Error rate
- Bandwidth usage

### MongoDB Atlas Monitoring

**Access**: https://cloud.mongodb.com/metrics

**Metrics Tracked**:
- Connections
- Query execution time
- Operations per second
- Index usage
- Storage size
- Network traffic

---

## 📊 Custom Logging

### Backend Logging Configuration

Update `server.py` for structured logging:

```python
import logging
import json
from datetime import datetime

# Configure JSON structured logging
class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno
        }
        
        if record.exc_info:
            log_data['exception'] = self.formatException(record.exc_info)
            
        return json.dumps(log_data)

# Setup logger
logger = logging.getLogger(__name__)
handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
logger.addHandler(handler)
logger.setLevel(logging.INFO)
```

### Log Important Events

```python
# User actions
logger.info(f"User registered: {user_email}")
logger.info(f"Order created: {order_id} - Amount: {total_amount}")

# Errors
logger.error(f"Payment failed: {error_message}")
logger.critical(f"Database connection lost")

# Performance
logger.warning(f"Slow query detected: {query_time}ms")
```

---

## 🔔 Alert Channels

### Email Alerts

**Primary**: admin@thelilgiftcorner.com  
**Backup**: devops@thelilgiftcorner.com

Configure in:
- UptimeRobot
- Sentry
- Render (billing alerts)

### Slack Integration (Optional)

1. **Create Slack Workspace**: lil-gift-corner.slack.com
2. **Create Channels**:
   - `#alerts` - Critical alerts
   - `#deployments` - Deployment notifications
   - `#errors` - Error logs from Sentry

3. **Add Integrations**:
   - UptimeRobot webhook → #alerts
   - Sentry webhook → #errors
   - GitHub Actions → #deployments

---

## 🗄️ Database Monitoring

### MongoDB Atlas Alerts

**Setup**: Atlas Dashboard → Alerts

**Recommended Alerts**:

1. **High Connection Count**:
   ```
   Condition: Connections > 80% of limit
   Threshold: 400 connections (out of 500 max)
   Action: Email alert
   ```

2. **Low Storage Space**:
   ```
   Condition: Storage > 80% of limit
   Threshold: 410 MB (out of 512 MB max)
   Action: Email alert + Upgrade prompt
   ```

3. **Slow Queries**:
   ```
   Condition: Query duration > 1000ms
   Threshold: More than 10 slow queries in 5 minutes
   Action: Email alert
   ```

4. **Replication Lag**:
   ```
   Condition: Replication lag > 60 seconds
   Action: Email alert
   ```

---

## 🎯 Monitoring Checklist

### Daily Tasks
- [ ] Check UptimeRobot dashboard (< 2 min)
- [ ] Review Sentry errors (< 5 min)
- [ ] Verify no critical alerts

### Weekly Tasks
- [ ] Review performance metrics
- [ ] Check database health
- [ ] Analyze error trends
- [ ] Review API response times

### Monthly Tasks
- [ ] Uptime report analysis (target: > 99.5%)
- [ ] Performance optimization review
- [ ] Database index optimization
- [ ] Update monitoring thresholds
- [ ] Test alert channels

---

## 📈 Success Metrics Dashboard

| Metric | Target | Current | Trend |
|--------|--------|---------|-------|
| Uptime % | > 99.5% | ⏳ | - |
| Avg Response Time | < 150ms | ⏳ | - |
| Error Rate | < 1% | ⏳ | - |
| Page Load Time | < 3s | ⏳ | - |
| Database Queries | < 100ms | ⏳ | - |

---

## 🚨 Incident Response

### Alert Severity Levels

**P0 - Critical (Immediate response)**
- Complete service outage
- Database connection lost
- Payment processing down
- Response: < 15 minutes

**P1 - High (Urgent)**
- Partial service degradation
- High error rate (> 5%)
- Slow response times (> 5s)
- Response: < 1 hour

**P2 - Medium**
- Individual feature broken
- Moderate error rate (1-5%)
- Response: < 4 hours

**P3 - Low**
- Minor bugs
- Low error rate (< 1%)
- Response: Next business day

### Incident Response Process

1. **Detection** → Alert received
2. **Assessment** → Check logs, metrics
3. **Notification** → Alert team
4. **Resolution** → Fix and deploy
5. **Verification** → Test and monitor
6. **Post-mortem** → Document and improve

---

## 🔧 Monitoring Tools Summary

| Tool | Purpose | Cost | Setup Time |
|------|---------|------|------------|
| UptimeRobot | Uptime monitoring | Free | 5 min |
| Sentry | Error tracking | Free | 15 min |
| Vercel Analytics | Frontend performance | Free | Built-in |
| Render Metrics | Backend performance | Free | Built-in |
| MongoDB Atlas | Database monitoring | Free | Built-in |

**Total Setup Time**: ~30 minutes  
**Total Cost**: $0/month (Free tier)

---

## 🎉 Monitoring Setup Complete!

Your production application now has comprehensive monitoring covering:
- ✅ Uptime tracking
- ✅ Error monitoring
- ✅ Performance metrics
- ✅ Database health
- ✅ Alert notifications

**Next Steps**:
1. ✅ Test all alert channels
2. ✅ Monitor for first 24-48 hours closely
3. ✅ Adjust thresholds based on real data
4. ✅ Create weekly monitoring routine

---

**Setup Date**: [To be filled]  
**Configured By**: DevOps Team  
**Status**: 🚀 **ACTIVE**
