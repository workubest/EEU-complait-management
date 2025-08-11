// Test what users are actually in the backend
import fetch from 'node-fetch';

async function testBackendUsers() {
  console.log('🔍 Testing what users are in the backend...\n');
  
  const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbwRtSTJjIA9_Hx-SpX95dJ2hRg1SSkEGLlyqjWElWJoiGQWtLzt7pwYeyeycah7KpI/exec';
  
  try {
    console.log('📡 Getting users from backend...');
    
    const response = await fetch(googleAppsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      mode: 'cors',
      body: JSON.stringify({
        action: 'getUsers'
      })
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Response error:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('\n📊 Backend response:', data);
    
    if (data.success && data.data) {
      console.log('\n👥 Users in backend:');
      data.data.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.Email || user.email}, Role: ${user.Role || user.role}`);
      });
      
      // Check if admin user exists
      const adminUser = data.data.find(user => 
        (user.Email || user.email || '').toLowerCase() === 'admin@eeu.gov.et'
      );
      
      if (adminUser) {
        console.log('\n✅ Admin user found:', adminUser);
      } else {
        console.log('\n❌ Admin user NOT found!');
        console.log('Available emails:', data.data.map(u => u.Email || u.email));
      }
      
    } else {
      console.log('❌ Failed to get users:', data.error);
    }
    
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }
}

testBackendUsers().catch(console.error);