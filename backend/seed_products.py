import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone
import uuid
from dotenv import load_dotenv
load_dotenv()

# MongoDB connection
mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(mongo_url)
db = client["lilgiftcorner_db"]

# Extended product list with diverse categories
additional_products = [
    {
        "id": str(uuid.uuid4()),
        "name": "Elegant Pearl Necklace Set",
        "price": 1899.00,
        "category": "Personalized Gifts",
        "images": ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800"],
        "description": "Beautiful pearl necklace with matching earrings. Perfect for special occasions.",
        "tags": ["jewelry", "elegant", "pearls", "wedding"],
        "in_stock": True,
        "stock_quantity": 30,
        "low_stock_threshold": 10,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Romantic Rose Gift Basket",
        "price": 3200.00,
        "category": "Hampers",
        "images": ["https://images.unsplash.com/photo-1563619894-c5c9c3f7a70b?w=800"],
        "description": "Premium gift basket filled with roses, chocolates, and luxury treats.",
        "tags": ["romantic", "roses", "luxury", "anniversary"],
        "in_stock": True,
        "stock_quantity": 25,
        "low_stock_threshold": 5,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Baby Shower Gift Box",
        "price": 2199.00,
        "category": "Gift Boxes",
        "images": ["https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800"],
        "description": "Adorable baby shower gift box with cute baby essentials and toys.",
        "tags": ["baby", "shower", "cute", "newborn"],
        "in_stock": True,
        "stock_quantity": 40,
        "low_stock_threshold": 10,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Luxury Spa Gift Set",
        "price": 2999.00,
        "category": "Hampers",
        "images": ["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800"],
        "description": "Pamper yourself or a loved one with this luxury spa gift set.",
        "tags": ["spa", "luxury", "relaxation", "selfcare"],
        "in_stock": True,
        "stock_quantity": 35,
        "low_stock_threshold": 10,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Anniversary Love Box",
        "price": 2799.00,
        "category": "Gift Boxes",
        "images": ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800"],
        "description": "Celebrate love with this romantic anniversary gift box filled with surprises.",
        "tags": ["anniversary", "love", "romantic", "couple"],
        "in_stock": True,
        "stock_quantity": 28,
        "low_stock_threshold": 8,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Handmade Scrapbook Album",
        "price": 1599.00,
        "category": "Personalized Gifts",
        "images": ["https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?w=800"],
        "description": "Beautifully crafted scrapbook album to preserve your precious memories.",
        "tags": ["scrapbook", "handmade", "memories", "custom"],
        "in_stock": True,
        "stock_quantity": 20,
        "low_stock_threshold": 5,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Personalized Photo Frame",
        "price": 899.00,
        "category": "Personalized Gifts",
        "images": ["https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800"],
        "description": "Custom photo frame with personalized engraving for that special memory.",
        "tags": ["photo", "frame", "custom", "memorable"],
        "in_stock": True,
        "stock_quantity": 55,
        "low_stock_threshold": 15,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Festive Diwali Gift Hamper",
        "price": 4200.00,
        "category": "Hampers",
        "images": ["https://images.unsplash.com/photo-1605816388107-cd41a2a3a5a0?w=800"],
        "description": "Traditional Diwali hamper with sweets, dry fruits, and decorative diyas.",
        "tags": ["diwali", "festival", "indian", "traditional"],
        "in_stock": True,
        "stock_quantity": 18,
        "low_stock_threshold": 5,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Mehendi Ceremony Gift Set",
        "price": 1799.00,
        "category": "Wedding Gifts",
        "images": ["https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=800"],
        "description": "Beautiful mehendi ceremony gift set with traditional designs and colors.",
        "tags": ["mehendi", "wedding", "indian", "ceremony"],
        "in_stock": True,
        "stock_quantity": 32,
        "low_stock_threshold": 10,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Thank You Gift Bag",
        "price": 799.00,
        "category": "Gift Boxes",
        "images": ["https://images.unsplash.com/photo-1549488344-cbb1837e4f0d?w=800"],
        "description": "Show your appreciation with this elegant thank you gift bag.",
        "tags": ["thankyou", "appreciation", "minimal", "elegant"],
        "in_stock": True,
        "stock_quantity": 50,
        "low_stock_threshold": 15,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Luxury Gift Wrapping Kit",
        "price": 1299.00,
        "category": "Gift Wrapping",
        "images": ["https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800"],
        "description": "Complete gift wrapping kit with premium papers, ribbons, and accessories.",
        "tags": ["wrapping", "luxury", "diy", "premium"],
        "in_stock": True,
        "stock_quantity": 45,
        "low_stock_threshold": 12,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Chocolate Gift Tower",
        "price": 2599.00,
        "category": "Hampers",
        "images": ["https://images.unsplash.com/photo-1511381939415-e44015466834?w=800"],
        "description": "Decadent chocolate tower with premium imported chocolates.",
        "tags": ["chocolate", "sweet", "luxury", "tower"],
        "in_stock": True,
        "stock_quantity": 22,
        "low_stock_threshold": 8,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Corporate Gift Box",
        "price": 3499.00,
        "category": "Gift Boxes",
        "images": ["https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800"],
        "description": "Professional corporate gift box perfect for clients and employees.",
        "tags": ["corporate", "professional", "business", "premium"],
        "in_stock": True,
        "stock_quantity": 35,
        "low_stock_threshold": 10,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Customized Mug Set",
        "price": 699.00,
        "category": "Personalized Gifts",
        "images": ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800"],
        "description": "Personalized ceramic mug set with custom photos and messages.",
        "tags": ["mug", "custom", "photo", "coffee"],
        "in_stock": True,
        "stock_quantity": 65,
        "low_stock_threshold": 20,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Groom's Gift Set",
        "price": 3299.00,
        "category": "Wedding Gifts",
        "images": ["https://images.unsplash.com/photo-1601937334760-2c6e3f05c12a?w=800"],
        "description": "Complete groom's gift set with cufflinks, tie, and luxury accessories.",
        "tags": ["groom", "wedding", "luxury", "menswear"],
        "in_stock": True,
        "stock_quantity": 15,
        "low_stock_threshold": 5,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Floral Arrangement Gift Box",
        "price": 1999.00,
        "category": "Gift Boxes",
        "images": ["https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=800"],
        "description": "Fresh floral arrangement in an elegant gift box with ribbon.",
        "tags": ["flowers", "fresh", "elegant", "romantic"],
        "in_stock": True,
        "stock_quantity": 28,
        "low_stock_threshold": 8,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Tea & Snacks Gift Basket",
        "price": 1599.00,
        "category": "Hampers",
        "images": ["https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800"],
        "description": "Premium tea collection with assorted cookies and snacks.",
        "tags": ["tea", "snacks", "gourmet", "basket"],
        "in_stock": True,
        "stock_quantity": 38,
        "low_stock_threshold": 12,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Handcrafted Candle Set",
        "price": 1149.00,
        "category": "Personalized Gifts",
        "images": ["https://images.unsplash.com/photo-1602874801006-e1c9f1fa2c1e?w=800"],
        "description": "Artisan handcrafted scented candles in decorative jars.",
        "tags": ["candles", "handmade", "scented", "home"],
        "in_stock": True,
        "stock_quantity": 42,
        "low_stock_threshold": 12,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Kids Party Favor Pack",
        "price": 1899.00,
        "category": "Gift Boxes",
        "images": ["https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800"],
        "description": "Fun party favor pack for kids with toys and treats.",
        "tags": ["kids", "party", "fun", "colorful"],
        "in_stock": True,
        "stock_quantity": 48,
        "low_stock_threshold": 15,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Premium Dry Fruits Hamper",
        "price": 3899.00,
        "category": "Hampers",
        "images": ["https://images.unsplash.com/photo-1519897831810-a9a01aceccd1?w=800"],
        "description": "Luxury hamper with premium dry fruits and nuts collection.",
        "tags": ["dryfruits", "premium", "healthy", "luxury"],
        "in_stock": True,
        "stock_quantity": 20,
        "low_stock_threshold": 6,
        "average_rating": 0.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
]

async def seed_products():
    print("🌱 Starting product seeding...")
    
    # Check current count
    current_count = await db.products.count_documents({})
    print(f"📦 Current products in database: {current_count}")
    
    # Insert new products
    if additional_products:
        result = await db.products.insert_many(additional_products)
        print(f"✅ Successfully added {len(result.inserted_ids)} new products!")
        
    # Get final count
    final_count = await db.products.count_documents({})
    print(f"🎁 Total products now: {final_count}")
    
    # Show category breakdown
    categories = await db.products.distinct("category")
    print(f"\n📊 Categories available: {len(categories)}")
    for category in sorted(categories):
        count = await db.products.count_documents({"category": category})
        print(f"   • {category}: {count} products")
    
    print("\n🎉 Seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_products())
