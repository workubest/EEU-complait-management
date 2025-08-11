// Test script to check Google Apps Script backend
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwB13dJpn1d_3Xin2-FtpdpMNmVvMSpmfdxeijSnGEmRM5mRQxMJK-dy6TXmsR9ExM/exec';

async function testBackend() {
  try {
    console.log('🔍 Testing Google Apps Script backend...');
    console.log('URL:', GOOGLE_APPS_SCRIPT_URL);
    
    const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=healthCheck`, {
      method: 'GET',
      mode: 'cors'
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    const text = await response.text();
    console.log('Raw response:', text);
    
    try {
      const json = JSON.parse(text);
      console.log('Parsed JSON:', json);
    } catch (parseError) {
      console.log('Failed to parse as JSON:', parseError.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBackend();