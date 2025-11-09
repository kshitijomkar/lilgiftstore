import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone
import uuid

# MongoDB connection
mongo_url = "mongodb://localhost:27017"
client = AsyncIOMotorClient(mongo_url)
db = client["lilgiftcorner_db"]

# Cute and attractive products with relevant images and proper pricing
cute_products = [
    {
        "id": str(uuid.uuid4()),
        "name": "Unicorn Dreams Gift Box",
        "price": 1899.00,
        "category": "Gift Boxes",
        "images": ["https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800"],
        "description": "Magical unicorn-themed gift box filled with sparkly surprises and cute accessories.",
        "tags": ["unicorn", "magical", "kids", "cute", "sparkle"],
        "in_stock": True,
        "stock_quantity": 45,
        "low_stock_threshold": 12,
        "average_rating": 4.8,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Kawaii Stationery Set",
        "price": 799.00,
        "category": "Personalized Gifts",
        "images": ["https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=800"],
        "description": "Adorable Japanese-inspired stationery set with cute pens, notebooks, and stickers.",
        "tags": ["kawaii", "stationery", "cute", "japanese", "school"],
        "in_stock": True,
        "stock_quantity": 60,
        "low_stock_threshold": 15,
        "average_rating": 4.9,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Succulent Garden Gift Set",
        "price": 1299.00,
        "category": "Gift Boxes",
        "images": ["https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800"],
        "description": "Cute mini succulent plants in decorative pots - perfect desk companions!",
        "tags": ["plants", "succulents", "green", "office", "cute"],
        "in_stock": True,
        "stock_quantity": 35,
        "low_stock_threshold": 10,
        "average_rating": 4.7,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Pastel Macaron Box",
        "price": 1599.00,
        "category": "Hampers",
        "images": ["https://images.unsplash.com/photo-1558312657-b2dead1c4d0b?w=800"],
        "description": "Delightful box of colorful macarons in soft pastel shades. Sweet perfection!",
        "tags": ["macarons", "sweet", "pastel", "french", "dessert"],
        "in_stock": True,
        "stock_quantity": 25,
        "low_stock_threshold": 8,
        "average_rating": 5.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Teddy Bear Bouquet",
        "price": 2199.00,
        "category": "Gift Boxes",
        "images": ["https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?w=800"],
        "description": "Adorable bouquet made of mini teddy bears and roses. Perfect for loved ones!",
        "tags": ["teddy", "bears", "cute", "romantic", "bouquet"],
        "in_stock": True,
        "stock_quantity": 30,
        "low_stock_threshold": 10,
        "average_rating": 4.9,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Fairy Lights Gift Box",
        "price": 1399.00,
        "category": "Gift Boxes",
        "images": ["https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800"],
        "description": "Magical gift box with beautiful fairy lights and decorative items. Creates cozy ambiance!",
        "tags": ["lights", "fairy", "cozy", "magical", "decor"],
        "in_stock": True,
        "stock_quantity": 40,
        "low_stock_threshold": 12,
        "average_rating": 4.8,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Cupcake Gift Tower",
        "price": 2899.00,
        "category": "Hampers",
        "images": ["https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800"],
        "description": "Tower of adorable cupcakes with cute decorations. Perfect for celebrations!",
        "tags": ["cupcakes", "sweet", "celebration", "birthday", "cute"],
        "in_stock": True,
        "stock_quantity": 20,
        "low_stock_threshold": 6,
        "average_rating": 4.9,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Personalized Name Keychain",
        "price": 499.00,
        "category": "Personalized Gifts",
        "images": ["https://images.unsplash.com/photo-1611214678636-b3108c98c0f5?w=800"],
        "description": "Cute personalized keychain with custom name engraving. Perfect small gift!",
        "tags": ["keychain", "personalized", "name", "custom", "accessory"],
        "in_stock": True,
        "stock_quantity": 80,
        "low_stock_threshold": 20,
        "average_rating": 4.7,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Aesthetic Polaroid Photo Album",
        "price": 1199.00,
        "category": "Personalized Gifts",
        "images": ["https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=800"],
        "description": "Cute photo album for your favorite polaroid memories. Aesthetic and practical!",
        "tags": ["polaroid", "photo", "aesthetic", "memories", "album"],
        "in_stock": True,
        "stock_quantity": 50,
        "low_stock_threshold": 15,
        "average_rating": 4.8,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Luxury Rose Gold Jewelry Set",
        "price": 3299.00,
        "category": "Wedding Gifts",
        "images": ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800"],
        "description": "Elegant rose gold necklace and earrings set. Perfect for bridal parties!",
        "tags": ["jewelry", "rosegold", "elegant", "bridal", "luxury"],
        "in_stock": True,
        "stock_quantity": 15,
        "low_stock_threshold": 5,
        "average_rating": 5.0,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Soft Plush Toy Collection",
        "price": 1699.00,
        "category": "Gift Boxes",
        "images": ["https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=800"],
        "description": "Collection of super soft and cuddly plush toys. Perfect for kids and collectors!",
        "tags": ["plush", "soft", "toys", "cute", "cuddly"],
        "in_stock": True,
        "stock_quantity": 38,
        "low_stock_threshold": 10,
        "average_rating": 4.9,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Aesthetic Wall Art Prints",
        "price": 899.00,
        "category": "Personalized Gifts",
        "images": ["https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800"],
        "description": "Set of aesthetic wall art prints with motivational quotes. Perfect room decor!",
        "tags": ["art", "prints", "aesthetic", "decor", "motivational"],
        "in_stock": True,
        "stock_quantity": 55,
        "low_stock_threshold": 15,
        "average_rating": 4.6,
        "total_reviews": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
]

async def add_products():
    print("🎨 Adding cute products with attractive images...")
    
    # Check current count
    current_count = await db.products.count_documents({})
    print(f"📦 Current products in database: {current_count}")
    
    # Insert new products
    if cute_products:
        result = await db.products.insert_many(cute_products)
        print(f"✅ Successfully added {len(result.inserted_ids)} new cute products!")
        
    # Get final count
    final_count = await db.products.count_documents({})
    print(f"🎁 Total products now: {final_count}")
    
    # Show category breakdown
    categories = await db.products.distinct("category")
    print(f"\n📊 Categories available: {len(categories)}")
    for category in sorted(categories):
        count = await db.products.count_documents({"category": category})
        print(f"   • {category}: {count} products")
    
    print("\n🎉 Product seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(add_products())
