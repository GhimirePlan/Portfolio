// Environment variable checker for deployment
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking environment variables for deployment...');

// Define required environment variables
const requiredVars = [
  'MONGODB_URI',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

// Check if .env.production exists
const envPath = path.join(process.cwd(), '.env.production');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.production file not found!');
  console.log('Please create a .env.production file with the following variables:');
  requiredVars.forEach(variable => {
    console.log(`- ${variable}`);
  });
  process.exit(1);
}

// Read .env.production file
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
const envVars = {};

// Parse environment variables
envLines.forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Check for missing variables
const missingVars = [];
requiredVars.forEach(variable => {
  if (!envVars[variable] || envVars[variable] === '') {
    missingVars.push(variable);
  }
});

// Check for placeholder values
const placeholderVars = [];
Object.entries(envVars).forEach(([key, value]) => {
  if (requiredVars.includes(key)) {
    // Skip checking for placeholders in MONGODB_URI if it contains a real connection string
    if (key === 'MONGODB_URI' && value.includes('mongodb+srv://') && !value.includes('username:password')) {
      // This is likely a real MongoDB URI, so we'll allow it even if it has <db_password>
      return;
    }
    
    if (
      value.includes('your-') ||
      value.includes('placeholder') ||
      value.includes('username:password')
    ) {
      placeholderVars.push(key);
    }
  }
});

// Report results
if (missingVars.length === 0 && placeholderVars.length === 0) {
  console.log('✅ All required environment variables are set!');
  console.log('Environment variables found:');
  requiredVars.forEach(variable => {
    const value = envVars[variable];
    // Mask sensitive information
    const maskedValue = variable.includes('URI') || variable.includes('SECRET')
      ? `${value.substring(0, 5)}...${value.substring(value.length - 5)}`
      : value;
    console.log(`- ${variable}: ${maskedValue}`);
  });
} else {
  console.error('❌ Some environment variables are missing or contain placeholder values:');
  
  if (missingVars.length > 0) {
    console.log('\nMissing variables:');
    missingVars.forEach(variable => {
      console.log(`- ${variable}`);
    });
  }
  
  if (placeholderVars.length > 0) {
    console.log('\nVariables with placeholder values:');
    placeholderVars.forEach(variable => {
      console.log(`- ${variable}: ${envVars[variable]}`);
    });
  }
  
  console.log('\nPlease update your .env.production file before deploying.');
  process.exit(1);
}

console.log('\n🚀 Your environment is ready for deployment!'); 