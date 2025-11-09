# API Documentation - The Lil Gift Corner

Complete REST API reference for The Lil Gift Corner eCommerce platform.

**Base URL**: `http://localhost:8001/api`

**Interactive Docs**: Visit `/docs` endpoint for Swagger UI

---

## Authentication

Most endpoints require JWT authentication. Include token in headers:

```
Authorization: Bearer <your_jwt_token>
```

---

## Auth Endpoints

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

**Response (200)**:
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

## Product Endpoints

### GET /api/products
Get all products, optionally filtered by category.

**Query Parameters**:
- `category` (optional): Filter by category name

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
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

### GET /api/products/{product_id}
Get a single product by ID.

**Response (200)**: Single product object

### GET /api/categories
Get all product categories.

**Response (200)**:
```json
{
  "categories": ["Gift Boxes", "Wedding Gifts", "Hampers"]
}
```

---

## Cart Endpoints

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

### DELETE /api/cart/{cart_item_id}
Remove item from cart.

**Response (200)**:
```json
{
  "message": "Item removed from cart"
}
```

### DELETE /api/cart/session/{session_id}
Clear entire cart for session.

---

## Order Endpoints

### POST /api/orders
Create a new order.

**Request Body**:
```json
{
  "session_id": "session-uuid",
  "items": [
    {
      "product_id": "product-uuid",
      "name": "Product Name",
      "price": 2499.00,
      "quantity": 1
    }
  ],
  "total_amount": 2499.00,
  "customer_email": "john@example.com",
  "customer_name": "John Doe"
}
```

**Response (200)**: Order object

### GET /api/orders/{order_id}
Get order by ID.

---

## Checkout Endpoints

### POST /api/checkout/session
Create Stripe checkout session.

**Request Body**:
```json
{
  "session_id": "cart-session-uuid",
  "origin_url": "http://localhost:3000"
}
```

**Response (200)**:
```json
{
  "url": "https://checkout.stripe.com/...",
  "session_id": "stripe-session-id"
}
```

### GET /api/checkout/status/{checkout_session_id}
Get payment status.

**Response (200)**:
```json
{
  "status": "complete",
  "payment_status": "paid",
  "order_id": "order-uuid"
}
```

---

## Custom Gift & Contact

### POST /api/custom-gifts
Submit custom gift request.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "occasion": "Wedding",
  "description": "Need 50 favor boxes...",
  "budget": "₹50,000"
}
```

### POST /api/contact
Submit contact form.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I have a question about..."
}
```

---

## Admin Endpoints

**All admin endpoints require admin role and Bearer token**.

### GET /api/admin/dashboard
Get dashboard statistics.

**Response (200)**:
```json
{
  "total_products": 8,
  "total_orders": 15,
  "total_users": 42,
  "total_sales": 125000.00
}
```

### GET /api/admin/products
Get all products (admin view).

### POST /api/admin/products
Create new product.

**Request Body**:
```json
{
  "name": "New Product",
  "price": 1999.00,
  "category": "Gift Boxes",
  "images": ["https://..."],
  "description": "Beautiful handcrafted...",
  "tags": ["new", "trending"]
}
```

### PUT /api/admin/products/{product_id}
Update product.

### DELETE /api/admin/products/{product_id}
Delete product.

### GET /api/admin/orders
Get all orders.

### PUT /api/admin/orders/{order_id}/status
Update order status.

**Request Body**:
```json
{
  "status": "completed"
}
```

### GET /api/admin/users
Get all users.

### DELETE /api/admin/users/{user_id}
Delete user.

### GET /api/admin/custom-gifts
Get all custom gift requests.

### PUT /api/admin/custom-gifts/{gift_id}/status
Update request status.

### GET /api/admin/contacts
Get all contact messages.

### PUT /api/admin/contacts/{contact_id}/status
Mark message as responded.

---

## Error Responses

All endpoints return standard error format:

```json
{
  "detail": "Error message here"
}
```

**Common Status Codes**:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (Admin only)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

No rate limiting currently implemented. Consider adding for production.

---

## Webhook

### POST /api/webhook/stripe
Stripe webhook for payment events (handled automatically).

---

For interactive testing, visit: **http://localhost:8001/docs**
