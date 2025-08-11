/**
 * Test Script for Live Data Migration
 * 
 * This script tests the live data functionality after migration
 */

import fetch from 'node-fetch';

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwB13dJpn1d_3Xin2-FtpdpMNmVvMSpmfdxeijSnGEmRM5mRQxMJK-dy6TXmsR9ExM/exec';

async function testHealthCheck() {
  console.log('🔍 Testing Health Check...');
  try {
    const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=healthCheck`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Health Check Passed');
      console.log(`   - Complaints Sheet: ${data.complaintsSheet}`);
      console.log(`   - Users Sheet: ${data.usersSheet}`);
      console.log(`   - Timestamp: ${data.timestamp}`);
    } else {
      console.log('❌ Health Check Failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Health Check Error:', error.message);
  }
}

async function testLogin() {
  console.log('\n🔐 Testing User Login...');
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'login',
        email: 'admin@eeu.gov.et',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    
    if (data.success && data.user) {
      console.log('✅ Login Test Passed');
      console.log(`   - User: ${data.user.Name}`);
      console.log(`   - Role: ${data.user.Role}`);
      console.log(`   - Region: ${data.user.Region}`);
    } else {
      console.log('❌ Login Test Failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Login Test Error:', error.message);
  }
}

async function testGetUsers() {
  console.log('\n👥 Testing Get Users...');
  try {
    const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getUsers`);
    const data = await response.json();
    
    if (data.success && data.data) {
      console.log('✅ Get Users Test Passed');
      console.log(`   - Total Users: ${data.data.length}`);
      console.log(`   - Sample User: ${data.data[0]?.Name || 'None'}`);
      
      // Check that passwords are not returned
      const hasPassword = data.data.some(user => user.Password || user.password);
      if (!hasPassword) {
        console.log('✅ Password Security: Passwords not exposed');
      } else {
        console.log('⚠️  Password Security: Passwords are being returned!');
      }
    } else {
      console.log('❌ Get Users Test Failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Get Users Test Error:', error.message);
  }
}

async function testGetComplaints() {
  console.log('\n📋 Testing Get Complaints...');
  try {
    const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getComplaints`);
    const data = await response.json();
    
    if (data.success && data.data) {
      console.log('✅ Get Complaints Test Passed');
      console.log(`   - Total Complaints: ${data.data.length}`);
      console.log(`   - Sample Complaint: ${data.data[0]?.Title || 'None'}`);
      
      // Check complaint structure
      if (data.data.length > 0) {
        const complaint = data.data[0];
        console.log(`   - Status: ${complaint.Status}`);
        console.log(`   - Priority: ${complaint.Priority}`);
        console.log(`   - Customer: ${complaint['Customer Name']}`);
      }
    } else {
      console.log('❌ Get Complaints Test Failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Get Complaints Test Error:', error.message);
  }
}

async function testGetCustomers() {
  console.log('\n🏠 Testing Get Customers...');
  try {
    const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getCustomers`);
    const data = await response.json();
    
    if (data.success && data.data) {
      console.log('✅ Get Customers Test Passed');
      console.log(`   - Total Customers: ${data.data.length}`);
      console.log(`   - Sample Customer: ${data.data[0]?.Name || 'None'}`);
    } else {
      console.log('❌ Get Customers Test Failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Get Customers Test Error:', error.message);
  }
}

async function testDashboardStats() {
  console.log('\n📊 Testing Dashboard Stats...');
  try {
    const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getDashboardStats`);
    const data = await response.json();
    
    if (data.success && data.data) {
      console.log('✅ Dashboard Stats Test Passed');
      console.log(`   - Total Complaints: ${data.data.complaints?.total || 0}`);
      console.log(`   - Open Complaints: ${data.data.complaints?.open || 0}`);
      console.log(`   - Total Users: ${data.data.users?.total || 0}`);
      console.log(`   - Active Users: ${data.data.users?.active || 0}`);
      console.log(`   - Resolution Rate: ${data.data.performance?.resolutionRate || 0}%`);
    } else {
      console.log('❌ Dashboard Stats Test Failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Dashboard Stats Test Error:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Live Data Migration Tests\n');
  console.log('=' .repeat(50));
  
  await testHealthCheck();
  await testLogin();
  await testGetUsers();
  await testGetComplaints();
  await testGetCustomers();
  await testDashboardStats();
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 All tests completed!');
  console.log('\nNext Steps:');
  console.log('1. If all tests passed, your migration is successful!');
  console.log('2. Start your development server: npm run dev');
  console.log('3. Login with: admin@eeu.gov.et / admin123');
  console.log('4. Verify the UI shows live data from Google Sheets');
}

// Run tests
runAllTests().catch(console.error);