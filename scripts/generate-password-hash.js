// This script generates a bcrypt hash for a password
// Run with: node scripts/generate-password-hash.js

const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'plan123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log('Password:', password);
  console.log('Hash:', hash);
}

generateHash(); 