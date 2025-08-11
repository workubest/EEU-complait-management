// Test login functionality
import fetch from 'node-fetch';

async function testLogin() {
  console.log('🧪 Testing Login Functionality...\n');
  
  // Test 1: Frontend availability
  try {
    const frontendResponse = await fetch('http://localhost:8080');
    console.log('✅ Frontend Server:', frontendResponse.status === 200 ? 'Running' : 'Not responding');
  } catch (error) {
    console.log('❌ Frontend Server: Not running');
  }
  
  // Test 2: Backend proxy availability
  try {
    const backendResponse = await fetch('http://localhost:3001/api?action=healthCheck');
    console.log('✅ Backend Proxy:', backendResponse.status === 200 ? 'Running' : 'Not responding');
  } catch (error) {
    console.log('❌ Backend Proxy: Error -', error.message);
  }
  
  // Test 3: Direct Google Apps Script test
  const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbwB13dJpn1d_3Xin2-FtpdpMNmVvMSpmfdxeijSnGEmRM5mRQxMJK-dy6TXmsR9ExM/exec';
  
  try {
    console.log('\n🔗 Testing Google Apps Script directly...');
    const gasResponse = await fetch(`${googleAppsScriptUrl}?action=healthCheck`);
    const gasData = await gasResponse.text();
    console.log('Google Apps Script Response Status:', gasResponse.status);
    console.log('Response Preview:', gasData.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ Google Apps Script: Error -', error.message);
  }
  
  // Test 4: Login with demo credentials
  console.log('\n🔐 Testing Login with Demo Credentials...');
  
  const demoCredentials = [
    { role: 'Admin', email: 'admin@eeu.gov.et', password: 'admin123' },
    { role: 'Manager', email: 'manager@eeu.gov.et', password: 'manager123' },
    { role: 'Technician', email: 'tech@eeu.gov.et', password: 'tech123' }
  ];
  
  for (const cred of demoCredentials) {
    try {
      console.log(`\nTesting ${cred.role} login...`);
      
      // Test via backend proxy
      const loginResponse = await fetch('http://localhost:3001/api?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          email: cred.email,
          password: cred.password
        })
      });
      
      const loginData = await loginResponse.json();
      console.log(`${cred.role} Login Status:`, loginResponse.status);
      console.log(`${cred.role} Login Response:`, loginData.success ? '✅ Success' : '❌ Failed');
      
      if (loginData.error) {
        console.log(`Error: ${loginData.error}`);
      }
      
    } catch (error) {
      console.log(`❌ ${cred.role} Login Error:`, error.message);
    }
  }
}

testLogin().catch(console.error);