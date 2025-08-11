// Test login with different password combinations
import fetch from 'node-fetch';

async function testLoginDebug() {
  console.log('🔍 Testing login with different password combinations...\n');
  
  const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbwRtSTJjIA9_Hx-SpX95dJ2hRg1SSkEGLlyqjWElWJoiGQWtLzt7pwYeyeycah7KpI/exec';
  
  const testCombinations = [
    { email: 'admin@eeu.gov.et', password: 'admin123', description: 'Standard demo credentials' },
    { email: 'admin@eeu.gov.et', password: 'Admin123', description: 'Capitalized password' },
    { email: 'admin@eeu.gov.et', password: 'password', description: 'Generic password' },
    { email: 'admin@eeu.gov.et', password: 'admin', description: 'Simple admin password' },
    { email: 'ADMIN@EEU.GOV.ET', password: 'admin123', description: 'Uppercase email' },
    { email: 'manager@eeu.gov.et', password: 'manager123', description: 'Manager credentials' },
    { email: 'tech@eeu.gov.et', password: 'tech123', description: 'Tech credentials' },
  ];
  
  for (const combo of testCombinations) {
    try {
      console.log(`\n🧪 Testing: ${combo.description}`);
      console.log(`   Email: ${combo.email}`);
      console.log(`   Password: ${combo.password}`);
      
      const response = await fetch(googleAppsScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        mode: 'cors',
        body: JSON.stringify({
          action: 'login',
          email: combo.email,
          password: combo.password
        })
      });
      
      if (!response.ok) {
        console.log(`   ❌ HTTP Error: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`   ✅ SUCCESS! User: ${data.user?.Name || 'Unknown'} (${data.user?.Role || 'Unknown'})`);
        console.log(`   🎉 WORKING CREDENTIALS FOUND!`);
        break; // Stop on first success
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

testLoginDebug().catch(console.error);