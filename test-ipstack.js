// Test script to verify IPstack API functionality
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
function loadEnvLocal() {
  try {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          process.env[key] = valueParts.join('=');
        }
      }
    }
  } catch (error) {
    console.log('Could not load .env.local file:', error.message);
  }
}

async function testIPstackAPI() {
  console.log('Testing IPstack API...');
  
  // Load environment variables
  loadEnvLocal();
  
  // Check if API key is available
  const apiKey = process.env.IPSTACK_API_KEY || process.env.IPSTACK_ACCESS_KEY;
  if (!apiKey) {
    console.error('❌ No IPstack API key found in environment variables');
    console.log('Expected: IPSTACK_API_KEY or IPSTACK_ACCESS_KEY');
    return;
  }
  
  console.log('✅ API key found:', apiKey.substring(0, 8) + '...');
  
  try {
    // Test the API endpoint
    const response = await fetch(`https://api.ipstack.com/check?access_key=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('❌ IPstack API Error:', data.error);
      return;
    }
    
    console.log('✅ IPstack API is working!');
    console.log('Response data:');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing IPstack API:', error.message);
  }
}

// Run the test
testIPstackAPI();