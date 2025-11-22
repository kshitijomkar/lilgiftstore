#!/usr/bin/env node
const mongodb = require('mongodb');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  const client = new mongodb.MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('lilgiftcorner_db');
    
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
      phone: '+91-9999999999',
      created_at: new Date(),
    };
    
    await db.collection('users').updateOne(
      { email: 'admin@example.com' },
      { $set: adminUser },
      { upsert: true }
    );
    
    console.log('✅ Admin user seeded successfully');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await client.close();
  }
}

seedAdmin();
