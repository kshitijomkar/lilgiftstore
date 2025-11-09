# Database Schema - The Lil Gift Corner

**Document Version**: 1.0  
**Project Version**: 2.0.0  
**Database**: MongoDB  
**Last Updated**: January 2025

---

## Overview

The Lil Gift Corner uses **MongoDB**, a NoSQL document-oriented database. The schema is flexible yet structured using Pydantic models for validation.

### Database Information
- **Type**: MongoDB (NoSQL)
- **Driver**: Motor (Async Python driver)
- **Collections**: 10 total (7 core + 3 feature collections)
- **Indexes**: 13 optimized indexes
- **ID Format**: UUID (string)

---

## Collections

### 1. products

**Purpose**: Store product catalog

**Schema**:
```javascript
{
  id: String (UUID),
  name: String,
  price: Number,
  category: String,
  images: [String],
  description: String,
  tags: [String],
  in_stock: Boolean,
  stock_quantity: Number,
  low_stock_threshold: Number,
  average_rating: Number,
  total_reviews: Number,
  created_at: DateTime
}
```

**Indexes**:
- `category` (ascending)
- `tags` (ascending)
- `name, description` (text index)
- `price` (ascending)
- `created_at` (descending)
- `stock_quantity` (ascending)

**Example Document**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Pink Blossom Gift Box",
  "price": 2499.00,
  "category": "Gift Boxes",
  "images": ["https://example.com/image1.jpg"],
  "description": "Beautiful handcrafted pink blossom gift box",
  "tags": ["aesthetic", "cute", "wedding"],
  "in_stock": true,
  "stock_quantity": 50,
  "low_stock_threshold": 10,
  "average_rating": 4.5,
  "total_reviews": 12,
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

### 2. users

**Purpose**: Store user accounts (customers and admins)

**Schema**:
```javascript
{
  id: String (UUID),
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  role: String (customer|admin),
  created_at: DateTime
}
```

**Indexes**:
- `email` (ascending, unique)
- `role` (ascending)

