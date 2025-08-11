// Debug login error scenarios
import fetch from 'node-fetch';

async function debugLoginErrors() {
  console.log('🔍 Debugging Login Error Scenarios...\n');
  
  const testCases = [
    { name: 'Valid Credentials', email: 'admin@eeu.gov.et', password: 'admin123' },
    { name: 'Invalid Email', email: 'invalid@eeu.gov.et', password: 'admin123' },
    { name: 'Invalid Password', email: 'admin@eeu.gov.et', password: 'wrongpassword' },
    { name: 'Empty Email', email: '', password: 'admin123' },
    { name: 'Empty Password', email: 'admin@eeu.gov.et', password: '' },
    { name: 'Both Empty', email: '', password: '' }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log(`   Email: "${testCase.email}"`);
    console.log(`   Password: "${testCase.password}"`);
    
    try {
      const response = await fetch('http://localhost:3001/api?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          email: testCase.email,
          password: testCase.password
        })
      });
      
      const data = await response.json();
      
      console.log(`   Status: ${response.status}`);
      console.log(`   Success: ${data.success}`);
      console.log(`   Error: ${data.error || 'None'}`);
      console.log(`   User: ${data.user ? 'Present' : 'Null/Undefined'}`);
      
      if (data.error) {
        console.log(`   Error Details: ${data.error}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Request Error: ${error.message}`);
    }
  }
  
  // Test direct Google Apps Script
  console.log('\n🔗 Testing Direct Google Apps Script...');
  
  try {
    const gasUrl = 'https://script.google.com/macros/s/AKfycbwB13dJpn1d_3Xin2-FtpdpMNmVvMSpmfdxeijSnGEmRM5mRQxMJK-dy6TXmsR9ExM/exec';
    const response = await fetch(`${gasUrl}?action=login&email=&password=`);
    const data = await response.text();
    
    console.log('Direct GAS Response Status:', response.status);
    console.log('Direct GAS Response:', data.substring(0, 300));
    
    try {
      const jsonData = JSON.parse(data);
      console.log('Parsed JSON:', jsonData);
    } catch (e) {
      console.log('Not valid JSON response');
    }
    
  } catch (error) {
    console.log('Direct GAS Error:', error.message);
  }
}

debugLoginErrors();