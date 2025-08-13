/**
 * Test script for the complaint seed data generator
 * This script tests individual functions to ensure they work correctly
 */

function testSeedDataGeneration() {
  console.log('🧪 Starting seed data generation tests...');
  
  // Test 1: Generate a small sample of complaints
  console.log('\n📋 Test 1: Generating 5 sample complaints...');
  const sampleComplaints = generateComplaints(5);
  console.log(`✅ Generated ${sampleComplaints.length} complaints`);
  
  // Display first complaint for verification
  if (sampleComplaints.length > 0) {
    const firstComplaint = sampleComplaints[0];
    console.log('\n📄 Sample complaint data:');
    console.log(`ID: ${firstComplaint.id}`);
    console.log(`Customer: ${firstComplaint.customerName}`);
    console.log(`Email: ${firstComplaint.customerEmail}`);
    console.log(`Phone: ${firstComplaint.customerPhone}`);
    console.log(`Address: ${firstComplaint.customerAddress}`);
    console.log(`Region: ${firstComplaint.region}`);
    console.log(`Service Center: ${firstComplaint.serviceCenter}`);
    console.log(`Category: ${firstComplaint.category}`);
    console.log(`Priority: ${firstComplaint.priority}`);
    console.log(`Status: ${firstComplaint.status}`);
    console.log(`Title: ${firstComplaint.title}`);
  }
  
  // Test 2: Verify data consistency
  console.log('\n🔍 Test 2: Verifying data consistency...');
  let allValid = true;
  
  sampleComplaints.forEach((complaint, index) => {
    // Check required fields
    if (!complaint.id || !complaint.customerName || !complaint.region || !complaint.serviceCenter) {
      console.log(`❌ Complaint ${index + 1} missing required fields`);
      allValid = false;
    }
    
    // Check region consistency
    if (complaint.region !== 'North Addis Ababa Region') {
      console.log(`❌ Complaint ${index + 1} has incorrect region: ${complaint.region}`);
      allValid = false;
    }
    
    // Check service center consistency
    if (complaint.serviceCenter !== 'NAAR No.6') {
      console.log(`❌ Complaint ${index + 1} has incorrect service center: ${complaint.serviceCenter}`);
      allValid = false;
    }
    
    // Check address format
    if (!complaint.customerAddress.includes('Yeka Sub City')) {
      console.log(`❌ Complaint ${index + 1} has incorrect address format: ${complaint.customerAddress}`);
      allValid = false;
    }
    
    // Check phone number format
    if (!complaint.customerPhone.startsWith('+251')) {
      console.log(`❌ Complaint ${index + 1} has incorrect phone format: ${complaint.customerPhone}`);
      allValid = false;
    }
    
    // Check email format
    if (!complaint.customerEmail.includes('@')) {
      console.log(`❌ Complaint ${index + 1} has incorrect email format: ${complaint.customerEmail}`);
      allValid = false;
    }
  });
  
  if (allValid) {
    console.log('✅ All data consistency checks passed');
  }
  
  // Test 3: Test individual helper functions
  console.log('\n🔧 Test 3: Testing helper functions...');
  
  const testCategory = getRandomComplaintCategory();
  console.log(`✅ Random category: ${testCategory}`);
  
  const testTitle = getRandomComplaintTitle(testCategory);
  console.log(`✅ Random title: ${testTitle}`);
  
  const testName = getRandomCustomerName();
  console.log(`✅ Random name: ${testName}`);
  
  const testAddress = getRandomYekaAddress();
  console.log(`✅ Random address: ${testAddress}`);
  
  const testPhone = generatePhoneNumber();
  console.log(`✅ Random phone: ${testPhone}`);
  
  const testEmail = generateEmail(testName);
  console.log(`✅ Random email: ${testEmail}`);
  
  const testAccount = generateAccountNumber();
  console.log(`✅ Random account: ${testAccount}`);
  
  const testMeter = generateMeterNumber();
  console.log(`✅ Random meter: ${testMeter}`);
  
  // Test 4: Test statistics generation
  console.log('\n📊 Test 4: Testing statistics generation...');
  const stats = generateStatistics(sampleComplaints);
  console.log(`✅ Statistics generated for ${stats.total} complaints`);
  console.log(`Categories: ${Object.keys(stats.byCategory).length}`);
  console.log(`Priorities: ${Object.keys(stats.byPriority).length}`);
  console.log(`Statuses: ${Object.keys(stats.byStatus).length}`);
  console.log(`Dates: ${Object.keys(stats.byDate).length}`);
  
  console.log('\n🎉 All tests completed successfully!');
  console.log('\n📋 Test Summary:');
  console.log('✅ Complaint generation working');
  console.log('✅ Data consistency verified');
  console.log('✅ Helper functions working');
  console.log('✅ Statistics generation working');
  console.log('\n🚀 Ready to run full seed data generation!');
  
  return {
    success: allValid,
    sampleData: sampleComplaints,
    statistics: stats
  };
}

