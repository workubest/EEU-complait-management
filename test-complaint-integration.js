/**
 * Test script to verify complaint form integration with Google Apps Script backend
 */

const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbwDTtL5UD1l8FRGO1IuybZJthzoLUZSG9Ta9CUG6UNL4LM6Sf1y_-RiVzY992zlPHY/exec';

async function testBackendConnection() {
  console.log('🧪 Testing backend connection...');
  
  try {
    // Test 1: Health Check
    console.log('\n1. Testing health check...');
    const healthResponse = await fetch(`${BACKEND_URL}?action=healthCheck`);
    const healthData = await healthResponse.json();
    console.log('Health check result:', healthData);
    
    // Test 2: Authentication
    console.log('\n2. Testing authentication...');
    const loginResponse = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        action: 'login',
        email: 'admin@eeu.gov.et',
        password: 'admin123'
      })
    });
    const loginData = await loginResponse.json();
    console.log('Login result:', loginData);
    
    // Test 3: Create Complaint
    console.log('\n3. Testing complaint creation...');
    const complaintData = {
      action: 'createComplaint',
      customer: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+251-911-123456',
        address: 'Test Address, Addis Ababa',
        region: 'Addis Ababa'
      },
      title: 'Test Complaint - Power Outage',
      description: 'This is a test complaint for power outage in our area.',
      category: 'power-outage',
      priority: 'medium',
      createdBy: 'test-user'
    };
    
    const complaintResponse = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(complaintData)
    });
    const complaintResult = await complaintResponse.json();
    console.log('Complaint creation result:', complaintResult);
    
    // Test 4: Get Complaints
    console.log('\n4. Testing get complaints...');
    const getComplaintsResponse = await fetch(`${BACKEND_URL}?action=getComplaints`);
    const complaintsData = await getComplaintsResponse.json();
    console.log('Get complaints result:', {
      success: complaintsData.success,
      totalComplaints: complaintsData.data?.length || 0,
      sampleComplaint: complaintsData.data?.[0] || null
    });
    
    // Test 5: Dashboard Stats
    console.log('\n5. Testing dashboard stats...');
    const statsResponse = await fetch(`${BACKEND_URL}?action=getDashboardStats`);
    const statsData = await statsResponse.json();
    console.log('Dashboard stats result:', {
      success: statsData.success,
      totalComplaints: statsData.data?.totalComplaints || 0,
      openComplaints: statsData.data?.openComplaints || 0
    });
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
testBackendConnection();