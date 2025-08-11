// Test foreman and technician login
import fetch from 'node-fetch';

async function testForemanTechnician() {
  console.log('🔍 Testing foreman and technician login...\n');
  
  const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbwRtSTJjIA9_Hx-SpX95dJ2hRg1SSkEGLlyqjWElWJoiGQWtLzt7pwYeyeycah7KpI/exec';
  
  const testUsers = [
    { email: 'foreman@eeu.gov.et', password: 'foreman123', role: 'foreman' },
    { email: 'tech@eeu.gov.et', password: 'tech123', role: 'technician' },
    { email: 'technician@eeu.gov.et', password: 'tech123', role: 'technician' },
  ];
  
  for (const testUser of testUsers) {
    try {
      console.log(`\n🧪 Testing ${testUser.role}: ${testUser.email}`);
      
      const response = await fetch(googleAppsScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        mode: 'cors',
        body: JSON.stringify({
          action: 'login',
          email: testUser.email,
          password: testUser.password
        })
      });
      
      if (!response.ok) {
        console.log(`   ❌ HTTP Error: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`   ✅ SUCCESS! User: ${data.user?.Name || 'Unknown'} (${data.user?.Role || 'Unknown'})`);
        console.log(`   📍 Region: ${data.user?.Region || 'Unknown'}`);
        console.log(`   🏢 Department: ${data.user?.Department || 'Unknown'}`);
      } else {
        console.log(`   ❌ Failed: ${data.error || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.log(`   💥 Request failed: ${error.message}`);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

testForemanTechnician().catch(console.error);