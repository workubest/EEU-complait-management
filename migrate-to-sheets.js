// Migration script to initialize Google Sheets with all mock data
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwB13dJpn1d_3Xin2-FtpdpMNmVvMSpmfdxeijSnGEmRM5mRQxMJK-dy6TXmsR9ExM/exec';

async function initializeSheets() {
  try {
    console.log('🚀 Initializing Google Sheets with migrated data...');
    
    const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=initializeSheets`, {
      method: 'GET',
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Success:', result.message);
      console.log('📊 All sheets have been initialized with seed data');
      console.log('📋 Sheets created:');
      console.log('   - Users (with 5 seed users)');
      console.log('   - Customers (with 5 seed customers)');
      console.log('   - Complaints (with 8 seed complaints)');
      console.log('   - Dashboard_Data (with role-specific insights)');
      console.log('   - Activity_Feed (with recent activities)');
      console.log('   - Performance_Metrics (with KPIs)');
      console.log('   - System_Status (with current status)');
      console.log('   - Settings (with default configuration)');
      console.log('');
      console.log('🎯 Next steps:');
      console.log('   1. The application will now fetch data from Google Sheets');
      console.log('   2. Demo mode has been disabled');
      console.log('   3. All mock data has been migrated to the database');
      console.log('   4. You can now test the application with real data');
    } else {
      console.error('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check if the Google Apps Script URL is correct');
    console.log('   2. Ensure the Google Apps Script is deployed and accessible');
    console.log('   3. Verify the Google Sheets permissions');
  }
}

async function testConnection() {
  try {
    console.log('🔍 Testing connection to Google Apps Script...');
    
    const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=healthCheck`, {
      method: 'GET',
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Connection successful!');
      console.log('📊 Backend status:', result.data);
      return true;
    } else {
      console.error('❌ Connection failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔄 Starting migration process...');
  console.log('');
  
  // Test connection first
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('❌ Cannot proceed with migration due to connection issues');
    return;
  }
  
  console.log('');
  
  // Initialize sheets
  await initializeSheets();
}

// Run the migration
main().catch(console.error);