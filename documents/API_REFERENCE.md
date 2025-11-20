# API Reference - The Lil Gift Corner

**Version**: 2.0.0  
**Base URL**: `http://localhost:8001` (development) | `https://api.yourdomain.com` (production)  
**API Prefix**: `/api`  
**Format**: JSON  
**Authentication**: JWT Bearer Token

---

## Overview

The Lil Gift Corner provides a comprehensive RESTful API with 40+ endpoints organized into the following categories:

- Authentication
- Products
- Cart
- Orders
- Payments
- Reviews
- Wishlist
- Coupons
- Users
- Admin
- Custom Gifts
- Contact

**Interactive Documentation**: Visit `/api/docs` for Swagger UI

---

## Authentication

### POST /api/auth/register

Register a new user account.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201)**:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbG...",
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

### POST /api/auth/login

Login with existing credentials.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200)**: Same as register

---

## Products

### GET /api/products

Get all products with optional filters.

**Query Parameters**:
- `category` (string): Filter by category
- `search` (string): Full-text search
- `min_price` (number): Minimum price
- `max_price` (number): Maximum price
- `tags` (string): Comma-separated tags
- `sort_by` (string): Field to sort by (default: created_at)
- `order` (string): Sort order (asc/desc)
- `limit` (integer): Max results (default: 100)
- `skip` (integer): Skip results (pagination)

**Response (200)**:
```json
[
  {
    "id": "product-uuid",
    "name": "Pink Blossom Gift Box",
    "price": 2499.00,
    "category": "Gift Boxes",
    "images": ["https://..."],
    "description": "Handcrafted pink blossom box...",
    "tags": ["aesthetic", "cute"],
    "in_stock": true,
    "stock_quantity": 50,
    "average_rating": 4.5,
    "total_reviews": 12,
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

---

### GET /api/products/{product_id}

Get a single product by ID.

**Response (200)**: Single product object

---

### GET /api/categories

Get all product categories.

**Response (200)**:
```json
{
  "categories": ["Gift Boxes", "Wedding Favors", "Hampers"]
}
```

---

## Cart

### POST /api/cart

Add item to cart.

**Request Body**:
```json
{
  "product_id": "product-uuid",
  "quantity": 2,
  "session_id": "session-uuid"
}
```

**Response (200)**: Cart item object

---

### GET /api/cart/{session_id}

Get cart items for a session.

**Response (200)**:
```json
{
  "items": [
    {
      "cart_item_id": "cart-uuid",
      "product": { /* product object */ },
      "quantity": 2
    }
  ]
}
```

---

## Admin Endpoints

All admin endpoints require JWT token with role="admin".

### GET /api/admin/dashboard

Get dashboard statistics.

**Headers**: `Authorization: Bearer <token>`

**Response (200)**:
```json
{
  "total_products": 25,
  "total_orders": 150,
  "total_users": 320,
  "total_sales": 458900.00,
  "recent_orders": [...]
}
```

---

For complete API documentation with all endpoints, visit `/api/docs` when the server is running.

---

[\u2190 Database Schema](DATABASE_SCHEMA.md) | [Developer Guide \u2192](DEVELOPER_GUIDE.md)