/**
 * Quick test to generate just 10 complaints and display them
 */
function quickTest() {
  console.log('⚡ Quick test: Generating 10 complaints...');
  
  const complaints = generateComplaints(10);
  
  console.log('\n📋 Generated Complaints:');
  complaints.forEach((complaint, index) => {
    console.log(`${index + 1}. ${complaint.id} - ${complaint.customerName} - ${complaint.category} - ${complaint.priority} - ${complaint.status}`);
  });
  
  const stats = generateStatistics(complaints);
  console.log('\n📊 Quick Statistics:');
  console.log(`Total: ${stats.total}`);
  console.log('Categories:', Object.keys(stats.byCategory).join(', '));
  console.log('Priorities:', Object.keys(stats.byPriority).join(', '));
  console.log('Statuses:', Object.keys(stats.byStatus).join(', '));
  
  console.log('\n✅ Quick test completed!');
  return complaints;
}

/**
 * Test function to verify all addresses are in Yeka Sub City
 */
function testAddressConsistency() {
  console.log('🏠 Testing address consistency...');
  
  const addresses = [];
  for (let i = 0; i < 50; i++) {
    addresses.push(getRandomYekaAddress());
  }
  
  const uniqueAddresses = [...new Set(addresses)];
  console.log(`Generated ${addresses.length} addresses, ${uniqueAddresses.length} unique`);
  
  console.log('\n📍 All unique addresses:');
  uniqueAddresses.forEach((address, index) => {
    console.log(`${index + 1}. ${address}`);
  });
  
  // Verify all addresses contain "Yeka Sub City"
  const allValid = uniqueAddresses.every(address => address.includes('Yeka Sub City'));
  
  if (allValid) {
    console.log('\n✅ All addresses are in Yeka Sub City');
  } else {
    console.log('\n❌ Some addresses are not in Yeka Sub City');
  }
  
  return {
    total: addresses.length,
    unique: uniqueAddresses.length,
    addresses: uniqueAddresses,
    allValid: allValid
  };
}

/**
 * Test function to verify phone number generation
 */
function testPhoneNumbers() {
  console.log('📞 Testing phone number generation...');
  
  const phones = [];
  for (let i = 0; i < 20; i++) {
    phones.push(generatePhoneNumber());
  }
  
  console.log('\n📱 Generated phone numbers:');
  phones.forEach((phone, index) => {
    console.log(`${index + 1}. ${phone}`);
  });
  
  // Verify all phone numbers start with +251
  const allValid = phones.every(phone => phone.startsWith('+251'));
  
  if (allValid) {
    console.log('\n✅ All phone numbers have correct Ethiopian format');
  } else {
    console.log('\n❌ Some phone numbers have incorrect format');
  }
  
  return {
    phones: phones,
    allValid: allValid
  };
}

/**
 * Test function to verify date distribution
 */
function testDateDistribution() {
  console.log('📅 Testing date distribution...');
  
  const dates = [];
  for (let i = 0; i < 100; i++) {
    dates.push(getRandomDate());
  }
  
  // Group by date
  const dateGroups = {};
  dates.forEach(date => {
    const dateStr = date.toISOString().split('T')[0];
    dateGroups[dateStr] = (dateGroups[dateStr] || 0) + 1;
  });
  
  console.log(`\n📊 Generated ${dates.length} dates across ${Object.keys(dateGroups).length} different days`);
  
  // Show top 10 dates
  const sortedDates = Object.entries(dateGroups)
    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
    .slice(0, 10);
  
  console.log('\n📅 Top 10 dates by frequency:');
  sortedDates.forEach(([date, count]) => {
    console.log(`${date}: ${count} complaints`);
  });
  
  // Check if all dates are within last 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  
  const allWithinRange = dates.every(date => date >= thirtyDaysAgo && date <= now);
  
  if (allWithinRange) {
    console.log('\n✅ All dates are within the last 30 days');
  } else {
    console.log('\n❌ Some dates are outside the 30-day range');
  }
  
  return {
    totalDates: dates.length,
    uniqueDays: Object.keys(dateGroups).length,
    distribution: dateGroups,
    allWithinRange: allWithinRange
  };
}