// Deployment script for Vercel
const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Starting Vercel deployment process...');

// Check if .env.production exists
if (!fs.existsSync('.env.production')) {
  console.error('❌ .env.production file not found. Please create it first.');
  process.exit(1);
}

// Read environment variables from .env.production
const envContent = fs.readFileSync('.env.production', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

console.log('📋 Environment variables loaded from .env.production');

// Function to execute commands
function runCommand(command) {
  try {
    console.log(`🔄 Running: ${command}`);
    const output = execSync(command, { stdio: 'inherit' });
    return output;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    return null;
  }
}

// Deploy to Vercel
console.log('🔧 Building project...');
runCommand('npm run build');

console.log('🚀 Deploying to Vercel...');
console.log('⚠️ When prompted, select the following options:');
console.log('   - Set up and deploy: Y');
console.log('   - Link to existing project: Y (if you have one) or N (to create a new one)');
console.log('   - Environment variables: Add the following when prompted:');
console.log(`     - MONGODB_URI: ${envVars.MONGODB_URI}`);
console.log(`     - NEXTAUTH_SECRET: ${envVars.NEXTAUTH_SECRET}`);
console.log(`     - NEXTAUTH_URL: Update with your deployment URL once deployed`);

rl.question('Press Enter to continue with deployment...', () => {
  runCommand('npx vercel --prod');
  rl.close();
});

console.log('✅ Deployment script completed');
console.log('📝 After deployment, make sure to:');
console.log('   1. Update NEXTAUTH_URL in your Vercel project settings with the deployment URL');
console.log('   2. Run the seed script to populate your database if needed');
console.log('   3. Test your application to ensure everything works correctly'); 