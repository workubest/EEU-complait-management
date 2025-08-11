/**
 * Test script to verify address and service center mapping
 * This script tests the data mapping between Google Sheets and frontend
 */

// Sample data that would come from Google Sheets (similar to seed data)
const sampleSheetData = [
  {
    'ID': 'CMP-000001',
    'Customer Name': 'Yeshi Abera',
    'Customer Email': 'yeshi.abera@hotmail.com',
    'Customer Phone': '+2510922198744',
    'Customer Address': 'Yeka Sub City, Woreda 01, Kebele 07/08',
    'Region': 'North Addis Ababa Region',
    'Service Center': 'NAAR No.6',
    'Account Number': '564188729',
    'Meter Number': '62329320',
    'Title': 'General electrical service inquiry',
    'Description': 'We have a general inquiry about our electricity service.',
    'Category': 'other',
    'Priority': 'medium',
    'Status': 'escalated',
    'Created At': '2025-08-05T01:06:26.440Z',
    'Updated At': '2025-08-08T19:05:35.773Z',
    'Created By': 'system-seed',
    'Assigned To': 'TECH-7',
    'Assigned By': 'MANAGER-1'
  },
  {
    'ID': 'CMP-000002',
    'Customer Name': 'Meron Tadele',
    'Customer Email': 'meron.tadele@outlook.com',
    'Customer Phone': '+2510935318478',
    'Customer Address': 'Yeka Sub City, Woreda 02, Kebele 09/10',
    'Region': 'North Addis Ababa Region',
    'Service Center': 'NAAR No.6',
    'Account Number': '975662045',
    'Meter Number': '44056053',
    'Title': 'Prepaid meter not accepting tokens',
    'Description': 'My prepaid electricity meter is not accepting the tokens I purchased.',
    'Category': 'prepaid-meter-issue',
    'Priority': 'high',
    'Status': 'open',
    'Created At': '2025-08-09T14:22:15.123Z',
    'Updated At': '2025-08-09T14:22:15.123Z',
    'Created By': 'system-seed',
    'Assigned To': '',
    'Assigned By': ''
  }
];

// Frontend mapping function (copied from ComplaintsList.tsx)
function mapComplaintData(item) {
  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    return phone.toString().trim();
  };

  const formatNotes = (notes) => {
    if (!notes) return [];
    if (typeof notes === 'string') {
      return notes.split(';').map(note => note.trim()).filter(note => note);
    }
    return [];
  };

  const normalizePriority = (priority) => {
    if (!priority) return 'medium';
    const normalized = String(priority).toLowerCase().trim();
    if (['low', 'medium', 'high', 'critical'].includes(normalized)) {
      return normalized;
    }
    return 'medium';
  };

  const normalizeStatus = (status) => {
    if (!status) return 'open';
    const normalized = String(status).toLowerCase().trim();
    if (['open', 'in-progress', 'resolved', 'escalated', 'closed', 'cancelled'].includes(normalized)) {
      return normalized;
    }
    return 'open';
  };

  return {
    id: item.ID || item.id || '',
    customerId: item['Customer ID'] || item.customerId || '1',
    title: item.Title || item.title || '',
    description: item.Description || item.description || '',
    category: item.Category || item.category || 'other',
    region: item.Region || item.region || item.Location || '',
    serviceCenter: item['Service Center'] || item.serviceCenter || '',
    priority: normalizePriority(item.Priority || item.priority),
    status: normalizeStatus(item.Status || item.status),
    createdAt: item['Created At'] || item.createdAt || new Date().toISOString(),
    updatedAt: item['Updated At'] || item.updatedAt || item['Created At'] || item.createdAt || new Date().toISOString(),
    resolvedAt: item['Resolved At'] || item.resolvedAt || '',
    estimatedResolution: item['Estimated Resolution'] || item.estimatedResolution || '',
    assignedTo: item['Assigned To'] || item.assignedTo || '',
    assignedBy: item['Assigned By'] || item.assignedBy || '',
    createdBy: item['Created By'] || item.createdBy || '',
    contractNumber: item['Contract Number'] || item.contractNumber || item.customer?.contractNumber || '',
    businessPartner: item['Business Partner'] || item.businessPartner || item.customer?.businessPartner || '',
    repairOrder: item['Repair Order'] || item.repairOrder || item.repairOrderNumber || '',
    notes: formatNotes(item.Notes),
    attachments: item.Attachments ? (typeof item.Attachments === 'string' ? item.Attachments.split(';').map(att => att.trim()).filter(att => att) : []) : [],
    customer: {
      id: item['Customer ID'] || item.customerId || '1',
      name: item['Customer Name'] || item.customerName || item.customer?.name || '',
      email: item['Customer Email'] || item.customerEmail || item.customer?.email || '',
      phone: formatPhoneNumber(item['Customer Phone'] || item.customerPhone || item.customer?.phone),
      address: item['Customer Address'] || item.customerAddress || item.customer?.address || item.Location || '',
      region: item.Region || item.region || item.Location || '',
      serviceCenter: item['Service Center'] || item.serviceCenter || item.customer?.serviceCenter || '',
      meterNumber: item['Meter Number'] || item.meterNumber || item.customer?.meterNumber || '',
      accountNumber: item['Account Number'] || item.accountNumber || item.customer?.accountNumber || '',
      contractNumber: item['Contract Number'] || item.contractNumber || item.customer?.contractNumber || '',
      businessPartner: item['Business Partner'] || item.businessPartner || item.customer?.businessPartner || '',
    },
  };
}

