// This script resets the password for an admin user in the database
// Run with: node scripts/reset-password.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable');
  process.exit(1);
}

// Define User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Reset admin password
async function resetPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create User model
    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin user found. Please run create-admin.js first.');
      process.exit(1);
    }

    console.log(`Found admin user: ${admin.email}`);
    
    // Ask for new password
    rl.question('Enter new password (min 6 characters): ', async (password) => {
      if (password.length < 6) {
        console.log('Password must be at least 6 characters');
        rl.close();
        process.exit(1);
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update admin password
      await User.findByIdAndUpdate(admin._id, { password: hashedPassword });

      console.log('Admin password updated successfully');
      console.log(`Email: ${admin.email}`);
      console.log(`Password: ${password}`);
      
      rl.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Error resetting admin password:', error);
    rl.close();
    process.exit(1);
  }
}

resetPassword();