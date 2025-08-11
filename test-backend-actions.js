// Test all backend actions to see which ones work

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzV6zqjYi_jhY6bQP4M-x5msxcWhYjjY1aZaemtq7es6AHXdmr9ULw9EdLDTbfyoQ/exec';

async function testBackendAction(action, data = {}) {
  try {
    const requestBody = JSON.stringify({
      action,
      ...data
    });
    
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      mode: 'cors',
      body: requestBody
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ ${action}: SUCCESS`);
      if (result.data && Array.isArray(result.data)) {
        console.log(`   📊 Data count: ${result.data.length}`);
      } else if (result.data) {
        console.log(`   📊 Data keys: ${Object.keys(result.data).join(', ')}`);
      }
    } else {
      console.log(`❌ ${action}: FAILED - ${result.error}`);
    }
    
    return result;
  } catch (error) {
    console.log(`💥 ${action}: ERROR - ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testAllActions() {
  console.log('🧪 Testing all backend actions...\n');
  
  // Test authentication first
  console.log('🔐 Authentication Tests:');
  await testBackendAction('login', { email: 'admin@eeu.gov.et', password: 'admin123' });
  
  console.log('\n👥 User Management Tests:');
  await testBackendAction('getUsers');
  
  console.log('\n👤 Customer Management Tests:');
  await testBackendAction('getCustomers');
  
  console.log('\n📋 Complaint Management Tests:');
  await testBackendAction('getComplaints');
  
  console.log('\n📊 Dashboard & Analytics Tests:');
  await testBackendAction('getDashboardStats');
  await testBackendAction('getActivityFeed');
  
  console.log('\n🔧 System Tests:');
  await testBackendAction('healthCheck');
  
  console.log('\n❓ Testing Missing Actions:');
  await testBackendAction('getNotifications');
  await testBackendAction('getSettings');
  await testBackendAction('getPermissionMatrix');
  await testBackendAction('getAnalytics');
  await testBackendAction('getReports');
  await testBackendAction('getSavedSearches');
  await testBackendAction('getSystemStatus');
  await testBackendAction('exportData');
  await testBackendAction('initializeSheets');
  
  console.log('\n✅ Backend action testing completed');
}

// Run the tests
testAllActions().catch(error => {
  console.error('💥 Test suite failed:', error);
});