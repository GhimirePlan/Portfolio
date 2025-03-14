// This script tests the MongoDB connection
// Run with: node scripts/test-mongodb.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB...');
console.log('Connection string:', MONGODB_URI.replace(/:[^:]*@/, ':****@'));

async function testConnection() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Get connection status
    const { host, port, name } = mongoose.connection;
    console.log(`Connected to database: ${name} on ${host}:${port}`);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    if (collections.length === 0) {
      console.log('No collections found. The database is empty.');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    console.log('\nYour MongoDB connection is working correctly!');
    console.log('You can now run the seed script to populate your database:');
    console.log('node scripts/seed-data.js');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check if your MongoDB Atlas cluster is running');
    console.log('2. Verify your connection string in .env.local');
    console.log('3. Make sure your IP address is whitelisted in MongoDB Atlas');
    console.log('4. Check if your database user has the correct permissions');
    process.exit(1);
  }
}

testConnection(); 