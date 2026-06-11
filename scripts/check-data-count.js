const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    const blogCount = await db.collection('blogs').countDocuments();
    const publishedBlogCount = await db.collection('blogs').countDocuments({ published: true });
    const linkedinCount = await db.collection('linkedinposts').countDocuments();
    const userCount = await db.collection('users').countDocuments();
    
    console.log(`Total Blogs count: ${blogCount}`);
    console.log(`Published Blogs count: ${publishedBlogCount}`);
    console.log(`LinkedIn posts count: ${linkedinCount}`);
    console.log(`Users count: ${userCount}`);

    if (userCount > 0) {
      const users = await db.collection('users').find({}).toArray();
      users.forEach(u => {
        console.log(`User: ${u.email}, Role: ${u.role}`);
      });
    }
    
    if (blogCount > 0) {
      const firstBlog = await db.collection('blogs').findOne();
      console.log('First blog:', JSON.stringify(firstBlog, null, 2));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkData();
