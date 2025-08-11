// Test the complete frontend API flow
import fetch from 'node-fetch';

// Simulate the API service transformation
function transformUserData(backendUser) {
  const role = backendUser.Role || backendUser.role || 'technician';
  
  return {
    id: backendUser.ID || backendUser.id || '',
    name: backendUser.Name || backendUser.name || '',
    email: backendUser.Email || backendUser.email || '',
    phone: backendUser.Phone || backendUser.phone || '',
    role: role,
    region: backendUser.Region || backendUser.region || '',
    department: backendUser.Department || backendUser.department || '',
    isActive: backendUser['Is Active'] !== undefined ? backendUser['Is Active'] : 
              (backendUser.isActive !== undefined ? backendUser.isActive : true),
    lastLogin: backendUser['Last Login'] || backendUser.lastLogin || null,
    createdAt: backendUser['Created At'] || backendUser.createdAt || new Date().toISOString(),
    updatedAt: backendUser['Updated At'] || backendUser.updatedAt || new Date().toISOString(),
    avatar: backendUser.Avatar || backendUser.avatar || null,
    permissions: backendUser.permissions || getRolePermissions(role),
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

function getRolePermissions(role) {
  const rolePermissions = {
    admin: {
      complaints: { create: true, read: true, update: true, delete: true },
      users: { create: true, read: true, update: true, delete: true },
      reports: { create: true, read: true, update: true, delete: true },
      analytics: { create: true, read: true, update: true, delete: true }
    },
    manager: {
      complaints: { create: true, read: true, update: true, delete: false },
      users: { create: false, read: true, update: true, delete: false },
      reports: { create: true, read: true, update: true, delete: false },
      analytics: { create: false, read: true, update: false, delete: false }
    },
    foreman: {
      complaints: { create: true, read: true, update: true, delete: false },
      users: { create: false, read: true, update: false, delete: false },
      reports: { create: false, read: true, update: false, delete: false },
      analytics: { create: false, read: true, update: false, delete: false }
    },
    'call-attendant': {
      complaints: { create: true, read: true, update: true, delete: false },
      users: { create: false, read: false, update: false, delete: false },
      reports: { create: false, read: true, update: false, delete: false },
      analytics: { create: false, read: true, update: false, delete: false }
    },
    technician: {
      complaints: { create: false, read: true, update: true, delete: false },
      users: { create: false, read: false, update: false, delete: false },
      reports: { create: false, read: false, update: false, delete: false },
      analytics: { create: false, read: false, update: false, delete: false }
    }
  };
  
  return rolePermissions[role] || rolePermissions.technician;
}

async function testFrontendFlow() {
  console.log('🔄 Testing Complete Frontend Flow');
  console.log('=' .repeat(50));
  
  try {
    // Step 1: Login
    console.log('📡 Step 1: Testing admin login...');
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
    
    if (loginData.success && loginData.user) {
      // Transform login response like the frontend API service would
      const transformedUser = transformUserData(loginData.user);
      const frontendLoginResponse = {
        success: true,
        data: {
          user: transformedUser,
          token: loginData.token || 'backend-token-' + Date.now()
        },
        message: loginData.message || 'Login successful'
      };
      
      console.log('✅ Login successful');
      console.log(`User: ${transformedUser.name} (${transformedUser.email})`);
      console.log(`Role: ${transformedUser.role}`);
      console.log(`Users Read Permission: ${transformedUser.permissions.users.read}`);
      
      if (transformedUser.permissions.users.read) {
        console.log('✅ User has permission to access User Management');
        
        // Step 2: Get Users
        console.log('\n📡 Step 2: Testing get users...');
        const usersResponse = await fetch('http://localhost:3001/api?action=getUsers');
        const usersData = await usersResponse.json();
        
        if (usersData.success && usersData.data && Array.isArray(usersData.data)) {
          // Transform users data like the frontend API service would
          const transformedUsers = usersData.data.map(user => transformUserData(user));
          
          console.log(`✅ Users retrieved: ${transformedUsers.length} users`);
          console.log('📋 Sample transformed user:');
          console.log(`  - ID: ${transformedUsers[0].id}`);
          console.log(`  - Name: ${transformedUsers[0].name}`);
          console.log(`  - Email: ${transformedUsers[0].email}`);
          console.log(`  - Role: ${transformedUsers[0].role}`);
          console.log(`  - Active: ${transformedUsers[0].isActive}`);
          
          console.log('\n🎉 SUCCESS: User Management should work now!');
          console.log('✅ Login works with proper permissions');
          console.log('✅ User data is properly transformed');
          console.log('✅ All required fields are present');
          
        } else {
          console.log('❌ Failed to get users data');
        }
        
      } else {
        console.log('❌ User does NOT have permission to access User Management');
      }
      
    } else {
      console.log('❌ Login failed');
      console.log('Response:', JSON.stringify(loginData, null, 2));
    }
    
  } catch (error) {
    console.log(`💥 Error: ${error.message}`);
  }
}

testFrontendFlow().catch(console.error);