// Debug script to test the exact login request being sent to Google Apps Script

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzV6zqjYi_jhY6bQP4M-x5msxcWhYjjY1aZaemtq7es6AHXdmr9ULw9EdLDTbfyoQ/exec';

async function testLoginRequest() {
  console.log('🧪 Testing login request to Google Apps Script...');
  
  // Test the exact format that the frontend is sending
  const credentials = {
    email: 'admin@eeu.gov.et',
    password: 'admin123'
  };
  
  // Simulate the frontend API service logic
  const bodyData = {
    action: 'login',
    ...credentials
  };
  
  const params = new URLSearchParams();
  Object.keys(bodyData).forEach(key => {
    params.append(key, bodyData[key]);
  });
  
  const url = `${GOOGLE_APPS_SCRIPT_URL}?${params.toString()}`;
  
  console.log('📡 Request URL:', url);
  console.log('📋 Parameters:', Object.fromEntries(params));
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', [...response.headers.entries()]);
    
    const data = await response.json();
    console.log('📦 Response data:', data);
    
    if (data.success) {
      console.log('✅ Login successful!');
      console.log('👤 User data:', data.user || data.data);
    } else {
      console.log('❌ Login failed:', data.error || data.message);
    }
    
  } catch (error) {
    console.error('💥 Request failed:', error);
  }
}

// Test with different parameter formats
async function testAlternativeFormats() {
  console.log('\n🔄 Testing alternative parameter formats...');
  
  // Test 1: Direct query parameters
  const testUrl1 = `${GOOGLE_APPS_SCRIPT_URL}?action=login&email=admin@eeu.gov.et&password=admin123`;
  console.log('\n📡 Test 1 - Direct parameters:', testUrl1);
  
  try {
    const response1 = await fetch(testUrl1, { method: 'GET', mode: 'cors' });
    const data1 = await response1.json();
    console.log('📦 Response 1:', data1);
  } catch (error) {
    console.error('💥 Test 1 failed:', error);
  }
  
  // Test 2: POST with form data
  console.log('\n📡 Test 2 - POST with form data');
  try {
    const formData = new FormData();
    formData.append('action', 'login');
    formData.append('email', 'admin@eeu.gov.et');
    formData.append('password', 'admin123');
    
    const response2 = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      body: formData
    });
    const data2 = await response2.json();
    console.log('📦 Response 2:', data2);
  } catch (error) {
    console.error('💥 Test 2 failed:', error);
  }
  
  // Test 3: POST with JSON body
  console.log('\n📡 Test 3 - POST with JSON body');
  try {
    const response3 = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'login',
        email: 'admin@eeu.gov.et',
        password: 'admin123'
      })
    });
    const data3 = await response3.json();
    console.log('📦 Response 3:', data3);
  } catch (error) {
    console.error('💥 Test 3 failed:', error);
  }
}

// Run tests
testLoginRequest().then(() => {
  return testAlternativeFormats();
}).then(() => {
  console.log('\n✅ All tests completed');
}).catch(error => {
  console.error('💥 Test suite failed:', error);
});