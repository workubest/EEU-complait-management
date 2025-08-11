// Test script to verify the new Google Apps Script URL is working
import fetch from 'node-fetch';

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwRtSTJjIA9_Hx-SpX95dJ2hRg1SSkEGLlyqjWElWJoiGQWtLzt7pwYeyeycah7KpI/exec';

async function testGoogleAppsScript() {
  console.log('🧪 Testing Google Apps Script URL...');
  console.log('🔗 URL:', GOOGLE_APPS_SCRIPT_URL);
  
  try {
    // Test 1: Health Check
    console.log('\n📋 Test 1: Health Check');
    const healthResponse = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'healthCheck'
      })
    });
    
    const healthData = await healthResponse.json();
    console.log('✅ Health Check Response:', JSON.stringify(healthData, null, 2));
    
    if (healthData.success && healthData.status === 'ok') {
      console.log('🎉 Google Apps Script is working correctly!');
    } else {
      console.log('⚠️ Health check returned unexpected response');
    }
    
    // Test 2: Get Dashboard Stats
    console.log('\n📊 Test 2: Dashboard Stats');
    const statsResponse = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'getDashboardStats'
      })
    });
    
    const statsData = await statsResponse.json();
    console.log('📈 Dashboard Stats Response:', JSON.stringify(statsData, null, 2));
    
    // Test 3: Get Users (to verify sheets are accessible)
    console.log('\n👥 Test 3: Get Users');
    const usersResponse = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'getUsers'
      })
    });
    
    const usersData = await usersResponse.json();
    console.log('👤 Users Response:', JSON.stringify(usersData, null, 2));
    
    console.log('\n🎯 Summary:');
    console.log('- Health Check:', healthData.success ? '✅ PASS' : '❌ FAIL');
    console.log('- Dashboard Stats:', statsData.success ? '✅ PASS' : '❌ FAIL');
    console.log('- Users Access:', usersData.success ? '✅ PASS' : '❌ FAIL');
    
  } catch (error) {
    console.error('❌ Error testing Google Apps Script:', error.message);
    console.error('🔍 Full error:', error);
  }
}

// Run the test
testGoogleAppsScript();