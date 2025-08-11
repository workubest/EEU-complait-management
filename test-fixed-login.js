// Test the fixed login functionality

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzV6zqjYi_jhY6bQP4M-x5msxcWhYjjY1aZaemtq7es6AHXdmr9ULw9EdLDTbfyoQ/exec';

async function testFixedLogin() {
  console.log('🧪 Testing fixed login functionality...');
  
  // Simulate the exact request that the fixed API service will make
  const credentials = {
    email: 'admin@eeu.gov.et',
    password: 'admin123'
  };
  
  const requestBody = JSON.stringify({
    action: 'login',
    ...credentials
  });
  
  console.log('📡 Request URL:', GOOGLE_APPS_SCRIPT_URL);
  console.log('📋 Request body:', requestBody);
  
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: requestBody
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', [...response.headers.entries()]);
    
    const data = await response.json();
    console.log('📦 Response data:', data);
    
    if (data.success) {
      console.log('✅ Login successful!');
      console.log('👤 User data:', data.user || data.data);
      
      // Test data transformation
      const user = data.user;
      const transformedUser = {
        id: user.ID || user.id || '',
        name: user.Name || user.name || '',
        email: user.Email || user.email || '',
        role: user.Role || user.role || 'technician',
        region: user.Region || user.region || '',
        department: user.Department || user.department || '',
        phone: user.Phone || user.phone || '',
        isActive: user['Is Active'] !== undefined ? user['Is Active'] : (user.isActive !== undefined ? user.isActive : true),
        createdAt: user['Created At'] || user.createdAt || new Date().toISOString(),
      };
      
      console.log('🔄 Transformed user data:', transformedUser);
      
    } else {
      console.log('❌ Login failed:', data.error || data.message);
    }
    
  } catch (error) {
    console.error('💥 Request failed:', error);
  }
}

// Test with different credentials
async function testMultipleCredentials() {
  console.log('\n🔄 Testing multiple user credentials...');
  
  const testUsers = [
    { email: 'admin@eeu.gov.et', password: 'admin123', role: 'admin' },
    { email: 'manager@eeu.gov.et', password: 'manager123', role: 'manager' },
    { email: 'foreman@eeu.gov.et', password: 'foreman123', role: 'foreman' },
    { email: 'attendant@eeu.gov.et', password: 'attendant123', role: 'call-attendant' },
    { email: 'tech@eeu.gov.et', password: 'tech123', role: 'technician' }
  ];
  
  for (const testUser of testUsers) {
    console.log(`\n📧 Testing ${testUser.role}: ${testUser.email}`);
    
    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          action: 'login',
          email: testUser.email,
          password: testUser.password
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ ${testUser.role} login successful`);
        console.log(`👤 User: ${data.user.Name} (${data.user.Role})`);
      } else {
        console.log(`❌ ${testUser.role} login failed:`, data.error);
      }
      
    } catch (error) {
      console.error(`💥 ${testUser.role} test failed:`, error);
    }
  }
}

// Run tests
testFixedLogin().then(() => {
  return testMultipleCredentials();
}).then(() => {
  console.log('\n✅ All login tests completed');
}).catch(error => {
  console.error('💥 Test suite failed:', error);
});