// Test script to verify connection to the live Google Apps Script backend
const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbzV6zqjYi_jhY6bQP4M-x5msxcWhYjjY1aZaemtq7es6AHXdmr9ULw9EdLDTbfyoQ/exec';

async function testBackendConnection() {
  console.log('🚀 Testing connection to Google Apps Script backend...');
  console.log('📡 Backend URL:', BACKEND_URL);
  
  try {
    // Test 1: Health Check
    console.log('\n1️⃣ Testing health check...');
    const healthResponse = await fetch(`${BACKEND_URL}?action=healthCheck`, {
      method: 'GET',
      mode: 'cors'
    });
    
    console.log('Health check status:', healthResponse.status);
    const healthData = await healthResponse.json();
    console.log('Health check response:', healthData);
    
    // Test 2: Login Test
    console.log('\n2️⃣ Testing login with test credentials...');
    const loginResponse = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({
        action: 'login',
        email: 'admin@eeu.gov.et',
        password: 'admin123'
      })
    });
    
    console.log('Login status:', loginResponse.status);
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    // Test 3: Get Dashboard Stats
    console.log('\n3️⃣ Testing dashboard stats...');
    const statsResponse = await fetch(`${BACKEND_URL}?action=getDashboardStats`, {
      method: 'GET',
      mode: 'cors'
    });
    
    console.log('Stats status:', statsResponse.status);
    const statsData = await statsResponse.json();
    console.log('Stats response:', statsData);
    
    // Test 4: Get Users
    console.log('\n4️⃣ Testing get users...');
    const usersResponse = await fetch(`${BACKEND_URL}?action=getUsers`, {
      method: 'GET',
      mode: 'cors'
    });
    
    console.log('Users status:', usersResponse.status);
    const usersData = await usersResponse.json();
    console.log('Users response:', usersData);
    
    console.log('\n✅ Backend connection test completed!');
    
  } catch (error) {
    console.error('❌ Backend connection test failed:', error);
  }
}

// Run the test
testBackendConnection();