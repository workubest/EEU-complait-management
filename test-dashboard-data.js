// Test script to check dashboard data fetching
import fetch from 'node-fetch';

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwRtSTJjIA9_Hx-SpX95dJ2hRg1SSkEGLlyqjWElWJoiGQWtLzt7pwYeyeycah7KpI/exec';

async function testDashboardData() {
  console.log('🧪 Testing Dashboard Data Fetching...');
  console.log('🔗 URL:', GOOGLE_APPS_SCRIPT_URL);
  
  try {
    // Test 1: getDashboardStats (what the frontend calls)
    console.log('\n📊 Test 1: getDashboardStats');
    const dashboardResponse = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'getDashboardStats'
      })
    });
    
    const dashboardData = await dashboardResponse.json();
    console.log('📈 Dashboard Stats Response:', JSON.stringify(dashboardData, null, 2));
    
    // Test 2: Check what the dashboard expects vs what it gets
    console.log('\n🔍 Test 2: Data Structure Analysis');
    if (dashboardData.success && dashboardData.data) {
      console.log('✅ Response has success=true and data field');
      console.log('📋 Data keys:', Object.keys(dashboardData.data));
      
      // Check for expected dashboard fields
      const expectedFields = [
        'roleInsights',
        'systemStatus', 
        'weatherData'
      ];
      
      expectedFields.forEach(field => {
        if (dashboardData.data[field]) {
          console.log(`✅ Has ${field}:`, typeof dashboardData.data[field]);
        } else {
          console.log(`❌ Missing ${field}`);
        }
      });
      
      // Check what fields are actually present
      console.log('\n📋 Available fields in response:');
      Object.keys(dashboardData.data).forEach(key => {
        console.log(`  - ${key}: ${typeof dashboardData.data[key]}`);
      });
      
    } else {
      console.log('❌ Response missing success=true or data field');
      console.log('Response structure:', Object.keys(dashboardData));
    }
    
    // Test 3: Test with role and region parameters
    console.log('\n👤 Test 3: getDashboardStats with role and region');
    const roleResponse = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'getDashboardStats',
        role: 'admin',
        region: 'Addis Ababa'
      })
    });
    
    const roleData = await roleResponse.json();
    console.log('👤 Role-specific Response:', JSON.stringify(roleData, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing dashboard data:', error.message);
    console.error('🔍 Full error:', error);
  }
}

// Run the test
testDashboardData();