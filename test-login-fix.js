// Test the login fix
import fetch from 'node-fetch';

async function testLoginFix() {
  console.log('🔐 Testing Login Fix');
  console.log('=' .repeat(50));
  
  try {
    console.log('📡 Testing admin login via API service...');
    const response = await fetch('http://localhost:3001/api?action=login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'login',
        email: 'admin@eeu.gov.et',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${data.success}`);
    
    if (data.success) {
      console.log('✅ Backend login successful');
      
      // Check if we have user data in the expected format
      if (data.data && data.data.user) {
        console.log('✅ New format: response.data.user found');
        console.log(`User: ${data.data.user.name} (${data.data.user.email})`);
        console.log(`Role: ${data.data.user.role}`);
        console.log(`Permissions: ${JSON.stringify(data.data.user.permissions?.users)}`);
      } else if (data.user) {
        console.log('⚠️  Old format: response.user found');
        console.log(`User: ${data.user.Name || data.user.name} (${data.user.Email || data.user.email})`);
        console.log(`Role: ${data.user.Role || data.user.role}`);
      } else {
        console.log('❌ No user data found in response');
      }
      
      console.log('\n📋 Full response structure:');
      console.log(JSON.stringify(data, null, 2));
      
    } else {
      console.log(`❌ Login failed: ${data.error || 'Unknown error'}`);
      console.log('Response:', JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.log(`💥 Error: ${error.message}`);
  }
}

testLoginFix().catch(console.error);