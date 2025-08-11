// Test CORS fix for Google Apps Script

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzV6zqjYi_jhY6bQP4M-x5msxcWhYjjY1aZaemtq7es6AHXdmr9ULw9EdLDTbfyoQ/exec';

async function testCORSFix() {
  console.log('🧪 Testing CORS fix with text/plain content-type...');
  
  const requestBody = JSON.stringify({
    action: 'login',
    email: 'admin@eeu.gov.et',
    password: 'admin123'
  });
  
  console.log('📡 Request URL:', GOOGLE_APPS_SCRIPT_URL);
  console.log('📋 Request body:', requestBody);
  console.log('📋 Content-Type: text/plain');
  
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', // This should avoid preflight
      },
      mode: 'cors',
      body: requestBody
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', [...response.headers.entries()]);
    
    const data = await response.json();
    console.log('📦 Response data:', data);
    
    if (data.success) {
      console.log('✅ CORS fix successful! Login works!');
      console.log('👤 User data:', data.user || data.data);
    } else {
      console.log('❌ Login failed:', data.error || data.message);
    }
    
  } catch (error) {
    console.error('💥 Request failed:', error);
    
    if (error.message.includes('CORS')) {
      console.log('🔄 CORS issue still present, trying alternative approach...');
      await testAlternativeApproach();
    }
  }
}

async function testAlternativeApproach() {
  console.log('\n🔄 Testing alternative approach: URL-encoded form data...');
  
  try {
    const params = new URLSearchParams();
    params.append('action', 'login');
    params.append('email', 'admin@eeu.gov.et');
    params.append('password', 'admin123');
    
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      mode: 'cors',
      body: params
    });
    
    console.log('📊 Alternative response status:', response.status);
    const data = await response.json();
    console.log('📦 Alternative response data:', data);
    
    if (data.success) {
      console.log('✅ Alternative approach successful!');
    } else {
      console.log('❌ Alternative approach failed:', data.error);
    }
    
  } catch (error) {
    console.error('💥 Alternative approach failed:', error);
  }
}

// Test the simplest approach that we know works
async function testSimpleGET() {
  console.log('\n🔄 Testing simple GET approach (known to work)...');
  
  const params = new URLSearchParams({
    action: 'login',
    email: 'admin@eeu.gov.et',
    password: 'admin123'
  });
  
  const url = `${GOOGLE_APPS_SCRIPT_URL}?${params.toString()}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
    });
    
    console.log('📊 GET response status:', response.status);
    const data = await response.json();
    console.log('📦 GET response data:', data);
    
    if (data.success) {
      console.log('✅ GET approach works!');
      console.log('💡 Recommendation: Use GET for login to avoid CORS issues');
    } else {
      console.log('❌ GET approach failed:', data.error);
    }
    
  } catch (error) {
    console.error('💥 GET approach failed:', error);
  }
}

// Run tests
testCORSFix().then(() => {
  return testSimpleGET();
}).then(() => {
  console.log('\n✅ All CORS tests completed');
}).catch(error => {
  console.error('💥 Test suite failed:', error);
});