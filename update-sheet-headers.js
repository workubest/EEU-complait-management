import fetch from 'node-fetch';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6Do0ky06Pm6OtY62iTOuSWABmZsQAVdqtaXN27SQb8Hgtv_JqVuMPNdXKh-fW5bU/exec';

// Function to add missing headers to the complaints sheet
async function updateSheetHeaders() {
  console.log('🔧 Updating Google Sheets headers...\n');

  const payload = {
    action: 'updateSheetHeaders',
    headers: [
      'ID',
      'Title', 
      'Description',
      'Status',
      'Priority',
      'Category',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Customer Address',
      'Region',
      'Location',
      'Meter Number',
      'Account Number',
      'Assigned To',
      'Assigned By',
      'Created By',
      'Created At',
      'Updated At',
      'Resolved At',
      'Estimated Resolution',
      'Notes',
      'Attachments'
    ]
  };

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    const data = await response.json();
    console.log('Sheet headers update:', data.success ? '✅ SUCCESS' : '❌ FAILED', data.error || '');
    
    if (data.success) {
      console.log('Headers updated successfully!');
    } else {
      console.log('Note: This might fail if the updateSheetHeaders action is not implemented in the Google Apps Script.');
      console.log('You may need to manually add the missing columns to the Google Sheet.');
    }
    
  } catch (error) {
    console.error('❌ Error updating headers:', error.message);
  }
}

updateSheetHeaders();