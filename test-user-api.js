// Test the user API with data transformation
import fetch from 'node-fetch';

async function testUserAPI() {
  console.log('🧪 Testing User API with Data Transformation');
  console.log('=' .repeat(50));
  
  try {
    console.log('📡 Fetching users from API...');
    const response = await fetch('http://localhost:3001/api?action=getUsers');
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${data.success}`);
    
    if (data.success && data.data && Array.isArray(data.data)) {
      console.log(`✅ Users retrieved: ${data.data.length} users`);
      console.log('\n📋 Sample user (backend format):');
      console.log(JSON.stringify(data.data[0], null, 2));
      
      // Test data transformation
      console.log('\n🔄 Testing data transformation...');
      const transformedUser = transformUserData(data.data[0]);
      console.log('📋 Sample user (transformed format):');
      console.log(JSON.stringify(transformedUser, null, 2));
      
      // Check if required fields are present
      const requiredFields = ['id', 'name', 'email', 'role', 'region', 'isActive'];
      const missingFields = requiredFields.filter(field => !transformedUser[field]);
      
      if (missingFields.length === 0) {
        console.log('✅ All required fields are present after transformation');
      } else {
        console.log(`❌ Missing fields: ${missingFields.join(', ')}`);
      }
      
    } else {
      console.log('❌ No user data returned');
      console.log('Response:', JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.log(`💥 Error: ${error.message}`);
  }
}

function transformUserData(backendUser) {
  // Same transformation logic as in the API service
  return {
    id: backendUser.ID || backendUser.id || '',
    name: backendUser.Name || backendUser.name || '',
    email: backendUser.Email || backendUser.email || '',
    phone: backendUser.Phone || backendUser.phone || '',
    role: backendUser.Role || backendUser.role || 'technician',
    region: backendUser.Region || backendUser.region || '',
    department: backendUser.Department || backendUser.department || '',
    isActive: backendUser['Is Active'] !== undefined ? backendUser['Is Active'] : 
              (backendUser.isActive !== undefined ? backendUser.isActive : true),
    lastLogin: backendUser['Last Login'] || backendUser.lastLogin || null,
    createdAt: backendUser['Created At'] || backendUser.createdAt || new Date().toISOString(),
    updatedAt: backendUser['Updated At'] || backendUser.updatedAt || new Date().toISOString(),
    avatar: backendUser.Avatar || backendUser.avatar || null,
    metadata: backendUser.metadata || {
      loginCount: 0,
      lastIpAddress: null,
      twoFactorEnabled: false,
      passwordLastChanged: null,
      accountLocked: false,
      failedLoginAttempts: 0
    }
  };
}

testUserAPI().catch(console.error);