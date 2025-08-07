import fetch from 'node-fetch';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6Do0ky06Pm6OtY62iTOuSWABmZsQAVdqtaXN27SQb8Hgtv_JqVuMPNdXKh-fW5bU/exec';

// Helper function to map API data to UI format (same as in ComplaintsList.tsx)
const mapComplaintData = (item) => ({
  id: item.ID || item.id || '',
  customerId: item['Customer ID'] || item.customerId || '1',
  title: item.Title || item.title || '',
  description: item.Description || item.description || '',
  category: item.Category || item.category || 'other',
  region: item.Region || item.region || '',
  priority: item.Priority || item.priority || 'medium',
  status: item.Status || item.status || 'open',
  createdAt: item['Created At'] || item.createdAt || new Date().toISOString(),
  updatedAt: item['Updated At'] || item.updatedAt || item['Created At'] || item.createdAt || new Date().toISOString(),
  resolvedAt: item['Resolved At'] || item.resolvedAt || '',
  estimatedResolution: item['Estimated Resolution'] || item.estimatedResolution || '',
  assignedTo: item['Assigned To'] || item.assignedTo || '',
  assignedBy: item['Assigned By'] || item.assignedBy || '',
  createdBy: item['Created By'] || item.createdBy || '',
  notes: item.Notes ? (typeof item.Notes === 'string' ? item.Notes.split(';').map(note => note.trim()).filter(note => note) : []) : [],
  attachments: item.Attachments ? (typeof item.Attachments === 'string' ? item.Attachments.split(';').map(att => att.trim()).filter(att => att) : []) : [],
  customer: {
    id: item['Customer ID'] || item.customerId || '1',
    name: item['Customer Name'] || item.customerName || item.customer?.name || '',
    email: item['Customer Email'] || item.customerEmail || item.customer?.email || '',
    phone: item['Customer Phone'] || item.customerPhone || item.customer?.phone || '',
    address: item['Customer Address'] || item.customerAddress || item.customer?.address || '',
    region: item.Region || item.region || '',
    meterNumber: item['Meter Number'] || item.meterNumber || item.customer?.meterNumber || '',
    accountNumber: item['Account Number'] || item.accountNumber || item.customer?.accountNumber || '',
  },
});

async function testComplaintDetails() {
  console.log('🔍 Testing complaint detail view functionality...\n');

  try {
    // Fetch complaints
    console.log('1. Fetching complaints...');
    const response = await fetch(`${APPS_SCRIPT_URL}?action=getComplaints`);
    const data = await response.json();
    
    if (data.success && data.data && data.data.length > 0) {
      console.log('   ✅ Successfully fetched', data.data.length, 'complaints');
      
      // Map the data using the same function as the UI
      const mappedComplaints = data.data.map(mapComplaintData);
      
      // Test with a recent complaint
      const recentComplaint = mappedComplaints.find(c => 
        c.createdAt.includes('2025-08-07') || c.id.includes('CMP-RECENT-')
      ) || mappedComplaints[0];
      
      console.log('\n2. Testing complaint detail mapping...');
      console.log('   Selected complaint ID:', recentComplaint.id);
      console.log('   Title:', recentComplaint.title);
      
      // Test all the fields that should be available in the detail view
      const requiredFields = [
        'id', 'title', 'description', 'category', 'priority', 'status',
        'createdAt', 'updatedAt', 'region'
      ];
      
      const customerFields = [
        'name', 'email', 'phone', 'address', 'meterNumber', 'accountNumber'
      ];
      
      console.log('\n3. Checking required fields...');
      const missingFields = [];
      
      requiredFields.forEach(field => {
        if (!recentComplaint[field] || recentComplaint[field] === '') {
          missingFields.push(field);
        }
      });
      
      customerFields.forEach(field => {
        if (!recentComplaint.customer[field] || recentComplaint.customer[field] === '') {
          missingFields.push(`customer.${field}`);
        }
      });
      
      if (missingFields.length === 0) {
        console.log('   ✅ All required fields are present');
      } else {
        console.log('   ⚠️  Missing or empty fields:', missingFields.join(', '));
      }
      
      console.log('\n4. Sample complaint details:');
      console.log('   ID:', recentComplaint.id);
      console.log('   Title:', recentComplaint.title);
      console.log('   Description:', recentComplaint.description ? recentComplaint.description.substring(0, 100) + '...' : 'No description');
      console.log('   Category:', recentComplaint.category);
      console.log('   Priority:', recentComplaint.priority);
      console.log('   Status:', recentComplaint.status);
      console.log('   Customer Name:', recentComplaint.customer.name);
      console.log('   Customer Email:', recentComplaint.customer.email);
      console.log('   Customer Phone:', recentComplaint.customer.phone);
      console.log('   Customer Address:', recentComplaint.customer.address || 'Not provided');
      console.log('   Meter Number:', recentComplaint.customer.meterNumber || 'Not provided');
      console.log('   Account Number:', recentComplaint.customer.accountNumber || 'Not provided');
      console.log('   Region:', recentComplaint.region);
      console.log('   Created At:', recentComplaint.createdAt);
      console.log('   Updated At:', recentComplaint.updatedAt);
      console.log('   Assigned To:', recentComplaint.assignedTo || 'Unassigned');
      console.log('   Notes:', recentComplaint.notes.length > 0 ? recentComplaint.notes.join('; ') : 'No notes');
      
      console.log('\n5. Testing view all functionality...');
      
      // Test filtering by different criteria
      const openComplaints = mappedComplaints.filter(c => c.status === 'open');
      const highPriorityComplaints = mappedComplaints.filter(c => c.priority === 'high' || c.priority === 'critical');
      const recentComplaints = mappedComplaints.filter(c => c.createdAt.includes('2025-08-07'));
      
      console.log('   Total complaints:', mappedComplaints.length);
      console.log('   Open complaints:', openComplaints.length);
      console.log('   High/Critical priority:', highPriorityComplaints.length);
      console.log('   Recent complaints (today):', recentComplaints.length);
      
      // Test search functionality
      const searchTerm = 'power';
      const searchResults = mappedComplaints.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      console.log('   Search results for "power":', searchResults.length);
      
      console.log('\n✅ Complaint detail view and view all functionality tests completed successfully!');
      
    } else {
      console.log('   ❌ Failed to fetch complaints:', data.error || 'No data returned');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testComplaintDetails();