**Example Document**:
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2b$12$hashedpassword...",
  "role": "customer",
  "created_at": "2025-01-05T10:30:00Z"
}
```

---

### 3. orders

**Purpose**: Store completed orders

**Schema**:
```javascript
{
  id: String (UUID),
  session_id: String,
  items: [
    {
      product_id: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  total_amount: Number,
  customer_email: String,
  customer_name: String,
  status: String (pending|processing|completed|cancelled),
  payment_status: String,
  created_at: DateTime,
  updated_at: DateTime
}
```

**Indexes**:
- `session_id` (ascending)
- `customer_email` (ascending)
- `status` (ascending)
- `created_at` (descending)

---

### 4. cart

**Purpose**: Store shopping cart items (session-based)

**Schema**:
```javascript
{
  id: String (UUID),
  product_id: String,
  quantity: Number,
  session_id: String,
  created_at: DateTime
}
```

**Indexes**:
- `session_id` (ascending)
- `product_id` (ascending)

---

### 5. payment_transactions

**Purpose**: Store Stripe payment records

**Schema**:
```javascript
{
  id: String (UUID),
  checkout_session_id: String,
  amount: Number,
  currency: String,
  metadata: Object,
  payment_status: String,
  status: String,
  order_id: String,
  created_at: DateTime,
  updated_at: DateTime
}
```

**Indexes**:
- `checkout_session_id` (ascending, unique)
- `order_id` (ascending)

---

### 6. custom_gifts

**Purpose**: Store custom gift requests

**Schema**:
```javascript
{
  id: String (UUID),
  name: String,
  email: String,
  phone: String,
  occasion: String,
  description: String,
  budget: String,
  status: String (pending|responded),
  created_at: DateTime
}
```

**Indexes**:
- `status` (ascending)
- `created_at` (descending)

---

### 7. contacts

**Purpose**: Store contact form submissions

**Schema**:
```javascript
{
  id: String (UUID),
  name: String,
  email: String,
  message: String,
  status: String (pending|responded),
  created_at: DateTime
}
```

**Indexes**:
- `status` (ascending)
- `created_at` (descending)

---

## Collection Categories

### Core Collections (7)
These collections are essential for the platform's basic e-commerce functionality:
1. **products** - Product catalog
2. **users** - User accounts
3. **orders** - Order history
4. **cart** - Shopping cart
5. **payment_transactions** - Payment records
6. **custom_gifts** - Custom gift requests
7. **contacts** - Contact form submissions

### Feature Collections (3)
These collections support optional features (reviews, wishlist, coupons):
8. **reviews** - Product reviews and ratings
9. **wishlist** - User wishlists
10. **coupons** - Discount coupons

---

### 8. reviews (Feature Collection)

**Purpose**: Store product reviews and ratings

**Schema**:
```javascript
{
  id: String (UUID),
  product_id: String,
  user_id: String,
  rating: Number (1-5),
  comment: String,
  created_at: DateTime
}
```

---

### 9. wishlist (Feature Collection)

**Purpose**: Store user wishlist items

**Schema**:
```javascript
{
  id: String (UUID),
  user_id: String,
  product_id: String,
  created_at: DateTime
}
```

---

### 10. coupons (Feature Collection)

**Purpose**: Store discount coupons

**Schema**:
```javascript
{
  id: String (UUID),
  code: String (unique),
  discount_type: String (percentage|fixed),
  discount_value: Number,
  min_purchase: Number,
  max_discount: Number,
  valid_from: DateTime,
  valid_until: DateTime,
  usage_limit: Number,
  times_used: Number,
  active: Boolean,
  created_at: DateTime
}
```

---

## Relationships

```
users (1) \u2500\u2500\u2500> (N) orders
products (1) \u2500\u2500\u2500> (N) cart
products (1) \u2500\u2500\u2500> (N) order.items
products (1) \u2500\u2500\u2500> (N) reviews
products (1) \u2500\u2500\u2500> (N) wishlist
users (1) \u2500\u2500\u2500> (N) reviews
users (1) \u2500\u2500\u2500> (N) wishlist
orders (1) \u2500\u2500\u2500> (1) payment_transactions
```

---

## Data Types

| Type | MongoDB Type | Python Type | Example |
|------|--------------|-------------|---------|
| ID | String | str (UUID) | \"550e8400-e29b-41d4...\" |
| Text | String | str | \"Product Name\" |
| Number | Number | int/float | 2999.99 |
| Boolean | Boolean | bool | true |
| Array | Array | list | [\"tag1\", \"tag2\"] |
| Object | Object | dict | {\"key\": \"value\"} |
| DateTime | ISODate | datetime | ISODate(\"2025-01-01T00:00:00Z\") |

---

## Index Strategy

### Why Indexes?

Indexes improve query performance by 70-90% for frequently queried fields.

### Current Indexes (13 total)

1. **products.category** - Filter by category
2. **products.tags** - Filter by tags
3. **products.name + description** - Full-text search
4. **products.price** - Sort and filter by price
5. **products.created_at** - Sort by date
6. **products.stock_quantity** - Low stock alerts
7. **users.email** - Unique constraint and login
8. **users.role** - Filter by role
9. **orders.session_id** - Cart to order lookup
10. **orders.customer_email** - User's orders
11. **orders.status** - Filter by status
12. **orders.created_at** - Sort by date
13. **cart.session_id** - Get user's cart

---

## Database Operations

### Common Queries

**Find Products by Category**:
```python
products = await db.products.find({\"category\": \"Gift Boxes\"}).to_list(length=100)
```

**Search Products**:
```python
products = await db.products.find({
    \"$text\": {\"$search\": \"pink blossom\"}
}).to_list(length=20)
```

**Get User Orders**:
```python
orders = await db.orders.find({
    \"customer_email\": \"user@example.com\"
}).sort(\"created_at\", -1).to_list(length=50)
```

**Create Order**:
```python
order = {
    \"id\": str(uuid.uuid4()),
    \"session_id\": session_id,
    \"items\": cart_items,
    \"total_amount\": total,
    \"customer_email\": email,
    \"status\": \"pending\",
    \"created_at\": datetime.now(timezone.utc)
}
await db.orders.insert_one(order)
```

---

[\u2190 Configuration Guide](CONFIGURATION_GUIDE.md) | [API Reference \u2192](API_REFERENCE.md)
