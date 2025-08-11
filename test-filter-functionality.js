/**
 * Test script to verify filter functionality
 * This tests the filtering logic with sample data
 */

// Sample complaint data (similar to what would come from the API)
const sampleComplaints = [
  {
    id: 'CMP-000001',
    title: 'Electric pole fell down',
    description: 'The electric pole in our area has fallen down',
    category: 'pole-fall',
    priority: 'critical',
    status: 'open',
    region: 'North Addis Ababa Region',
    serviceCenter: 'NAAR No.6',
    customer: {
      name: 'Yeshi Abera',
      email: 'yeshi.abera@hotmail.com',
      phone: '+2510922198744',
      address: 'Yeka Sub City, Woreda 01, Kebele 07/08',
      accountNumber: '564188729',
      meterNumber: '62329320'
    },
    createdAt: '2025-08-05T01:06:26.440Z'
  },
  {
    id: 'CMP-000002',
    title: 'Prepaid meter not accepting tokens',
    description: 'My prepaid electricity meter is not accepting tokens',
    category: 'prepaid-meter-issue',
    priority: 'high',
    status: 'in-progress',
    region: 'North Addis Ababa Region',
    serviceCenter: 'NAAR No.6',
    customer: {
      name: 'Meron Tadele',
      email: 'meron.tadele@outlook.com',
      phone: '+2510935318478',
      address: 'Yeka Sub City, Woreda 02, Kebele 09/10',
      accountNumber: '975662045',
      meterNumber: '44056053'
    },
    createdAt: '2025-08-09T14:22:15.123Z'
  },
  {
    id: 'CMP-000003',
    title: 'Complete power outage in neighborhood',
    description: 'Our entire neighborhood has been without electricity',
    category: 'no-supply-total',
    priority: 'high',
    status: 'resolved',
    region: 'North Addis Ababa Region',
    serviceCenter: 'NAAR No.6',
    customer: {
      name: 'Bekele Hailu',
      email: 'bekele.hailu@gmail.com',
      phone: '+2510941234567',
      address: 'Yeka Sub City, Woreda 03, Kebele 01/02',
      accountNumber: '123456789',
      meterNumber: '87654321'
    },
    createdAt: '2025-08-01T10:15:30.000Z'
  },
  {
    id: 'CMP-000004',
    title: 'Billing issue with monthly statement',
    description: 'Incorrect electricity bill amount charged',
    category: 'billing-issue',
    priority: 'medium',
    status: 'escalated',
    region: 'North Addis Ababa Region',
    serviceCenter: 'NAAR No.6',
    customer: {
      name: 'Almaz Tadesse',
      email: 'almaz.tadesse@yahoo.com',
      phone: '+2510971234567',
      address: 'Yeka Sub City, Woreda 01, Kebele 03/04',
      accountNumber: '987654321',
      meterNumber: '12348765'
    },
    createdAt: '2025-07-28T16:45:00.000Z'
  },
  {
    id: 'CMP-000005',
    title: 'Low voltage affecting appliances',
    description: 'Voltage too low for normal operation of devices',
    category: 'under-voltage',
    priority: 'low',
    status: 'closed',
    region: 'North Addis Ababa Region',
    serviceCenter: 'NAAR No.6',
    customer: {
      name: 'Dawit Mekonnen',
      email: 'dawit.mekonnen@gmail.com',
      phone: '+2510981234567',
      address: 'Yeka Sub City, Woreda 02, Kebele 05/06',
      accountNumber: '456789123',
      meterNumber: '65432187'
    },
    createdAt: '2025-07-25T09:30:00.000Z'
  }
];

// Test filtering function (copied from ComplaintsList.tsx)
function testFiltering(complaints, searchTerm = '', statusFilter = 'all', priorityFilter = 'all') {
  const canAccessRegion = (region) => true; // Assume user can access all regions for testing
  
  const filteredComplaints = complaints.filter(complaint => {
    const matchesAccess = canAccessRegion(complaint.region);
    
    // Enhanced search functionality - search across multiple fields
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      // Basic complaint info
      complaint.title.toLowerCase().includes(searchLower) ||
      complaint.id.toLowerCase().includes(searchLower) ||
      complaint.description.toLowerCase().includes(searchLower) ||
      
      // Customer information
      complaint.customer?.name?.toLowerCase().includes(searchLower) ||
      complaint.customer?.email?.toLowerCase().includes(searchLower) ||
      complaint.customer?.phone?.toLowerCase().includes(searchLower) ||
      complaint.customer?.address?.toLowerCase().includes(searchLower) ||
      
      // Contract and business information
      complaint.contractNumber?.toLowerCase().includes(searchLower) ||
      complaint.businessPartner?.toLowerCase().includes(searchLower) ||
      complaint.customer?.contractNumber?.toLowerCase().includes(searchLower) ||
      complaint.customer?.businessPartner?.toLowerCase().includes(searchLower) ||
      
      // Account and meter information
      complaint.customer?.accountNumber?.toLowerCase().includes(searchLower) ||
      complaint.customer?.meterNumber?.toLowerCase().includes(searchLower) ||
      
      // Repair order information
      complaint.repairOrder?.toLowerCase().includes(searchLower) ||
      
      // Region and location
      complaint.region?.toLowerCase().includes(searchLower);
      
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;

    return matchesAccess && matchesSearch && matchesStatus && matchesPriority;
  });
  
  return filteredComplaints;
}

// Run tests
console.log('🧪 Testing Filter Functionality...\n');

