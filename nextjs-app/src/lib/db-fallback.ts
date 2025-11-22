import { hashPassword } from "./auth";

interface InMemoryData {
  products: any[];
  users: any[];
  cart: any[];
  orders: any[];
  wishlist: any[];
  reviews: any[];
  custom_gifts: any[];
  contacts: any[];
}

const sampleProducts = [
  {
    id: "1",
    name: "Pink Blossom Gift Box",
    price: 2499,
    category: "Gift Boxes",
    images: ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800"],
    description: "Handcrafted pink blossom gift box perfect for special occasions.",
    tags: ["aesthetic", "cute", "premium"],
    in_stock: true,
    stock_quantity: 50,
    low_stock_threshold: 10,
    average_rating: 4.5,
    total_reviews: 12,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Wedding Favor Set - Elegant",
    price: 3999,
    category: "Wedding Gifts",
    images: ["https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"],
    description: "Elegant wedding favor set for 50 guests.",
    tags: ["wedding", "elegant", "bulk"],
    in_stock: true,
    stock_quantity: 25,
    low_stock_threshold: 5,
    average_rating: 5.0,
    total_reviews: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Lavender Dreams Hamper",
    price: 4500,
    category: "Hampers",
    images: ["https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800"],
    description: "Luxury lavender-themed hamper with spa essentials.",
    tags: ["spa", "luxury", "relaxation"],
    in_stock: true,
    stock_quantity: 30,
    low_stock_threshold: 10,
    average_rating: 4.8,
    total_reviews: 15,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Chocolate Bliss Box",
    price: 1899,
    category: "Gift Boxes",
    images: ["https://images.unsplash.com/photo-1606312619070-d48b4cde2f63?w=800"],
    description: "Gourmet chocolate assortment in a beautifully decorated box.",
    tags: ["chocolate", "gourmet", "sweet"],
    in_stock: true,
    stock_quantity: 100,
    low_stock_threshold: 20,
    average_rating: 4.7,
    total_reviews: 25,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Personalized Baby Hamper",
    price: 3500,
    category: "Hampers",
    images: ["https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800"],
    description: "Adorable baby hamper with soft toys and blankets.",
    tags: ["baby", "personalized", "cute"],
    in_stock: true,
    stock_quantity: 40,
    low_stock_threshold: 10,
    average_rating: 4.9,
    total_reviews: 18,
    created_at: new Date().toISOString(),
  },
];

const inMemoryData: InMemoryData = {
  products: [...sampleProducts],
  users: [],
  cart: [],
  orders: [],
  wishlist: [],
  reviews: [],
  custom_gifts: [],
  contacts: [],
};

export async function initializeFallbackData() {
  if (inMemoryData.users.length === 0) {
    const hashedPassword = await hashPassword("Admin@123");
    inMemoryData.users.push({
      id: "admin-1",
      name: "Admin",
      email: "admin@thelilgiftcorner.com",
      password: hashedPassword,
      role: "admin",
      created_at: new Date().toISOString(),
    });
  }
}

export class InMemoryCollection {
  constructor(
    private collectionName: keyof InMemoryData,
    private data: InMemoryData
  ) {}

  async find(filter: any = {}, options: any = {}) {
    let results = [...this.data[this.collectionName]];

    if (Object.keys(filter).length > 0) {
      results = results.filter((item: any) => {
        return Object.entries(filter).every(([key, value]) => {
          if (key === "$or") {
            return (value as any[]).some((orCondition) =>
              Object.entries(orCondition).some(([orKey, orValue]: [string, any]) => {
                if (orValue.$regex) {
                  const regex = new RegExp(orValue.$regex, orValue.$options || "");
                  return regex.test(item[orKey]);
                }
                return item[orKey] === orValue;
              })
            );
          }
          if (key === "$expr") {
            return true;
          }
          if (value && typeof value === "object" && "$in" in value) {
            return value.$in.includes(item[key]);
          }
          return item[key] === value;
        });
      });
    }

    return {
      projection: (proj: any) => this,
      sort: (sortOptions: any) => {
        const [field, order] = Object.entries(sortOptions)[0] as [string, number];
        results.sort((a: any, b: any) => {
          if (a[field] < b[field]) return order === 1 ? -1 : 1;
          if (a[field] > b[field]) return order === 1 ? 1 : -1;
          return 0;
        });
        return this;
      },
      limit: (n: number) => {
        results = results.slice(0, n);
        return this;
      },
      skip: (n: number) => {
        results = results.slice(n);
        return this;
      },
      toArray: async () => results,
    };
  }

  async findOne(filter: any, options: any = {}) {
    const results = await (await this.find(filter, options)).toArray();
    return results[0] || null;
  }

  async insertOne(document: any) {
    this.data[this.collectionName].push(document);
    return { insertedId: document.id };
  }

  async insertMany(documents: any[]) {
    documents.forEach((doc) => this.data[this.collectionName].push(doc));
    return { insertedCount: documents.length };
  }

  async updateOne(filter: any, update: any) {
    const index = this.data[this.collectionName].findIndex((item: any) =>
      Object.entries(filter).every(([key, value]) => item[key] === value)
    );

    if (index !== -1) {
      const updates = update.$set || update;
      this.data[this.collectionName][index] = {
        ...this.data[this.collectionName][index],
        ...updates,
      };
      return { matchedCount: 1, modifiedCount: 1 };
    }

    return { matchedCount: 0, modifiedCount: 0 };
  }

  async deleteOne(filter: any) {
    const index = this.data[this.collectionName].findIndex((item: any) =>
      Object.entries(filter).every(([key, value]) => item[key] === value)
    );

    if (index !== -1) {
      this.data[this.collectionName].splice(index, 1);
      return { deletedCount: 1 };
    }

    return { deletedCount: 0 };
  }

  async deleteMany(filter: any) {
    const initialLength = this.data[this.collectionName].length;
    this.data[this.collectionName] = this.data[this.collectionName].filter(
      (item: any) =>
        !Object.entries(filter).every(([key, value]) => item[key] === value)
    );
    return { deletedCount: initialLength - this.data[this.collectionName].length };
  }

  async countDocuments(filter: any = {}) {
    const results = await (await this.find(filter)).toArray();
    return results.length;
  }

  async distinct(field: string) {
    const values = this.data[this.collectionName].map((item: any) => item[field]);
    return [...new Set(values)];
  }

  async drop() {
    this.data[this.collectionName] = [];
    return true;
  }
}

export class InMemoryDatabase {
  constructor(private data: InMemoryData) {}

  collection(name: string) {
    return new InMemoryCollection(name as keyof InMemoryData, this.data);
  }
}

export async function getInMemoryDatabase() {
  await initializeFallbackData();
  return new InMemoryDatabase(inMemoryData);
}
