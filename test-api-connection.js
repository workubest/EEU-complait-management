import fetch from 'node-fetch';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6Do0ky06Pm6OtY62iTOuSWABmZsQAVdqtaXN27SQb8Hgtv_JqVuMPNdXKh-fW5bU/exec';

async function testApiConnection() {
  console.log('🔍 Testing API connection and data retrieval...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${APPS_SCRIPT_URL}?action=healthCheck`);
    const healthData = await healthResponse.json();
    console.log('   Health check:', healthData.success ? '✅ SUCCESS' : '❌ FAILED');
    if (healthData.success) {
      console.log('   Complaints sheet:', healthData.complaintsSheet);
      console.log('   Users sheet:', healthData.usersSheet);
    }

    // Test complaints retrieval
    console.log('\n2. Testing complaints retrieval...');
    const complaintsResponse = await fetch(`${APPS_SCRIPT_URL}?action=getComplaints`);
    const complaintsData = await complaintsResponse.json();
    console.log('   Complaints fetch:', complaintsData.success ? '✅ SUCCESS' : '❌ FAILED');
    
    if (complaintsData.success && complaintsData.data) {
      console.log('   Total complaints:', complaintsData.data.length);
      
      // Check for recent complaints (today)
      const today = '2025-08-07';
      const recentComplaints = complaintsData.data.filter(complaint => 
        complaint['Created At'] && complaint['Created At'].includes(today)
      );
      
      console.log('   Recent complaints (today):', recentComplaints.length);
      
      if (recentComplaints.length > 0) {
        console.log('\n📋 Recent complaints:');
        recentComplaints.slice(0, 3).forEach((complaint, index) => {
          console.log(`   ${index + 1}. ${complaint.Title}`);
          console.log(`      ID: ${complaint.ID}`);
          console.log(`      Status: ${complaint.Status}`);
          console.log(`      Priority: ${complaint.Priority}`);
          console.log(`      Created: ${complaint['Created At']}`);
          console.log('');
        });
      }

      // Check data structure for UI compatibility
      console.log('3. Checking data structure for UI compatibility...');
      const sampleComplaint = complaintsData.data[0];
      const requiredFields = ['ID', 'Title', 'Status', 'Priority', 'Category', 'Customer Name'];
      const missingFields = requiredFields.filter(field => !sampleComplaint.hasOwnProperty(field));
      
      if (missingFields.length === 0) {
        console.log('   Data structure: ✅ COMPATIBLE');
      } else {
        console.log('   Data structure: ⚠️  MISSING FIELDS:', missingFields.join(', '));
      }

      // Check for data formatting issues
      console.log('\n4. Checking for data formatting issues...');
      const issuesFound = [];
      
      complaintsData.data.slice(0, 5).forEach(complaint => {
        if (complaint['Customer Phone'] && typeof complaint['Customer Phone'] === 'number' && complaint['Customer Phone'] < 0) {
          issuesFound.push('Negative phone numbers detected');
        }
        if (complaint.Notes && complaint.Notes.includes('[Ljava.lang.Object;')) {
          issuesFound.push('Java object serialization in notes');
        }
      });

      if (issuesFound.length === 0) {
        console.log('   Data formatting: ✅ NO ISSUES');
      } else {
        console.log('   Data formatting: ⚠️  ISSUES FOUND:');
        [...new Set(issuesFound)].forEach(issue => console.log(`     - ${issue}`));
      }

    } else {
      console.log('   Error:', complaintsData.error || 'Unknown error');
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }

  console.log('\n🏁 API connection test completed.');
}

testApiConnection();