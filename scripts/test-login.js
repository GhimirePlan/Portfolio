// This script tests the login flow
// Run with: node scripts/test-login.js

const bcrypt = require('bcryptjs');

// Mock admin user (same as in NextAuth.js)
const mockAdmin = {
  id: '1',
  name: 'Plan Ghimire',
  email: 'contact@plan.com.np',
  // Password: plan123
  password: '$2b$10$UUYEFhqLTE5tlcrnEvLzweCwdgdlJmBKjAzKQfaiyKU2EBUn2ZO5G',
  role: 'admin'
};

async function testLogin() {
  // Simulate login with correct credentials
  const correctCredentials = {
    email: 'contact@plan.com.np',
    password: 'plan123'
  };
  
  // Simulate login with incorrect credentials
  const incorrectCredentials = {
    email: 'contact@plan.com.np',
    password: 'wrongpassword'
  };
  
  // Test correct credentials
  console.log('Testing correct credentials:');
  await simulateLogin(correctCredentials);
  
  // Test incorrect credentials
  console.log('\nTesting incorrect credentials:');
  await simulateLogin(incorrectCredentials);
}

async function simulateLogin(credentials) {
  console.log('Credentials:', credentials);
  
  try {
    // Check if email matches
    if (credentials.email !== mockAdmin.email) {
      throw new Error('Invalid email or password');
    }
    
    // Check if password matches
    const isMatch = await bcrypt.compare(credentials.password, mockAdmin.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }
    
    // Login successful
    console.log('Login successful!');
    console.log('User:', {
      id: mockAdmin.id,
      name: mockAdmin.name,
      email: mockAdmin.email,
      role: mockAdmin.role
    });
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}

testLogin(); 