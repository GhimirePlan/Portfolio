// This script tests the bcrypt password comparison
// Run with: node scripts/test-password.js

const bcrypt = require('bcryptjs');

async function testPassword() {
  const password = 'plan123';
  const hash = '$2b$10$UUYEFhqLTE5tlcrnEvLzweCwdgdlJmBKjAzKQfaiyKU2EBUn2ZO5G';
  
  const isMatch = await bcrypt.compare(password, hash);
  
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('Match:', isMatch);
}

testPassword(); 