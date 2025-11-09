from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
import jwt
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Stripe setup
stripe_api_key = os.environ.get('STRIPE_API_KEY', 'your_stripe_key')

# JWT & Password
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Create the main app with Swagger UI
app = FastAPI(
    title="The Lil Gift Corner API",
    description="Complete eCommerce API for handcrafted gifts and wedding favors",
    version="2.0.0",
    docs_url="/api/docs",  # Swagger UI
    redoc_url="/api/redoc",  # ReDoc
    openapi_url="/api/openapi.json"
)
api_router = APIRouter(prefix="/api")

# Models
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: float
    category: str
    images: List[str]
    description: str
    tags: List[str] = []
    in_stock: bool = True
    stock_quantity: int = 100
    low_stock_threshold: int = 10
    average_rating: float = 0.0
    total_reviews: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    price: float
    category: str
    images: List[str]
    description: str
    tags: List[str] = []

class CartItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    quantity: int
    session_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CartItemCreate(BaseModel):
    product_id: str
    quantity: int
    session_id: str

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    items: List[Dict]
    total_amount: float
    customer_email: Optional[str] = None
    customer_name: Optional[str] = None
    user_id: Optional[str] = None
    payment_method: str = "stripe"
    address: Optional[Dict] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    session_id: str
    items: List[Dict]
    total_amount: float
    customer_email: Optional[str] = None
    customer_name: Optional[str] = None
    payment_method: str = "stripe"  # stripe or cod
    address: Optional[Dict] = None

class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    checkout_session_id: str
    amount: float
    currency: str
    metadata: Dict
    payment_status: str = "pending"
    status: str = "initiated"
    order_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CustomGiftRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    occasion: str
    description: str
    budget: Optional[str] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CustomGiftCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    occasion: str
    description: str
    budget: Optional[str] = None

class ContactRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactCreate(BaseModel):
    name: str
    email: str
    message: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    password: str
    role: str = "customer"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class OrderStatusUpdate(BaseModel):
    status: str

class Address(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    full_name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    is_default: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AddressCreate(BaseModel):
    full_name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    is_default: bool = False

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None


# ============ QUICK WINS FEATURE MODELS ============

# 1. Reviews & Ratings Models
class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    user_id: str
    user_name: str
    rating: int  # 1-5
    title: str
    review_text: str
    verified_purchase: bool = False
    helpful_count: int = 0
    status: str = "approved"  # approved, pending, rejected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewCreate(BaseModel):
    product_id: str
    rating: int
    title: str
    review_text: str

# 2. Wishlist Models
class WishlistItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    product_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# 3. Coupon Models
class Coupon(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str  # e.g., "SAVE20", "FIRSTORDER"
    type: str  # percentage, fixed, free_shipping
    value: float  # 20 for 20% off, 100 for ₹100 off
    min_order_value: float = 0
    max_discount: Optional[float] = None  # Max discount cap
    usage_limit: Optional[int] = None  # Total uses allowed
    usage_count: int = 0
    user_usage_limit: int = 1  # Per user
    valid_from: datetime
    valid_until: datetime
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CouponCreate(BaseModel):
    code: str
    type: str
    value: float
    min_order_value: float = 0
    max_discount: Optional[float] = None
    usage_limit: Optional[int] = None
    user_usage_limit: int = 1
    valid_from: datetime
    valid_until: datetime

class CouponUsage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    coupon_id: str
    user_id: str
    order_id: str
    discount_amount: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CouponValidate(BaseModel):
    code: str
    order_value: float

# 4. Search Log Model (for trending searches)
class SearchLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    query: str
    user_id: Optional[str] = None
    results_count: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# 5. Order Status Timeline Model
class OrderStatusHistory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_id: str
    status: str
    note: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Auth functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

async def require_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# Auth Routes
@api_router.post("/auth/login")
async def login(request: LoginRequest):
    user = await db.users.find_one({"email": request.email}, {"_id": 0})
    if not user or not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token({"user_id": user["id"], "email": user["email"], "role": user["role"]})
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        name=user_data.name,
        email=user_data.email,
        password=get_password_hash(user_data.password),
        role="customer"
    )
    
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.users.insert_one(doc)
    
    token = create_access_token({"user_id": user.id, "email": user.email, "role": user.role})
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }

