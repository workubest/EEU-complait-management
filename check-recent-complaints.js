import fetch from 'node-fetch';

async function checkRecentComplaints() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycby6Do0ky06Pm6OtY62iTOuSWABmZsQAVdqtaXN27SQb8Hgtv_JqVuMPNdXKh-fW5bU/exec?action=getComplaints');
    const data = await response.json();
    
    if (data.success && data.data) {
      // Get the 5 most recent complaints
      const sortedComplaints = data.data.sort((a, b) => 
        new Date(b['Created At']).getTime() - new Date(a['Created At']).getTime()
      );
      
      console.log('5 Most recent complaints:');
      sortedComplaints.slice(0, 5).forEach((complaint, index) => {
        console.log(`${index + 1}. ID: ${complaint.ID}`);
        console.log(`   Title: ${complaint.Title}`);
        console.log(`   Customer: ${complaint['Customer Name']}`);
        console.log(`   Phone: ${complaint['Customer Phone']}`);
        console.log(`   Address: ${complaint['Customer Address'] || 'Not provided'}`);
        console.log(`   Region: ${complaint.Region || 'Not provided'}`);
        console.log(`   Meter: ${complaint['Meter Number'] || 'Not provided'}`);
        console.log(`   Created: ${complaint['Created At']}`);
        console.log('');
      });
      
      // Check for complaints with proper data
      const wellFormattedComplaints = data.data.filter(complaint => 
        complaint['Customer Address'] && 
        complaint['Meter Number'] && 
        complaint.Region &&
        !complaint.Notes?.includes('[Ljava.lang.Object;')
      );
      
      console.log(`Well-formatted complaints: ${wellFormattedComplaints.length} out of ${data.data.length}`);
      
      if (wellFormattedComplaints.length > 0) {
        const sample = wellFormattedComplaints[0];
        console.log('\nSample well-formatted complaint:');
        console.log('ID:', sample.ID);
        console.log('Title:', sample.Title);
        console.log('Customer:', sample['Customer Name']);
        console.log('Phone:', sample['Customer Phone']);
        console.log('Address:', sample['Customer Address']);
        console.log('Region:', sample.Region);
        console.log('Meter:', sample['Meter Number']);
        console.log('Account:', sample['Account Number']);
        console.log('Notes:', sample.Notes);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkRecentComplaints();