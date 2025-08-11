// Test login and permissions
import fetch from 'node-fetch';

async function testLoginAndPermissions() {
  console.log('🔐 Testing Login and Permissions');
  console.log('=' .repeat(50));
  
  try {
    console.log('📡 Testing admin login...');
    const loginResponse = await fetch('http://localhost:3001/api?action=login', {
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
    
    const loginData = await loginResponse.json();
    
    console.log(`Login Status: ${loginResponse.status}`);
    console.log(`Login Success: ${loginData.success}`);
    
    if (loginData.success && (loginData.data?.user || loginData.user)) {
      const user = loginData.data?.user || loginData.user;
      console.log('✅ Login successful');
      console.log(`User: ${user.name} (${user.email})`);
      console.log(`Role: ${user.role}`);
      console.log(`Region: ${user.region}`);
      
      // Check permissions
      if (user.permissions) {
        console.log('\n🔑 User Permissions:');
        console.log(`Users - Read: ${user.permissions.users?.read}`);
        console.log(`Users - Create: ${user.permissions.users?.create}`);
        console.log(`Users - Update: ${user.permissions.users?.update}`);
        console.log(`Users - Delete: ${user.permissions.users?.delete}`);
        
        if (user.permissions.users?.read) {
          console.log('✅ User has permission to read users');
        } else {
          console.log('❌ User does NOT have permission to read users');
        }
      } else {
        console.log('⚠️  No permissions object found in user data');
      }
      
    } else {
      console.log('❌ Login failed');
      console.log('Response:', JSON.stringify(loginData, null, 2));
    }
    
  } catch (error) {
    console.log(`💥 Error: ${error.message}`);
  }
}

testLoginAndPermissions().catch(console.error);