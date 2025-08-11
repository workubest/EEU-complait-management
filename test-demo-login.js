// Test demo login functionality
import { apiService } from './src/lib/api.js';

async function testDemoLogin() {
  console.log('🧪 Testing Demo Login Functionality...\n');
  
  const testCredentials = [
    { email: 'admin@eeu.gov.et', password: 'admin123' },
    { email: 'manager@eeu.gov.et', password: 'manager123' },
    { email: 'technician@eeu.gov.et', password: 'tech123' },
    { email: 'test@example.com', password: 'anypassword' }
  ];
  
  for (const creds of testCredentials) {
    console.log(`\n🔐 Testing login with: ${creds.email}`);
    
    try {
      const response = await apiService.login(creds);
      
      console.log(`   ✅ Success: ${response.success}`);
      console.log(`   📧 User Email: ${response.data?.user?.email || 'N/A'}`);
      console.log(`   👤 User Name: ${response.data?.user?.name || 'N/A'}`);
      console.log(`   🎭 User Role: ${response.data?.user?.role || 'N/A'}`);
      console.log(`   🌍 User Region: ${response.data?.user?.region || 'N/A'}`);
      
      if (response.error) {
        console.log(`   ❌ Error: ${response.error}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Exception: ${error.message}`);
    }
  }
}

testDemoLogin().catch(console.error);