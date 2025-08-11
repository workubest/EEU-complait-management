// Debug script to test login and see the actual response
import fetch from 'node-fetch';

async function testLogin() {
  console.log('🔍 Testing login to identify the issue...\n');
  
  const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbwRtSTJjIA9_Hx-SpX95dJ2hRg1SSkEGLlyqjWElWJoiGQWtLzt7pwYeyeycah7KpI/exec';
  
  const testCredentials = {
    email: 'admin@eeu.gov.et',
    password: 'admin123'
  };
  
  try {
    console.log('📡 Making login request to Google Apps Script...');
    console.log('URL:', googleAppsScriptUrl);
    console.log('Credentials:', testCredentials);
    
    const response = await fetch(googleAppsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', // Using text/plain to avoid CORS preflight
      },
      body: JSON.stringify({
        action: 'login',
        email: testCredentials.email,
        password: testCredentials.password
      })
    });
    
    console.log('\n📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('\n📄 Raw Response Text:');
    console.log(responseText);
    
    try {
      const responseJson = JSON.parse(responseText);
      console.log('\n✅ Parsed JSON Response:');
      console.log(JSON.stringify(responseJson, null, 2));
      
      console.log('\n🔍 Response Analysis:');
      console.log('- success:', responseJson.success);
      console.log('- has user:', !!responseJson.user);
      console.log('- has data:', !!responseJson.data);
      console.log('- has data.user:', !!(responseJson.data && responseJson.data.user));
      console.log('- error:', responseJson.error);
      console.log('- message:', responseJson.message);
      
      if (responseJson.user) {
        console.log('\n👤 User object keys:', Object.keys(responseJson.user));
        console.log('👤 User data:', responseJson.user);
      }
      
    } catch (parseError) {
      console.log('\n❌ Failed to parse JSON:', parseError.message);
    }
    
  } catch (error) {
    console.log('\n❌ Request failed:', error.message);
  }
}

testLogin().catch(console.error);