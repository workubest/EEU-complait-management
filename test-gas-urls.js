// Test both Google Apps Script URLs
import fetch from 'node-fetch';

async function testGASUrls() {
  console.log('🧪 Testing Google Apps Script URLs...\n');
  
  const urls = [
    {
      name: 'server.js URL',
      url: 'https://script.google.com/macros/s/AKfycby6Do0ky06Pm6OtY62iTOuSWABmZsQAVdqtaXN27SQb8Hgtv_JqVuMPNdXKh-fW5bU/exec'
    },
    {
      name: 'environment.ts URL',
      url: 'https://script.google.com/macros/s/AKfycbwB13dJpn1d_3Xin2-FtpdpMNmVvMSpmfdxeijSnGEmRM5mRQxMJK-dy6TXmsR9ExM/exec'
    }
  ];
  
  for (const { name, url } of urls) {
    console.log(`\n🔗 Testing ${name}:`);
    console.log(`URL: ${url}`);
    
    try {
      // Test health check
      const healthResponse = await fetch(`${url}?action=healthCheck`);
      const healthData = await healthResponse.text();
      console.log(`Health Check Status: ${healthResponse.status}`);
      console.log(`Health Check Response: ${healthData.substring(0, 100)}...`);
      
      // Test login
      const loginResponse = await fetch(`${url}?action=login&email=admin@eeu.gov.et&password=admin123`);
      const loginData = await loginResponse.text();
      console.log(`Login Status: ${loginResponse.status}`);
      console.log(`Login Response: ${loginData.substring(0, 200)}...`);
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

testGASUrls().catch(console.error);