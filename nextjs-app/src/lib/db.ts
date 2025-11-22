import { MongoClient, Db } from "mongodb";
import { getInMemoryDatabase } from "./db-fallback";

// Validate MongoDB configuration in production
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI && process.env.NODE_ENV === 'production') {
  throw new Error('MONGODB_URI environment variable is required in production. Set it in your environment variables.');
}

const USE_FALLBACK = !MONGODB_URI || MONGODB_URI.includes("localhost:27017");

if (USE_FALLBACK && process.env.NODE_ENV !== 'test') {
  console.log("⚠️  Running in DEMO MODE with in-memory database");
  console.log("ℹ️  Data will NOT persist between restarts");
  console.log("ℹ️  To use MongoDB, set MONGODB_URI in .env.local");
  console.log("ℹ️  See SETUP.md for free MongoDB Atlas instructions");
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (!USE_FALLBACK) {
  const uri = MONGODB_URI!;
  const options = {};

  if (process.env.NODE_ENV === "development") {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export async function getDatabase(): Promise<any> {
  if (USE_FALLBACK) {
    return await getInMemoryDatabase();
  }

  if (!clientPromise) {
    throw new Error("MongoDB client not initialized");
  }

  try {
    const client = await clientPromise;
    const dbName = process.env.DB_NAME || "lilgiftcorner_db";
    return client.db(dbName);
  } catch (error) {
    console.error("MongoDB connection failed, falling back to in-memory database:", error);
    return await getInMemoryDatabase();
  }
}

export async function isDemoMode(): Promise<boolean> {
  return USE_FALLBACK;
}

export default clientPromise;