// Test the mapping
console.log('🧪 Testing Address and Service Center Mapping...\n');

sampleSheetData.forEach((item, index) => {
  console.log(`📋 Test Case ${index + 1}:`);
  console.log('📥 Input Data:');
  console.log(`  Customer Name: ${item['Customer Name']}`);
  console.log(`  Customer Address: ${item['Customer Address']}`);
  console.log(`  Region: ${item['Region']}`);
  console.log(`  Service Center: ${item['Service Center']}`);
  
  const mappedData = mapComplaintData(item);
  
  console.log('📤 Mapped Data:');
  console.log(`  ID: ${mappedData.id}`);
  console.log(`  Customer Name: ${mappedData.customer.name}`);
  console.log(`  Customer Address: ${mappedData.customer.address}`);
  console.log(`  Customer Region: ${mappedData.customer.region}`);
  console.log(`  Customer Service Center: ${mappedData.customer.serviceCenter}`);
  console.log(`  Complaint Region: ${mappedData.region}`);
  console.log(`  Complaint Service Center: ${mappedData.serviceCenter}`);
  
  // Validation
  const validations = [];
  
  if (!mappedData.customer.address || mappedData.customer.address === '') {
    validations.push('❌ Customer address is empty or null');
  } else if (mappedData.customer.address.includes('Yeka Sub City')) {
    validations.push('✅ Customer address contains Yeka Sub City');
  } else {
    validations.push('⚠️ Customer address does not contain Yeka Sub City');
  }
  
  if (!mappedData.customer.serviceCenter || mappedData.customer.serviceCenter === '') {
    validations.push('❌ Customer service center is empty or null');
  } else if (mappedData.customer.serviceCenter === 'NAAR No.6') {
    validations.push('✅ Customer service center is NAAR No.6');
  } else {
    validations.push('⚠️ Customer service center is not NAAR No.6');
  }
  
  if (!mappedData.serviceCenter || mappedData.serviceCenter === '') {
    validations.push('❌ Complaint service center is empty or null');
  } else if (mappedData.serviceCenter === 'NAAR No.6') {
    validations.push('✅ Complaint service center is NAAR No.6');
  } else {
    validations.push('⚠️ Complaint service center is not NAAR No.6');
  }
  
  console.log('🔍 Validation Results:');
  validations.forEach(validation => console.log(`  ${validation}`));
  
  console.log('\n' + '='.repeat(80) + '\n');
});

// Test what would be displayed in the frontend
console.log('🖥️ Frontend Display Test:\n');

sampleSheetData.forEach((item, index) => {
  const mappedData = mapComplaintData(item);
  
  console.log(`📱 Complaint ${index + 1} Display:`);
  console.log(`  Title: ${mappedData.title}`);
  console.log(`  Customer: ${mappedData.customer.name}`);
  console.log(`  Address: ${mappedData.customer.address || 'Not provided'}`);
  console.log(`  Service Center: ${mappedData.customer.serviceCenter || mappedData.serviceCenter || 'Not provided'}`);
  console.log(`  Region: ${mappedData.region}`);
  console.log(`  Status: ${mappedData.status}`);
  console.log(`  Priority: ${mappedData.priority}`);
  console.log('');
});

console.log('✅ Address and Service Center mapping test completed!');
console.log('\n📋 Summary:');
console.log('- Google Sheets headers: "Customer Address", "Service Center"');
console.log('- Frontend mapping: item["Customer Address"] → customer.address');
console.log('- Frontend mapping: item["Service Center"] → customer.serviceCenter');
console.log('- Display fallback: customer.address || "Not provided"');
console.log('- Display fallback: customer.serviceCenter || complaint.serviceCenter || "Not provided"');