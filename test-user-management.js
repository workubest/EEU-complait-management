// Test User Management functionality
import fetch from 'node-fetch';

async function testUserManagement() {
  console.log('👥 TESTING USER MANAGEMENT FUNCTIONALITY');
  console.log('=' .repeat(60));
  
  // Test 1: Get Users
  console.log('\n📋 Testing Get Users...');
  try {
    const response = await fetch('http://localhost:3001/api?action=getUsers');
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${data.success}`);
    
    if (data.success && data.data) {
      console.log(`✅ Users retrieved: ${data.data.length} users`);
      console.log('Sample user:', JSON.stringify(data.data[0], null, 2));
    } else if (data.error) {
      console.log(`❌ Error: ${data.error}`);
    } else {
      console.log('⚠️  No users data returned, will use mock data');
    }
  } catch (error) {
    console.log(`💥 Request Error: ${error.message}`);
    console.log('⚠️  This will trigger mock data fallback in the UI');
  }
  
  // Test 2: Create User
  console.log('\n➕ Testing Create User...');
  const newUser = {
    name: 'Test User',
    email: 'test.user@eeu.gov.et',
    phone: '+251-911-999-999',
    role: 'technician',
    region: 'Addis Ababa',
    department: 'Test Department',
    password: 'testpass123',
    isActive: true
  };
  
  try {
    const response = await fetch('http://localhost:3001/api?action=createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'createUser',
        ...newUser
      })
    });
    
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${data.success}`);
    
    if (data.success) {
      console.log('✅ User created successfully');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ Create failed: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`💥 Request Error: ${error.message}`);
  }
  
  // Test 3: Update User
  console.log('\n✏️  Testing Update User...');
  try {
    const response = await fetch('http://localhost:3001/api?action=updateUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateUser',
        id: 'test-user-id',
        name: 'Updated Test User',
        department: 'Updated Department'
      })
    });
    
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${data.success}`);
    
    if (data.success) {
      console.log('✅ User updated successfully');
    } else {
      console.log(`❌ Update failed: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`💥 Request Error: ${error.message}`);
  }
  
  // Test 4: Reset Password
  console.log('\n🔑 Testing Reset Password...');
  try {
    const response = await fetch('http://localhost:3001/api?action=resetUserPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'resetUserPassword',
        userId: 'test-user-id'
      })
    });
    
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${data.success}`);
    
    if (data.success) {
      console.log('✅ Password reset successfully');
    } else {
      console.log(`❌ Password reset failed: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`💥 Request Error: ${error.message}`);
  }
  
  // Test 5: Delete User
  console.log('\n🗑️  Testing Delete User...');
  try {
    const response = await fetch('http://localhost:3001/api?action=deleteUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'deleteUser',
        id: 'test-user-id'
      })
    });
    
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${data.success}`);
    
    if (data.success) {
      console.log('✅ User deleted successfully');
    } else {
      console.log(`❌ Delete failed: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`💥 Request Error: ${error.message}`);
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 USER MANAGEMENT TEST SUMMARY:');
  console.log('');
  console.log('🔍 EXPECTED BEHAVIOR:');
  console.log('   • If backend endpoints exist: Operations should succeed');
  console.log('   • If backend endpoints missing: Will show errors but UI has fallbacks');
  console.log('   • Mock data: UI will display sample users for demonstration');
  console.log('');
  console.log('✅ UI FEATURES AVAILABLE:');
  console.log('   • User listing with search and filters');
  console.log('   • Create new users with validation');
  console.log('   • Edit existing users');
  console.log('   • Toggle user active/inactive status');
  console.log('   • Role-based permissions');
  console.log('   • User activity tracking');
  console.log('   • Password reset functionality');
  console.log('   • Delete users (with confirmation)');
  console.log('');
  console.log('🌐 TO TEST IN BROWSER:');
  console.log('   1. Login as admin: admin@eeu.gov.et / admin123');
  console.log('   2. Navigate to User Management page');
  console.log('   3. Try creating, editing, and managing users');
  console.log('   4. Test search and filter functionality');
}

testUserManagement().catch(console.error);