# Product Routes
@api_router.get("/products", response_model=List[Product])
async def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "created_at",
    order: Optional[str] = "desc",
    limit: Optional[int] = 100,
    skip: Optional[int] = 0,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    tags: Optional[str] = None
):
    query = {}
    
    # Category filter
    if category:
        query["category"] = category
    
    # Search filter (text search)
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}}
        ]
    
    # Price range filter
    if min_price is not None or max_price is not None:
        query["price"] = {}
        if min_price is not None:
            query["price"]["$gte"] = min_price
        if max_price is not None:
            query["price"]["$lte"] = max_price
    
    # Tags filter
    if tags:
        tag_list = [t.strip() for t in tags.split(",")]
        query["tags"] = {"$in": tag_list}
    
    # Sort options
    sort_order = -1 if order == "desc" else 1
    sort_field = sort_by if sort_by in ["price", "created_at", "name"] else "created_at"
    
    products = await db.products.find(query, {"_id": 0}).sort(sort_field, sort_order).skip(skip).limit(limit).to_list(limit)
    for product in products:
        if isinstance(product.get('created_at'), str):
            product['created_at'] = datetime.fromisoformat(product['created_at'])
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if isinstance(product.get('created_at'), str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    return product

@api_router.get("/categories")
async def get_categories():
    products = await db.products.find({}, {"_id": 0, "category": 1}).to_list(1000)
    categories = list(set([p["category"] for p in products if "category" in p]))
    return {"categories": categories}

# Cart Routes
@api_router.post("/cart", response_model=CartItem)
async def add_to_cart(item: CartItemCreate):
    product = await db.products.find_one({"id": item.product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    existing = await db.cart.find_one({"product_id": item.product_id, "session_id": item.session_id}, {"_id": 0})
    if existing:
        new_quantity = existing["quantity"] + item.quantity
        await db.cart.update_one(
            {"product_id": item.product_id, "session_id": item.session_id},
            {"$set": {"quantity": new_quantity}}
        )
        existing["quantity"] = new_quantity
        if isinstance(existing.get('created_at'), str):
            existing['created_at'] = datetime.fromisoformat(existing['created_at'])
        return CartItem(**existing)
    
    cart_obj = CartItem(**item.model_dump())
    doc = cart_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.cart.insert_one(doc)
    return cart_obj

@api_router.get("/cart/{session_id}")
async def get_cart(session_id: str):
    cart_items = await db.cart.find({"session_id": session_id}, {"_id": 0}).to_list(1000)
    
    enriched_items = []
    for item in cart_items:
        product = await db.products.find_one({"id": item["product_id"]}, {"_id": 0})
        if product:
            enriched_items.append({
                "cart_item_id": item["id"],
                "product": product,
                "quantity": item["quantity"]
            })
    
    return {"items": enriched_items}

@api_router.delete("/cart/{cart_item_id}")
async def remove_from_cart(cart_item_id: str):
    result = await db.cart.delete_one({"id": cart_item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Item removed from cart"}

@api_router.delete("/cart/session/{session_id}")
async def clear_cart(session_id: str):
    await db.cart.delete_many({"session_id": session_id})
    return {"message": "Cart cleared"}

# Order Routes
@api_router.post("/orders", response_model=Order)
async def create_order(order: OrderCreate, credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))):
    # Get user_id if authenticated
    user_id = None
    if credentials:
        try:
            token = credentials.credentials
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user_id = payload.get("user_id")
        except:
            pass  # If token invalid, continue without user_id
    
    order_data = order.model_dump()
    order_data['user_id'] = user_id
    order_obj = Order(**order_data)
    doc = order_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.orders.insert_one(doc)
    return order_obj

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if isinstance(order.get('created_at'), str):
        order['created_at'] = datetime.fromisoformat(order['created_at'])
    return order

# Stripe Payment Routes
@api_router.post("/checkout/session")
async def create_checkout_session(request: Request):
    body = await request.json()
    
    session_id = body.get("session_id")
    origin_url = body.get("origin_url")
    
    if not session_id or not origin_url:
        raise HTTPException(status_code=400, detail="session_id and origin_url are required")
    
    cart_items = await db.cart.find({"session_id": session_id}, {"_id": 0}).to_list(1000)
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Calculate total from backend (in INR)
    total_amount = 0.0
    for item in cart_items:
        product = await db.products.find_one({"id": item["product_id"]}, {"_id": 0})
        if product:
            total_amount += product["price"] * item["quantity"]
    
    # Convert INR to USD for Stripe (approximate: 1 USD = 83 INR)
    total_amount_usd = round(total_amount / 83.0, 2)
    
    host_url = origin_url
    success_url = f"{host_url}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{host_url}/checkout/cancel"
    
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    checkout_request = CheckoutSessionRequest(
        amount=total_amount_usd,
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={"session_id": session_id, "amount_inr": str(total_amount)}
    )
    
    checkout_response = await stripe_checkout.create_checkout_session(checkout_request)
    
    payment_transaction = PaymentTransaction(
        checkout_session_id=checkout_response.session_id,
        amount=total_amount,
        currency="inr",
        metadata={"session_id": session_id},
        payment_status="pending",
        status="initiated"
    )
    
    doc = payment_transaction.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.payment_transactions.insert_one(doc)
    
    return {"url": checkout_response.url, "session_id": checkout_response.session_id}

@api_router.get("/checkout/status/{checkout_session_id}")
async def get_checkout_status(checkout_session_id: str):
    transaction = await db.payment_transactions.find_one(
        {"checkout_session_id": checkout_session_id},
        {"_id": 0}
    )
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if transaction.get("payment_status") == "paid":
        return {
            "status": transaction.get("status"),
            "payment_status": transaction.get("payment_status"),
            "order_id": transaction.get("order_id")
        }
    
    webhook_url = f"{os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    try:
        checkout_status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(checkout_session_id)
        
        update_data = {
            "status": checkout_status.status,
            "payment_status": checkout_status.payment_status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        if checkout_status.payment_status == "paid" and transaction.get("payment_status") != "paid":
            session_id = transaction["metadata"]["session_id"]
            
            cart_items = await db.cart.find({"session_id": session_id}, {"_id": 0}).to_list(1000)
            order_items = []
            
            for item in cart_items:
                product = await db.products.find_one({"id": item["product_id"]}, {"_id": 0})
                if product:
                    order_items.append({
                        "product_id": product["id"],
                        "name": product["name"],
                        "price": product["price"],
                        "quantity": item["quantity"]
                    })
            
            order = Order(
                session_id=session_id,
                items=order_items,
                total_amount=transaction["amount"],
                status="completed"
            )
            
            order_doc = order.model_dump()
            order_doc['created_at'] = order_doc['created_at'].isoformat()
            await db.orders.insert_one(order_doc)
            
            update_data["order_id"] = order.id
            
            await db.cart.delete_many({"session_id": session_id})
        
        await db.payment_transactions.update_one(
            {"checkout_session_id": checkout_session_id},
            {"$set": update_data}
        )
        
        return {
            "status": checkout_status.status,
            "payment_status": checkout_status.payment_status,
            "order_id": update_data.get("order_id")
        }
    except Exception as e:
        logging.error(f"Error checking payment status: {str(e)}")
        raise HTTPException(status_code=500, detail="Error checking payment status")

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    webhook_url = f"{os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        logging.info(f"Webhook received: {webhook_response.event_type}")
        return {"status": "success"}
    except Exception as e:
        logging.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail="Webhook error")

# Custom Gift Routes
@api_router.post("/custom-gifts", response_model=CustomGiftRequest)
async def submit_custom_gift(request: CustomGiftCreate):
    gift_obj = CustomGiftRequest(**request.model_dump())
    doc = gift_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.custom_gifts.insert_one(doc)
    return gift_obj

# Contact Routes
@api_router.post("/contact", response_model=ContactRequest)
async def submit_contact(request: ContactCreate):
    contact_obj = ContactRequest(**request.model_dump())
    doc = contact_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contacts.insert_one(doc)
    return contact_obj

# User Profile Routes
@api_router.get("/user/profile")
async def get_user_profile(user: dict = Depends(get_current_user)):
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "phone": user.get("phone"),
        "created_at": user.get("created_at")
    }

@api_router.put("/user/profile")
async def update_user_profile(update_data: UserUpdate, user: dict = Depends(get_current_user)):
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.users.update_one(
        {"id": user["id"]},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Profile updated successfully"}

@api_router.get("/user/orders")
async def get_user_orders(user: dict = Depends(get_current_user)):
    orders = await db.orders.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    for order in orders:
        if isinstance(order.get('created_at'), str):
            order['created_at'] = datetime.fromisoformat(order['created_at'])
    
    return {"orders": orders}

# Address Management Routes
@api_router.post("/user/addresses")
async def create_address(address_data: AddressCreate, user: dict = Depends(get_current_user)):
    # If this is set as default, unset other defaults
    if address_data.is_default:
        await db.addresses.update_many(
            {"user_id": user["id"]},
            {"$set": {"is_default": False}}
        )
    
    address = Address(user_id=user["id"], **address_data.model_dump())
    doc = address.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.addresses.insert_one(doc)
    
    return address

@api_router.get("/user/addresses")
async def get_user_addresses(user: dict = Depends(get_current_user)):
    addresses = await db.addresses.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).to_list(100)
    
    for addr in addresses:
        if isinstance(addr.get('created_at'), str):
            addr['created_at'] = datetime.fromisoformat(addr['created_at'])
    
    return {"addresses": addresses}

@api_router.put("/user/addresses/{address_id}")
async def update_address(address_id: str, address_data: AddressCreate, user: dict = Depends(get_current_user)):
    # If this is set as default, unset other defaults
    if address_data.is_default:
        await db.addresses.update_many(
            {"user_id": user["id"], "id": {"$ne": address_id}},
            {"$set": {"is_default": False}}
        )
    
    result = await db.addresses.update_one(
        {"id": address_id, "user_id": user["id"]},
        {"$set": address_data.model_dump()}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Address not found")
    
    return {"message": "Address updated successfully"}

@api_router.delete("/user/addresses/{address_id}")
async def delete_address(address_id: str, user: dict = Depends(get_current_user)):
    result = await db.addresses.delete_one({"id": address_id, "user_id": user["id"]})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Address not found")
    
    return {"message": "Address deleted successfully"}

# Admin Routes
@api_router.get("/admin/dashboard")
async def admin_dashboard(admin: dict = Depends(require_admin)):
    total_products = await db.products.count_documents({})
    total_orders = await db.orders.count_documents({})
    total_users = await db.users.count_documents({})
    
    orders = await db.orders.find({}, {"_id": 0}).to_list(1000)
    total_sales = sum([o.get("total_amount", 0) for o in orders])
    
    # Recent orders
    recent_orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    
    # Orders by status
    pending_orders = await db.orders.count_documents({"status": "pending"})
    completed_orders = await db.orders.count_documents({"status": "completed"})
    
    # Sales by category
    pipeline = [
        {"$lookup": {
            "from": "products",
            "localField": "items.product_id",
            "foreignField": "id",
            "as": "product_details"
        }},
        {"$unwind": "$product_details"},
        {"$group": {
            "_id": "$product_details.category",
            "total": {"$sum": "$total_amount"},
            "count": {"$sum": 1}
        }}
    ]
    category_sales = await db.orders.aggregate(pipeline).to_list(100)
    
    # Low stock products (less than 5)
    low_stock_products = await db.products.count_documents({"in_stock": False})
    
    # Custom gifts and contacts pending
    pending_custom_gifts = await db.custom_gifts.count_documents({"status": "pending"})
    pending_contacts = await db.contacts.count_documents({"status": "pending"})
    
    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "total_users": total_users,
        "total_sales": total_sales,
        "recent_orders": recent_orders,
        "pending_orders": pending_orders,
        "completed_orders": completed_orders,
        "category_sales": category_sales,
        "low_stock_products": low_stock_products,
        "pending_custom_gifts": pending_custom_gifts,
        "pending_contacts": pending_contacts
    }

@api_router.get("/admin/products")
async def admin_get_products(admin: dict = Depends(require_admin)):
    products = await db.products.find({}, {"_id": 0}).to_list(1000)
    return {"products": products}

@api_router.post("/admin/products")
async def admin_create_product(product: ProductCreate, admin: dict = Depends(require_admin)):
    product_obj = Product(**product.model_dump())
    doc = product_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.products.insert_one(doc)
    return product_obj

@api_router.put("/admin/products/{product_id}")
async def admin_update_product(product_id: str, product: ProductCreate, admin: dict = Depends(require_admin)):
    result = await db.products.update_one(
        {"id": product_id},
        {"$set": product.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product updated"}

@api_router.delete("/admin/products/{product_id}")
async def admin_delete_product(product_id: str, admin: dict = Depends(require_admin)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}

@api_router.get("/admin/orders")
async def admin_get_orders(
    admin: dict = Depends(require_admin),
    status: Optional[str] = None,
    limit: Optional[int] = 100,
    skip: Optional[int] = 0
):
    query = {}
    if status:
        query["status"] = status
    
    orders = await db.orders.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    total_count = await db.orders.count_documents(query)
    
    return {
        "orders": orders,
        "total": total_count,
        "page": skip // limit + 1 if limit > 0 else 1,
        "per_page": limit
    }

@api_router.get("/admin/orders/{order_id}")
async def admin_get_order_details(order_id: str, admin: dict = Depends(require_admin)):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@api_router.put("/admin/orders/{order_id}/status")
async def admin_update_order_status(order_id: str, update: OrderStatusUpdate, admin: dict = Depends(require_admin)):
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": update.status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order status updated"}

@api_router.get("/admin/users")
async def admin_get_users(admin: dict = Depends(require_admin)):
    users = await db.users.find({}, {"_id": 0, "password": 0}).to_list(1000)
    return {"users": users}

@api_router.delete("/admin/users/{user_id}")
async def admin_delete_user(user_id: str, admin: dict = Depends(require_admin)):
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}

@api_router.get("/admin/custom-gifts")
async def admin_get_custom_gifts(admin: dict = Depends(require_admin)):
    gifts = await db.custom_gifts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return {"custom_gifts": gifts}

@api_router.put("/admin/custom-gifts/{gift_id}/status")
async def admin_update_gift_status(gift_id: str, update: Dict, admin: dict = Depends(require_admin)):
    result = await db.custom_gifts.update_one(
        {"id": gift_id},
        {"$set": {"status": update.get("status", "responded")}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Gift request not found")
    return {"message": "Status updated"}

@api_router.get("/admin/contacts")
async def admin_get_contacts(admin: dict = Depends(require_admin)):
    contacts = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return {"contacts": contacts}

@api_router.put("/admin/contacts/{contact_id}/status")
async def admin_update_contact_status(contact_id: str, update: Dict, admin: dict = Depends(require_admin)):
    result = await db.contacts.update_one(
        {"id": contact_id},
        {"$set": {"status": update.get("status", "responded")}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Status updated"}

@api_router.get("/admin/analytics/sales")
async def admin_sales_analytics(
    admin: dict = Depends(require_admin),
    days: Optional[int] = 30
):
    # Get sales data for last N days
    start_date = datetime.now(timezone.utc) - timedelta(days=days)
    
    pipeline = [
        {
            "$match": {
                "created_at": {"$gte": start_date.isoformat()}
            }
        },
        {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": {"$toDate": "$created_at"}
                    }
                },
                "total_sales": {"$sum": "$total_amount"},
                "order_count": {"$sum": 1}
            }
        },
        {"$sort": {"_id": 1}}
    ]
    
    try:
        sales_data = await db.orders.aggregate(pipeline).to_list(days)
    except:
        # Fallback for string dates
        orders = await db.orders.find({}, {"_id": 0, "created_at": 1, "total_amount": 1}).to_list(1000)
        sales_by_date = {}
        for order in orders:
            try:
                if isinstance(order['created_at'], str):
                    order_date = datetime.fromisoformat(order['created_at'])
                else:
                    order_date = order['created_at']
                
                if order_date >= start_date:
                    date_str = order_date.strftime("%Y-%m-%d")
                    if date_str not in sales_by_date:
                        sales_by_date[date_str] = {"total_sales": 0, "order_count": 0}
                    sales_by_date[date_str]["total_sales"] += order.get("total_amount", 0)
                    sales_by_date[date_str]["order_count"] += 1
            except:
                continue
        
        sales_data = [{"_id": date, **data} for date, data in sorted(sales_by_date.items())]
    
    return {"sales_data": sales_data, "days": days}


# ============ QUICK WINS FEATURE ENDPOINTS ============

# ====== 1. PRODUCT REVIEWS & RATINGS ======

async def update_product_rating(product_id: str):
    """Recalculate and update product average rating"""
    pipeline = [
        {"$match": {"product_id": product_id, "status": "approved"}},
        {"$group": {
            "_id": None,
            "avg_rating": {"$avg": "$rating"},
            "total_reviews": {"$sum": 1}
        }}
    ]
    result = await db.reviews.aggregate(pipeline).to_list(1)
    
    if result:
        await db.products.update_one(
            {"id": product_id},
            {"$set": {
                "average_rating": round(result[0]["avg_rating"], 1),
                "total_reviews": result[0]["total_reviews"]
            }}
        )

@api_router.post("/products/{product_id}/reviews")
async def create_review(
    product_id: str, 
    review_data: ReviewCreate,
    user: dict = Depends(get_current_user)
):
    # Check if user already reviewed
    existing = await db.reviews.find_one({
        "product_id": product_id,
        "user_id": user["id"]
    })
    if existing:
        raise HTTPException(400, "You have already reviewed this product")
    
    # Check if user purchased this product
    order = await db.orders.find_one({
        "user_id": user["id"],
        "items.product_id": product_id,
        "status": {"$in": ["completed", "delivered"]}
    })
    verified = bool(order)
    
    review = Review(
        product_id=product_id,
        user_id=user["id"],
        user_name=user["name"],
        rating=review_data.rating,
        title=review_data.title,
        review_text=review_data.review_text,
        verified_purchase=verified
    )
    
    doc = review.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.reviews.insert_one(doc)
    
    # Update product average rating
    await update_product_rating(product_id)
    
    return review

@api_router.get("/products/{product_id}/reviews")
async def get_reviews(
    product_id: str,
    sort_by: str = "recent",  # recent, helpful, rating_high, rating_low
    limit: int = 20,
    skip: int = 0
):
    sort_options = {
        "recent": [("created_at", -1)],
        "helpful": [("helpful_count", -1)],
        "rating_high": [("rating", -1)],
        "rating_low": [("rating", 1)]
    }
    
    reviews = await db.reviews.find(
        {"product_id": product_id, "status": "approved"},
        {"_id": 0}
    ).sort(sort_options.get(sort_by, [("created_at", -1)])).skip(skip).limit(limit).to_list(limit)
    
    total = await db.reviews.count_documents({
        "product_id": product_id,
        "status": "approved"
    })
    
    return {"reviews": reviews, "total": total}

@api_router.post("/reviews/{review_id}/helpful")
async def mark_helpful(review_id: str):
    result = await db.reviews.update_one(
        {"id": review_id},
        {"$inc": {"helpful_count": 1}}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Review not found")
    return {"success": True}

@api_router.delete("/reviews/{review_id}")
async def delete_review(review_id: str, user: dict = Depends(get_current_user)):
    # Check if user owns this review or is admin
    review = await db.reviews.find_one({"id": review_id})
    if not review:
        raise HTTPException(404, "Review not found")
    
    if review["user_id"] != user["id"] and user.get("role") != "admin":
        raise HTTPException(403, "Not authorized to delete this review")
    
    await db.reviews.delete_one({"id": review_id})
    
    # Update product rating
    await update_product_rating(review["product_id"])
    
    return {"message": "Review deleted"}

# Admin: Moderate reviews
@api_router.get("/admin/reviews")
async def admin_get_reviews(admin: dict = Depends(require_admin), status: Optional[str] = None):
    query = {}
    if status:
        query["status"] = status
    reviews = await db.reviews.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return {"reviews": reviews}

@api_router.put("/admin/reviews/{review_id}/status")
async def admin_update_review_status(review_id: str, update: Dict, admin: dict = Depends(require_admin)):
    result = await db.reviews.update_one(
        {"id": review_id},
        {"$set": {"status": update.get("status", "approved")}}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Review not found")
    
    # Update product rating if status changed
    review = await db.reviews.find_one({"id": review_id})
    if review:
        await update_product_rating(review["product_id"])
    
    return {"message": "Review status updated"}

# ====== 2. WISHLIST / FAVORITES ======

@api_router.post("/wishlist")
async def add_to_wishlist(
    product_id: str,
    user: dict = Depends(get_current_user)
):
    # Check if product exists
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(404, "Product not found")
    
    # Check if already in wishlist
    existing = await db.wishlist.find_one({
        "user_id": user["id"],
        "product_id": product_id
    })
    if existing:
        raise HTTPException(400, "Product already in wishlist")
    
    item = WishlistItem(
        user_id=user["id"],
        product_id=product_id
    )
    
    doc = item.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.wishlist.insert_one(doc)
    
    return {"success": True, "message": "Added to wishlist"}

@api_router.get("/wishlist")
async def get_wishlist(user: dict = Depends(get_current_user)):
    # Get wishlist items
    items = await db.wishlist.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    # Get product details
    product_ids = [item["product_id"] for item in items]
    products = await db.products.find(
        {"id": {"$in": product_ids}},
        {"_id": 0}
    ).to_list(100)
    
    # Enrich with wishlist data
    for product in products:
        wishlist_item = next((i for i in items if i["product_id"] == product["id"]), None)
        if wishlist_item:
            product["wishlist_id"] = wishlist_item["id"]
            product["added_at"] = wishlist_item["created_at"]
    
    return {"items": products, "count": len(products)}

@api_router.delete("/wishlist/{product_id}")
async def remove_from_wishlist(
    product_id: str,
    user: dict = Depends(get_current_user)
):
    result = await db.wishlist.delete_one({
        "user_id": user["id"],
        "product_id": product_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(404, "Item not found in wishlist")
    
    return {"success": True, "message": "Removed from wishlist"}

@api_router.get("/wishlist/check/{product_id}")
async def check_wishlist(product_id: str, user: dict = Depends(get_current_user)):
    item = await db.wishlist.find_one({
        "user_id": user["id"],
        "product_id": product_id
    })
    return {"in_wishlist": bool(item)}

# ====== 3. DISCOUNT COUPONS SYSTEM ======

# Admin: Create coupon
@api_router.post("/admin/coupons")
async def create_coupon(
    coupon_data: CouponCreate,
    admin: dict = Depends(require_admin)
):
    # Check if code already exists
    existing = await db.coupons.find_one({"code": coupon_data.code.upper()})
    if existing:
        raise HTTPException(400, "Coupon code already exists")
    
    coupon = Coupon(**coupon_data.model_dump())
    coupon.code = coupon.code.upper()
    
    doc = coupon.model_dump()
    doc['valid_from'] = doc['valid_from'].isoformat()
    doc['valid_until'] = doc['valid_until'].isoformat()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.coupons.insert_one(doc)
    
    return coupon

# Validate and apply coupon
@api_router.post("/coupons/validate")
async def validate_coupon(
    validate_data: CouponValidate,
    user: dict = Depends(get_current_user)
):
    coupon = await db.coupons.find_one(
        {"code": validate_data.code.upper(), "is_active": True},
        {"_id": 0}
    )
    
    if not coupon:
        raise HTTPException(404, "Invalid coupon code")
    
    # Convert datetime strings back to datetime objects for comparison
    valid_from = datetime.fromisoformat(coupon['valid_from'])
    valid_until = datetime.fromisoformat(coupon['valid_until'])
    now = datetime.now(timezone.utc)
    
    # Check validity period
    if now < valid_from:
        raise HTTPException(400, "Coupon not yet valid")
    if now > valid_until:
        raise HTTPException(400, "Coupon has expired")
    
    # Check minimum order value
    if validate_data.order_value < coupon['min_order_value']:
        raise HTTPException(
            400, 
            f"Minimum order value ₹{coupon['min_order_value']} required"
        )
    
    # Check total usage limit
    if coupon.get('usage_limit') and coupon['usage_count'] >= coupon['usage_limit']:
        raise HTTPException(400, "Coupon usage limit reached")
    
    # Check user usage limit
    user_usage = await db.coupon_usage.count_documents({
        "coupon_id": coupon['id'],
        "user_id": user["id"]
    })
    if user_usage >= coupon['user_usage_limit']:
        raise HTTPException(400, "You've already used this coupon")
    
    # Calculate discount
    discount = 0
    if coupon['type'] == 'percentage':
        discount = validate_data.order_value * (coupon['value'] / 100)
        if coupon.get('max_discount'):
            discount = min(discount, coupon['max_discount'])
    elif coupon['type'] == 'fixed':
        discount = coupon['value']
    elif coupon['type'] == 'free_shipping':
        discount = 0  # Handle in frontend
    
    return {
        "valid": True,
        "coupon": coupon,
        "discount_amount": round(discount, 2),
        "final_amount": round(validate_data.order_value - discount, 2)
    }

# Record coupon usage (call this when order is placed)
async def record_coupon_usage(coupon_id: str, user_id: str, order_id: str, discount_amount: float):
    usage = CouponUsage(
        coupon_id=coupon_id,
        user_id=user_id,
        order_id=order_id,
        discount_amount=discount_amount
    )
    
    doc = usage.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.coupon_usage.insert_one(doc)
    
    # Increment usage count
    await db.coupons.update_one(
        {"id": coupon_id},
        {"$inc": {"usage_count": 1}}
    )

# Get active coupons (public)
@api_router.get("/coupons/active")
async def get_active_coupons():
    now = datetime.now(timezone.utc).isoformat()
    coupons = await db.coupons.find(
        {
            "is_active": True,
            "valid_from": {"$lte": now},
            "valid_until": {"$gte": now}
        },
        {"_id": 0}
    ).to_list(50)
    
    # Don't expose sensitive data
    return [{
        "code": c["code"],
        "type": c["type"],
        "value": c["value"],
        "min_order_value": c["min_order_value"],
        "valid_until": c["valid_until"]
    } for c in coupons]

# Admin: List all coupons
@api_router.get("/admin/coupons")
async def list_coupons(admin: dict = Depends(require_admin)):
    coupons = await db.coupons.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return {"coupons": coupons}

@api_router.put("/admin/coupons/{coupon_id}")
async def update_coupon(coupon_id: str, update: Dict, admin: dict = Depends(require_admin)):
    # Remove None values
    update_dict = {k: v for k, v in update.items() if v is not None}
    
    result = await db.coupons.update_one(
        {"id": coupon_id},
        {"$set": update_dict}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Coupon not found")
    return {"message": "Coupon updated"}

@api_router.delete("/admin/coupons/{coupon_id}")
async def delete_coupon(coupon_id: str, admin: dict = Depends(require_admin)):
    result = await db.coupons.delete_one({"id": coupon_id})
    if result.deleted_count == 0:
        raise HTTPException(404, "Coupon not found")
    return {"message": "Coupon deleted"}

# ====== 4. ENHANCED SEARCH ======

async def log_search(query: str, results_count: int, user_id: Optional[str] = None):
    """Log search query for trending analysis"""
    log = SearchLog(
        query=query.lower(),
        results_count=results_count,
        user_id=user_id
    )
    doc = log.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.search_logs.insert_one(doc)

@api_router.get("/products/search")
async def search_products(
    q: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = "relevance",
    limit: int = 20,
    skip: int = 0
):
    query = {}
    
    # Text search
    if q:
        query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"tags": {"$regex": q, "$options": "i"}}
        ]
    
    # Filters
    if category:
        query["category"] = category
    
    if min_price is not None or max_price is not None:
        query["price"] = {}
        if min_price is not None:
            query["price"]["$gte"] = min_price
        if max_price is not None:
            query["price"]["$lte"] = max_price
    
    # Sorting
    sort_options = {
        "relevance": [("average_rating", -1), ("total_reviews", -1)],
        "price_low": [("price", 1)],
        "price_high": [("price", -1)],
        "newest": [("created_at", -1)],
        "rating": [("average_rating", -1)]
    }
    
    # Execute query
    cursor = db.products.find(query, {"_id": 0})
    
    # Apply sorting
    if sort_by in sort_options:
        for field, order in sort_options[sort_by]:
            cursor = cursor.sort(field, order)
    
    # Pagination
    products = await cursor.skip(skip).limit(limit).to_list(limit)
    
    # Get total count
    total = await db.products.count_documents(query)
    
    # Log search
    if q:
        await log_search(q, total)
    
    return {
        "products": products,
        "total": total,
        "page": skip // limit + 1 if limit > 0 else 1,
        "pages": (total + limit - 1) // limit if limit > 0 else 1
    }

@api_router.get("/products/suggestions")
async def get_search_suggestions(q: str, limit: int = 5):
    if len(q) < 2:
        return {"suggestions": []}
    
    # Find products matching query
    products = await db.products.find(
        {
            "$or": [
                {"name": {"$regex": q, "$options": "i"}},
                {"tags": {"$regex": q, "$options": "i"}}
            ]
        },
        {"_id": 0, "name": 1, "id": 1}
    ).limit(limit).to_list(limit)
    
    # Extract unique suggestions
    suggestions = list(set([p["name"] for p in products]))
    
    return {"suggestions": suggestions[:limit]}

@api_router.get("/products/trending-searches")
async def get_trending_searches(limit: int = 10):
    # Aggregate most searched terms from last 7 days
    start_date = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    
    pipeline = [
        {"$match": {"created_at": {"$gte": start_date}}},
        {"$group": {
            "_id": "$query",
            "count": {"$sum": 1}
        }},
        {"$sort": {"count": -1}},
        {"$limit": limit}
    ]
    
    results = await db.search_logs.aggregate(pipeline).to_list(limit)
    return {"trending": [{"query": r["_id"], "count": r["count"]} for r in results]}

# ====== 5. INVENTORY MANAGEMENT ======

async def decrease_stock(product_id: str, quantity: int):
    """Decrease product stock after order"""
    product = await db.products.find_one({"id": product_id})
    if not product:
        return
    
    new_quantity = max(0, product.get("stock_quantity", 100) - quantity)
    await db.products.update_one(
        {"id": product_id},
        {"$set": {"stock_quantity": new_quantity}}
    )
    
    # Check if stock is low
    if new_quantity <= product.get("low_stock_threshold", 10):
        # Log low stock alert (could send email notification)
        logger.warning(f"Low stock alert for product {product_id}: {new_quantity} remaining")

@api_router.get("/products/{product_id}/stock")
async def check_stock(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0, "stock_quantity": 1, "in_stock": 1})
    if not product:
        raise HTTPException(404, "Product not found")
    return product

# Admin: Update stock
@api_router.put("/admin/products/{product_id}/stock")
async def update_stock(
    product_id: str,
    quantity: int,
    admin: dict = Depends(require_admin)
):
    result = await db.products.update_one(
        {"id": product_id},
        {"$set": {
            "stock_quantity": quantity,
            "in_stock": quantity > 0
        }}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Product not found")
    return {"success": True, "message": "Stock updated"}

# Admin: Get low stock products
@api_router.get("/admin/inventory/low-stock")
async def get_low_stock(admin: dict = Depends(require_admin)):
    # Find products where stock_quantity <= low_stock_threshold
    pipeline = [
        {
            "$match": {
                "$expr": {
                    "$lte": ["$stock_quantity", "$low_stock_threshold"]
                }
            }
        },
        {
            "$project": {
                "_id": 0,
                "id": 1,
                "name": 1,
                "stock_quantity": 1,
                "low_stock_threshold": 1,
                "category": 1
            }
        }
    ]
    
    products = await db.products.aggregate(pipeline).to_list(100)
    return {"low_stock_products": products, "count": len(products)}

# ====== 6. ORDER STATUS TRACKING ======

ORDER_STATUSES = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled"
]

async def add_status_history(order_id: str, status: str, note: Optional[str] = None):
    """Add status change to order history"""
    history = OrderStatusHistory(
        order_id=order_id,
        status=status,
        note=note
    )
    doc = history.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.order_status_history.insert_one(doc)

# Update order status with tracking
@api_router.put("/admin/orders/{order_id}/status/track")
async def update_order_status_tracked(
    order_id: str,
    status: str,
    note: Optional[str] = None,
    admin: dict = Depends(require_admin)
):
    if status not in ORDER_STATUSES:
        raise HTTPException(400, f"Invalid status. Must be one of: {', '.join(ORDER_STATUSES)}")
    
    # Update order status
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {
            "status": status,
            f"{status}_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(404, "Order not found")
    
    # Add to history
    await add_status_history(order_id, status, note)
    
    return {"success": True, "message": "Order status updated"}

# Get order timeline
@api_router.get("/orders/{order_id}/timeline")
async def get_order_timeline(order_id: str):
    # Get order to verify it exists
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(404, "Order not found")
    
    # Get status history
    history = await db.order_status_history.find(
        {"order_id": order_id},
        {"_id": 0}
    ).sort("created_at", 1).to_list(100)
    
    # Build timeline from order timestamps
    timeline = []
    for status in ORDER_STATUSES:
        timestamp_key = f"{status}_at"
        if timestamp_key in order:
            timeline.append({
                "status": status,
                "timestamp": order[timestamp_key],
                "note": None
            })
    
    # Merge with history (history takes precedence)
    history_dict = {h["status"]: h for h in history}
    for item in timeline:
        if item["status"] in history_dict:
            item["note"] = history_dict[item["status"]].get("note")
    
    # Add any history entries not in timeline
    for h in history:
        if not any(t["status"] == h["status"] for t in timeline):
            timeline.append(h)
    
    # Sort by created_at
    timeline.sort(key=lambda x: x.get("timestamp", x.get("created_at", "")))
    
    return {"timeline": timeline, "current_status": order.get("status", "pending")}

# Get order tracking (public - with order ID only)
@api_router.get("/track/{order_id}")
async def track_order(order_id: str):
    order = await db.orders.find_one(
        {"id": order_id},
        {"_id": 0, "status": 1, "created_at": 1, "total_amount": 1}
    )
    if not order:
        raise HTTPException(404, "Order not found")
    
    # Get timeline
    history = await db.order_status_history.find(
        {"order_id": order_id},
        {"_id": 0}
    ).sort("created_at", 1).to_list(100)
    
    return {
        "order_id": order_id,
        "status": order.get("status", "pending"),
        "created_at": order.get("created_at"),
        "total_amount": order.get("total_amount"),
        "timeline": history
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db():
    # Create database indexes for performance optimization
    try:
        await db.products.create_index([("category", 1)])
        await db.products.create_index([("tags", 1)])
        await db.products.create_index([("name", "text"), ("description", "text")])
        await db.products.create_index([("price", 1)])
        await db.products.create_index([("created_at", -1)])
        
        await db.orders.create_index([("session_id", 1)])
        await db.orders.create_index([("customer_email", 1)])
        await db.orders.create_index([("status", 1)])
        await db.orders.create_index([("created_at", -1)])
        
        await db.users.create_index([("email", 1)], unique=True)
        await db.users.create_index([("role", 1)])
        
        await db.cart.create_index([("session_id", 1)])
        await db.cart.create_index([("product_id", 1)])
        
        await db.custom_gifts.create_index([("status", 1)])
        await db.custom_gifts.create_index([("created_at", -1)])
        
        await db.contacts.create_index([("status", 1)])
        await db.contacts.create_index([("created_at", -1)])
        
        await db.addresses.create_index([("user_id", 1)])
        await db.addresses.create_index([("is_default", 1)])
        
        await db.orders.create_index([("user_id", 1)])
        
        # Quick Wins Feature Indexes
        await db.reviews.create_index([("product_id", 1)])
        await db.reviews.create_index([("user_id", 1)])
        await db.reviews.create_index([("status", 1)])
        await db.reviews.create_index([("created_at", -1)])
        
        await db.wishlist.create_index([("user_id", 1), ("product_id", 1)], unique=True)
        await db.wishlist.create_index([("created_at", -1)])
        
        await db.coupons.create_index([("code", 1)], unique=True)
        await db.coupons.create_index([("is_active", 1)])
        await db.coupons.create_index([("valid_from", 1), ("valid_until", 1)])
        
        await db.coupon_usage.create_index([("coupon_id", 1), ("user_id", 1)])
        await db.coupon_usage.create_index([("order_id", 1)])
        
        await db.search_logs.create_index([("query", 1)])
        await db.search_logs.create_index([("created_at", -1)])
        
        await db.order_status_history.create_index([("order_id", 1)])
        await db.order_status_history.create_index([("created_at", 1)])
        
        logger.info("Database indexes created successfully (including Quick Wins features)")
    except Exception as e:
        logger.warning(f"Index creation warning (may already exist): {str(e)}")
    
    # Seed admin user
    admin_exists = await db.users.find_one({"email": "admin@thelilgiftcorner.com"})
    if not admin_exists:
        admin_user = User(
            name="Admin",
            email="admin@thelilgiftcorner.com",
            password=get_password_hash("Admin@123"),
            role="admin"
        )
        doc = admin_user.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.users.insert_one(doc)
        logger.info("Admin user created")
    
    # Seed products with INR prices
    count = await db.products.count_documents({})
    if count == 0:
        logger.info("Seeding database with sample products...")
        sample_products = [
            {
                "id": str(uuid.uuid4()),
                "name": "Pink Blossom Gift Box",
                "price": 2499.00,
                "category": "Gift Boxes",
                "images": ["https://images.unsplash.com/photo-1606209918398-08c0ef28d2b8?w=800"],
                "description": "A handcrafted pink blossom box filled with love and cuteness. Perfect for any special occasion.",
                "tags": ["aesthetic", "cute", "floral", "handmade"],
                "in_stock": True,
                "stock_quantity": 50,
                "low_stock_threshold": 10,
                "average_rating": 0.0,
                "total_reviews": 0,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Bridesmaid Thank You Bag",
                "price": 1550.00,
                "category": "Wedding Gifts",
                "images": ["https://images.unsplash.com/photo-1606210108866-4ca4eb806983?w=800"],
                "description": "A pretty bag to thank your bridesmaids, wrapped in charm and elegance.",
                "tags": ["minimal", "thankyou", "wedding", "gift"],
                "in_stock": True,
                "stock_quantity": 35,
                "low_stock_threshold": 10,
                "average_rating": 0.0,
                "total_reviews": 0,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Custom Name Bracelet",
                "price": 1249.00,
                "category": "Personalized Gifts",
                "images": ["https://images.unsplash.com/photo-1606209919142-3c3b1d7565da?w=800"],
                "description": "Personalized bracelet handcrafted with love and care. Add your special touch.",
                "tags": ["custom", "cute", "personalized", "jewelry"],
                "in_stock": True,
                "stock_quantity": 25,
                "low_stock_threshold": 10,
                "average_rating": 0.0,
                "total_reviews": 0,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Festive Gift Hamper",
                "price": 3750.00,
                "category": "Hampers",
                "images": ["https://images.unsplash.com/photo-1670540805686-a73a025c0dd1?w=800"],
                "description": "A delightful hamper filled with treats, perfect for Diwali or any celebration.",
                "tags": ["hamper", "festive", "celebration", "treats"],
                "in_stock": True,
                "stock_quantity": 20,
                "low_stock_threshold": 5,
                "average_rating": 0.0,
                "total_reviews": 0,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Wedding Favor Box Set",
                "price": 2900.00,
                "category": "Wedding Gifts",
                "images": ["https://images.unsplash.com/photo-1671393759133-781c76bb8f3e?w=800"],
                "description": "Elegant favor boxes with personalized touches for your special day.",
                "tags": ["wedding", "favors", "elegant", "personalized"],
                "in_stock": True,
                "stock_quantity": 40,
                "low_stock_threshold": 10,
                "average_rating": 0.0,
                "total_reviews": 0,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Cute Gift Wrap Bundle",
                "price": 1099.00,
                "category": "Gift Wrapping",
                "images": ["https://images.pexels.com/photos/34586912/pexels-photo-34586912.jpeg?w=800"],
                "description": "Beautiful gift wrapping materials with ribbons and decorative elements.",
                "tags": ["wrapping", "cute", "diy", "crafts"],
                "in_stock": True,
                "stock_quantity": 60,
                "low_stock_threshold": 15,
                "average_rating": 0.0,
                "total_reviews": 0,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Haldi Ceremony Welcome Box",
                "price": 2100.00,
                "category": "Wedding Gifts",
                "images": ["https://images.pexels.com/photos/34586904/pexels-photo-34586904.jpeg?w=800"],
                "description": "Welcome your guests with this beautiful Haldi ceremony gift box.",
                "tags": ["haldi", "ceremony", "wedding", "indian"],
                "in_stock": True,
                "stock_quantity": 30,
                "low_stock_threshold": 10,
                "average_rating": 0.0,
                "total_reviews": 0,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Birthday Surprise Box",
                "price": 2650.00,
                "category": "Gift Boxes",
                "images": ["https://images.pexels.com/photos/34586901/pexels-photo-34586901.jpeg?w=800"],
                "description": "Make birthdays extra special with this surprise-filled gift box.",
                "tags": ["birthday", "surprise", "celebration", "cute"],
                "in_stock": True,
                "stock_quantity": 45,
                "low_stock_threshold": 10,
                "average_rating": 0.0,
                "total_reviews": 0,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.products.insert_many(sample_products)
        logger.info(f"Seeded {len(sample_products)} products")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