console.log('📊 Sample Data:');
console.log(`Total complaints: ${sampleComplaints.length}`);
console.log('Status distribution:', sampleComplaints.reduce((acc, c) => {
  acc[c.status] = (acc[c.status] || 0) + 1;
  return acc;
}, {}));
console.log('Priority distribution:', sampleComplaints.reduce((acc, c) => {
  acc[c.priority] = (acc[c.priority] || 0) + 1;
  return acc;
}, {}));

console.log('\n🔍 Test 1: No Filters (should return all 5 complaints)');
const test1 = testFiltering(sampleComplaints);
console.log(`Result: ${test1.length} complaints`);
console.log('IDs:', test1.map(c => c.id));

console.log('\n🔍 Test 2: Status Filter - "open" (should return 1 complaint)');
const test2 = testFiltering(sampleComplaints, '', 'open');
console.log(`Result: ${test2.length} complaints`);
console.log('IDs:', test2.map(c => c.id));
console.log('Statuses:', test2.map(c => c.status));

console.log('\n🔍 Test 3: Status Filter - "in-progress" (should return 1 complaint)');
const test3 = testFiltering(sampleComplaints, '', 'in-progress');
console.log(`Result: ${test3.length} complaints`);
console.log('IDs:', test3.map(c => c.id));
console.log('Statuses:', test3.map(c => c.status));

console.log('\n🔍 Test 4: Priority Filter - "critical" (should return 1 complaint)');
const test4 = testFiltering(sampleComplaints, '', 'all', 'critical');
console.log(`Result: ${test4.length} complaints`);
console.log('IDs:', test4.map(c => c.id));
console.log('Priorities:', test4.map(c => c.priority));

console.log('\n🔍 Test 5: Priority Filter - "high" (should return 2 complaints)');
const test5 = testFiltering(sampleComplaints, '', 'all', 'high');
console.log(`Result: ${test5.length} complaints`);
console.log('IDs:', test5.map(c => c.id));
console.log('Priorities:', test5.map(c => c.priority));

console.log('\n🔍 Test 6: Search Term - "meter" (should return 1 complaint)');
const test6 = testFiltering(sampleComplaints, 'meter');
console.log(`Result: ${test6.length} complaints`);
console.log('IDs:', test6.map(c => c.id));
console.log('Titles:', test6.map(c => c.title));

console.log('\n🔍 Test 7: Search Term - "yeshi" (should return 1 complaint)');
const test7 = testFiltering(sampleComplaints, 'yeshi');
console.log(`Result: ${test7.length} complaints`);
console.log('IDs:', test7.map(c => c.id));
console.log('Customer names:', test7.map(c => c.customer.name));

console.log('\n🔍 Test 8: Search Term - "woreda 02" (should return 2 complaints)');
const test8 = testFiltering(sampleComplaints, 'woreda 02');
console.log(`Result: ${test8.length} complaints`);
console.log('IDs:', test8.map(c => c.id));
console.log('Addresses:', test8.map(c => c.customer.address));

console.log('\n🔍 Test 9: Combined Filters - status "resolved" + priority "high" (should return 1 complaint)');
const test9 = testFiltering(sampleComplaints, '', 'resolved', 'high');
console.log(`Result: ${test9.length} complaints`);
console.log('IDs:', test9.map(c => c.id));
console.log('Status + Priority:', test9.map(c => `${c.status} + ${c.priority}`));

console.log('\n🔍 Test 10: Combined Filters - search "billing" + status "escalated" (should return 1 complaint)');
const test10 = testFiltering(sampleComplaints, 'billing', 'escalated');
console.log(`Result: ${test10.length} complaints`);
console.log('IDs:', test10.map(c => c.id));
console.log('Titles:', test10.map(c => c.title));

console.log('\n🔍 Test 11: No Results - status "cancelled" (should return 0 complaints)');
const test11 = testFiltering(sampleComplaints, '', 'cancelled');
console.log(`Result: ${test11.length} complaints`);

console.log('\n🔍 Test 12: Case Insensitive Search - "YEKA" (should return 5 complaints)');
const test12 = testFiltering(sampleComplaints, 'YEKA');
console.log(`Result: ${test12.length} complaints`);
console.log('IDs:', test12.map(c => c.id));

console.log('\n✅ Filter Functionality Test Results:');
const tests = [
  { name: 'No Filters', expected: 5, actual: test1.length },
  { name: 'Status: open', expected: 1, actual: test2.length },
  { name: 'Status: in-progress', expected: 1, actual: test3.length },
  { name: 'Priority: critical', expected: 1, actual: test4.length },
  { name: 'Priority: high', expected: 2, actual: test5.length },
  { name: 'Search: meter', expected: 1, actual: test6.length },
  { name: 'Search: yeshi', expected: 1, actual: test7.length },
  { name: 'Search: woreda 02', expected: 2, actual: test8.length },
  { name: 'Combined: resolved + high', expected: 1, actual: test9.length },
  { name: 'Combined: billing + escalated', expected: 1, actual: test10.length },
  { name: 'No results: cancelled', expected: 0, actual: test11.length },
  { name: 'Case insensitive: YEKA', expected: 5, actual: test12.length }
];

let allPassed = true;
tests.forEach(test => {
  const passed = test.expected === test.actual;
  console.log(`${passed ? '✅' : '❌'} ${test.name}: Expected ${test.expected}, Got ${test.actual}`);
  if (!passed) allPassed = false;
});

console.log(`\n🎯 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

if (allPassed) {
  console.log('\n🎉 Filter functionality is working correctly!');
  console.log('\n💡 If filters are not working in the app, check:');
  console.log('1. URL parameter handling');
  console.log('2. Data loading timing');
  console.log('3. Component re-rendering');
  console.log('4. API data format consistency');
} else {
  console.log('\n🔧 Filter logic needs debugging');
}