const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/lilgiftcorner_db";
const DB_NAME = process.env.DB_NAME || "lilgiftcorner_db";

const sampleProducts = [
  {
    id: crypto.randomUUID(),
    name: "Pink Blossom Gift Box",
    price: 2499,
    category: "Gift Boxes",
    images: ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800"],
    description: "Handcrafted pink blossom gift box perfect for special occasions. Contains premium items.",
    tags: ["aesthetic", "cute", "premium"],
    in_stock: true,
    stock_quantity: 50,
    low_stock_threshold: 10,
    average_rating: 4.5,
    total_reviews: 12,
    created_at: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Wedding Favor Set - Elegant",
    price: 3999,
    category: "Wedding Gifts",
    images: ["https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"],
    description: "Elegant wedding favor set for 50 guests. Includes personalized tags and ribbons.",
    tags: ["wedding", "elegant", "bulk"],
    in_stock: true,
    stock_quantity: 25,
    low_stock_threshold: 5,
    average_rating: 5.0,
    total_reviews: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Lavender Dreams Hamper",
    price: 4500,
    category: "Hampers",
    images: ["https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800"],
    description: "Luxury lavender-themed hamper with spa essentials and aromatherapy products.",
    tags: ["spa", "luxury", "relaxation"],
    in_stock: true,
    stock_quantity: 30,
    low_stock_threshold: 10,
    average_rating: 4.8,
    total_reviews: 15,
    created_at: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Chocolate Bliss Box",
    price: 1899,
    category: "Gift Boxes",
    images: ["https://images.unsplash.com/photo-1606312619070-d48b4cde2f63?w=800"],
    description: "Gourmet chocolate assortment in a beautifully decorated box. Perfect for chocolate lovers.",
    tags: ["chocolate", "gourmet", "sweet"],
    in_stock: true,
    stock_quantity: 100,
    low_stock_threshold: 20,
    average_rating: 4.7,
    total_reviews: 25,
    created_at: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Personalized Baby Hamper",
    price: 3500,
    category: "Hampers",
    images: ["https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800"],
    description: "Adorable baby hamper with soft toys, blankets, and essentials. Can be personalized.",
    tags: ["baby", "personalized", "cute"],
    in_stock: true,
    stock_quantity: 40,
    low_stock_threshold: 10,
    average_rating: 4.9,
    total_reviews: 18,
    created_at: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Vintage Tea Collection",
    price: 2799,
    category: "Gift Boxes",
    images: ["https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800"],
    description: "Curated selection of premium teas in a vintage-inspired box. Perfect for tea enthusiasts.",
    tags: ["tea", "vintage", "premium"],
    in_stock: true,
    stock_quantity: 60,
    low_stock_threshold: 15,
    average_rating: 4.6,
    total_reviews: 10,
    created_at: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Rustic Wedding Favors",
    price: 3299,
    category: "Wedding Gifts",
    images: ["https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800"],
    description: "Rustic-themed wedding favors with natural elements. Set of 50 pieces.",
    tags: ["wedding", "rustic", "natural"],
    in_stock: true,
    stock_quantity: 20,
    low_stock_threshold: 5,
    average_rating: 4.4,
    total_reviews: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Gourmet Snack Basket",
    price: 3899,
    category: "Hampers",
    images: ["https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800"],
    description: "Premium gourmet snack basket with artisanal treats and delicacies.",
    tags: ["gourmet", "snacks", "premium"],
    in_stock: true,
    stock_quantity: 35,
    low_stock_threshold: 10,
    average_rating: 4.7,
    total_reviews: 14,
    created_at: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Spa & Wellness Gift Set",
    price: 5500,
    category: "Gift Boxes",
    images: ["https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800"],
    description: "Luxury spa and wellness gift set with bath products, candles, and aromatherapy oils.",
    tags: ["spa", "wellness", "luxury"],
    in_stock: true,
    stock_quantity: 25,
    low_stock_threshold: 5,
    average_rating: 5.0,
    total_reviews: 20,
    created_at: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Floral Arrangement Box",
    price: 2999,
    category: "Gift Boxes",
    images: ["https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800"],
    description: "Beautiful floral arrangement in a decorative box. Fresh flowers available on request.",
    tags: ["flowers", "fresh", "beautiful"],
    in_stock: true,
    stock_quantity: 45,
    low_stock_threshold: 10,
    average_rating: 4.8,
    total_reviews: 22,
    created_at: new Date().toISOString(),
  },
];

async function seed() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);

    await db.collection("products").drop().catch(() => {});
    console.log("Cleared products collection");

    const result = await db.collection("products").insertMany(sampleProducts);
    console.log(`Inserted ${result.insertedCount} products`);

    const adminExists = await db.collection("users").findOne({ email: "admin@thelilgiftcorner.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      await db.collection("users").insertOne({
        id: crypto.randomUUID(),
        name: "Admin",
        email: "admin@thelilgiftcorner.com",
        password: hashedPassword,
        role: "admin",
        created_at: new Date().toISOString(),
      });
      console.log("Created admin user");
    }

    console.log("\n✅ Database seeded successfully!");
    console.log("\nAdmin credentials:");
    console.log("Email: admin@thelilgiftcorner.com");
    console.log("Password: Admin@123");
    console.log(`\nTotal products: ${sampleProducts.length}`);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
