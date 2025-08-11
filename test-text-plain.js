// Test login with text/plain content type
import fetch from 'node-fetch';

async function testTextPlainLogin() {
  console.log('🔍 Testing login with text/plain content type...\n');
  
  const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbwRtSTJjIA9_Hx-SpX95dJ2hRg1SSkEGLlyqjWElWJoiGQWtLzt7pwYeyeycah7KpI/exec';
  
  const requestBody = JSON.stringify({
    action: 'login',
    email: 'admin@eeu.gov.et',
    password: 'admin123'
  });
  
  try {
    console.log('📡 Making request with text/plain content type...');
    console.log('Request body:', requestBody);
    
    const response = await fetch(googleAppsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', // This is what the frontend uses
      },
      mode: 'cors',
      body: requestBody
    });
    
    console.log('\n📊 Response Status:', response.status);
    console.log('📊 Response OK:', response.ok);
    
    const responseText = await response.text();
    console.log('\n📄 Raw Response:');
    console.log(responseText);
    
    try {
      const responseData = JSON.parse(responseText);
      console.log('\n✅ Parsed Response:');
      console.log(JSON.stringify(responseData, null, 2));
      
      console.log('\n🔍 Analysis:');
      console.log('- Success:', responseData.success);
      console.log('- Error:', responseData.error);
      console.log('- Message:', responseData.message);
      console.log('- Has User:', !!responseData.user);
      
      if (!responseData.success) {
        console.log('\n❌ LOGIN FAILED WITH TEXT/PLAIN');
        console.log('This confirms the issue is with content type handling');
      } else {
        console.log('\n✅ LOGIN WORKS WITH TEXT/PLAIN');
      }
      
    } catch (parseError) {
      console.log('\n❌ Failed to parse response as JSON:', parseError.message);
    }
    
  } catch (error) {
    console.log('\n❌ Request failed:', error.message);
  }
}

testTextPlainLogin().catch(console.error);