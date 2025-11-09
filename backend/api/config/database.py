"""
Database Connection Manager
Handles MongoDB connection with Motor async driver
"""
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from .settings import settings

logger = logging.getLogger(__name__)


class DatabaseManager:
    """MongoDB database connection manager"""
    
    def __init__(self):
        self.client: AsyncIOMotorClient = None
        self.db = None
    
    async def connect(self):
        """Establish database connection"""
        try:
            self.client = AsyncIOMotorClient(settings.MONGO_URL)
            self.db = self.client[settings.DB_NAME]
            
            # Test connection
            await self.client.admin.command('ping')
            logger.info(f"✅ Connected to MongoDB: {settings.DB_NAME}")
            
        except Exception as e:
            logger.error(f"❌ MongoDB connection failed: {str(e)}")
            raise
    
    async def disconnect(self):
        """Close database connection"""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")
    
    async def create_indexes(self):
        """Create database indexes for optimal performance"""
        try:
            # Products indexes
            await self.db.products.create_index([("category", 1)])
            await self.db.products.create_index([("tags", 1)])
            await self.db.products.create_index([("name", "text"), ("description", "text")])
            await self.db.products.create_index([("price", 1)])
            await self.db.products.create_index([("created_at", -1)])
            await self.db.products.create_index([("average_rating", -1)])
            
            # Orders indexes
            await self.db.orders.create_index([("session_id", 1)])
            await self.db.orders.create_index([("customer_email", 1)])
            await self.db.orders.create_index([("user_id", 1)])
            await self.db.orders.create_index([("status", 1)])
            await self.db.orders.create_index([("created_at", -1)])
            
            # Users indexes
            await self.db.users.create_index([("email", 1)], unique=True)
            await self.db.users.create_index([("role", 1)])
            
            # Cart indexes
            await self.db.cart.create_index([("session_id", 1)])
            await self.db.cart.create_index([("product_id", 1)])
            
            # Reviews indexes
            await self.db.reviews.create_index([("product_id", 1)])
            await self.db.reviews.create_index([("user_id", 1)])
            await self.db.reviews.create_index([("status", 1)])
            await self.db.reviews.create_index([("created_at", -1)])
            
            # Wishlist indexes
            await self.db.wishlist.create_index([("user_id", 1), ("product_id", 1)], unique=True)
            await self.db.wishlist.create_index([("created_at", -1)])
            
            # Coupons indexes
            await self.db.coupons.create_index([("code", 1)], unique=True)
            await self.db.coupons.create_index([("is_active", 1)])
            await self.db.coupons.create_index([("valid_from", 1), ("valid_until", 1)])
            
            # Coupon usage indexes
            await self.db.coupon_usage.create_index([("coupon_id", 1), ("user_id", 1)])
            await self.db.coupon_usage.create_index([("order_id", 1)])
            
            # Addresses indexes
            await self.db.addresses.create_index([("user_id", 1)])
            await self.db.addresses.create_index([("is_default", 1)])
            
            # Custom gifts indexes
            await self.db.custom_gifts.create_index([("status", 1)])
            await self.db.custom_gifts.create_index([("created_at", -1)])
            
            # Contacts indexes
            await self.db.contacts.create_index([("status", 1)])
            await self.db.contacts.create_index([("created_at", -1)])
            
            # Search logs indexes
            await self.db.search_logs.create_index([("query", 1)])
            await self.db.search_logs.create_index([("created_at", -1)])
            
            # Order status history indexes
            await self.db.order_status_history.create_index([("order_id", 1)])
            await self.db.order_status_history.create_index([("created_at", 1)])
            
            # Payment transactions indexes
            await self.db.payment_transactions.create_index([("checkout_session_id", 1)])
            await self.db.payment_transactions.create_index([("order_id", 1)])
            
            logger.info("✅ Database indexes created successfully")
            
        except Exception as e:
            logger.warning(f"Index creation warning (may already exist): {str(e)}")


# Global database manager instance
db_manager = DatabaseManager()


def get_database():
    """Dependency to get database instance"""
    return db_manager.db

