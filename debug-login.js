// Debug login response
import fetch from 'node-fetch';

async function debugLogin() {
  console.log('🔍 Debugging Login Response...\n');
  
  try {
    const response = await fetch('http://localhost:3001/api?action=login', {
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
    
    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('Full Response Data:');
    console.log(JSON.stringify(data, null, 2));
    
    console.log('\nResponse Analysis:');
    console.log('- success:', data.success);
    console.log('- error:', data.error);
    console.log('- user:', data.user);
    console.log('- data:', data.data);
    
  } catch (error) {
    console.error('Debug Error:', error);
  }
}

debugLogin();