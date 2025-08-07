import fetch from 'node-fetch';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6Do0ky06Pm6OtY62iTOuSWABmZsQAVdqtaXN27SQb8Hgtv_JqVuMPNdXKh-fW5bU/exec';

// Fixed recent complaints with proper data formatting
const fixedComplaints = [
  {
    id: 'CMP-FIXED-001',
    title: 'Complete Power Outage in Kirkos Area - Fixed',
    description: 'There has been no electricity in our area for the past 6 hours. Multiple households are affected. This is causing significant inconvenience especially for our home-based business.',
    category: 'power-outage',
    priority: 'high',
    status: 'open',
    region: 'Addis Ababa',
    customerName: 'Almaz Tesfaye',
    customerEmail: 'almaz.tesfaye@gmail.com',
    customerPhone: '+251-911-123456',
    customerAddress: 'Kirkos Sub-city, Addis Ababa',
    meterNumber: 'AAM-001234',
    accountNumber: 'ACC-789456',
    assignedTo: '5',
    assignedBy: '2',
    createdBy: '4',
    createdAt: '2025-08-07T18:30:00Z',
    updatedAt: '2025-08-07T18:30:00Z',
    estimatedResolution: '2025-08-08T16:00:00Z',
    notes: 'Initial report received from customer; Field team dispatched to investigate transformer issues; Area cordoned off for safety'
  },
  {
    id: 'CMP-FIXED-002',
    title: 'Voltage Fluctuation Damaging Appliances - Fixed',
    description: 'Experiencing severe voltage fluctuations that have already damaged our refrigerator and television. The voltage seems to drop and spike randomly throughout the day.',
    category: 'voltage-fluctuation',
    priority: 'medium',
    status: 'in-progress',
    region: 'Amhara',
    customerName: 'Bereket Hailu',
    customerEmail: 'bereket.hailu@yahoo.com',
    customerPhone: '+251-912-234567',
    customerAddress: 'Bahir Dar, Amhara Region',
    meterNumber: 'AMR-002345',
    accountNumber: 'ACC-890567',
    assignedTo: '3',
    assignedBy: '2',
    createdBy: '4',
    createdAt: '2025-08-07T19:20:00Z',
    updatedAt: '2025-08-07T19:45:00Z',
    estimatedResolution: '2025-08-08T12:00:00Z',
    notes: 'Customer reported appliance damage; Voltage regulator inspection scheduled; Temporary stabilizer provided to customer'
  },
  {
    id: 'CMP-FIXED-003',
    title: 'Smart Meter Installation Request - Fixed',
    description: 'Requesting installation of smart meter for better monitoring of electricity consumption. Current analog meter is old and may not be accurate.',
    category: 'meter-installation',
    priority: 'low',
    status: 'open',
    region: 'Oromia',
    customerName: 'Chaltu Bekele',
    customerEmail: 'chaltu.bekele@gmail.com',
    customerPhone: '+251-913-345678',
    customerAddress: 'Adama, Oromia Region',
    meterNumber: 'ORM-003456',
    accountNumber: 'ACC-901678',
    createdBy: '4',
    createdAt: '2025-08-07T20:15:00Z',
    updatedAt: '2025-08-07T20:15:00Z',
    estimatedResolution: '2025-08-10T16:00:00Z',
    notes: 'Customer request logged; Scheduled for technical assessment; Waiting for meter availability'
  },
  {
    id: 'CMP-FIXED-004',
    title: 'Emergency Power Line Repair - Fixed',
    description: 'Fallen power line blocking main road after heavy storm. Creating traffic hazard and power outage for entire neighborhood. Immediate emergency response required.',
    category: 'line-damage',
    priority: 'critical',
    status: 'in-progress',
    region: 'Tigray',
    customerName: 'Haile Wolde',
    customerEmail: 'haile.wolde@gmail.com',
    customerPhone: '+251-914-456789',
    customerAddress: 'Mekelle, Tigray Region',
    meterNumber: 'TGR-004567',
    accountNumber: 'ACC-012789',
    assignedTo: '3',
    assignedBy: '1',
    createdBy: '4',
    createdAt: '2025-08-07T21:00:00Z',
    updatedAt: '2025-08-07T21:30:00Z',
    estimatedResolution: '2025-08-08T06:00:00Z',
    notes: 'Emergency response activated; Road blocked and secured; Repair crew en route; Estimated 9 hours for complete restoration'
  },
  {
    id: 'CMP-FIXED-005',
    title: 'Billing Dispute Resolution - Fixed',
    description: 'Customer received electricity bill showing 850 kWh consumption for this month, but average usage is typically 300 kWh. Requesting meter reading verification and bill correction.',
    category: 'billing-issue',
    priority: 'medium',
    status: 'open',
    region: 'SNNP',
    customerName: 'Meron Mulatu',
    customerEmail: 'meron.mulatu@gmail.com',
    customerPhone: '+251-915-567890',
    customerAddress: 'Hawassa, SNNP Region',
    meterNumber: 'SNP-005678',
    accountNumber: 'ACC-123890',
    createdBy: '4',
    createdAt: '2025-08-07T22:10:00Z',
    updatedAt: '2025-08-07T22:10:00Z',
    estimatedResolution: '2025-08-09T14:00:00Z',
    notes: 'Customer disputed billing amount; Meter reading verification scheduled; Previous bills reviewed for comparison'
  }
];

async function fixDataIssues() {
  console.log('🔧 Fixing complaint data issues...\n');

  for (const complaint of fixedComplaints) {
    const payload = {
      action: 'createComplaint',
      title: complaint.title,
      description: complaint.description,
      status: complaint.status,
      priority: complaint.priority,
      category: complaint.category,
      customerName: complaint.customerName,
      customerEmail: complaint.customerEmail,
      customerPhone: complaint.customerPhone,
      customerAddress: complaint.customerAddress,
      region: complaint.region,
      meterNumber: complaint.meterNumber,
      accountNumber: complaint.accountNumber,
      assignedTo: complaint.assignedTo || '',
      assignedBy: complaint.assignedBy || '',
      createdBy: complaint.createdBy || '',
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
      estimatedResolution: complaint.estimatedResolution || '',
      resolvedAt: complaint.resolvedAt || '',
      notes: complaint.notes || ''
    };
    
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log(`Complaint ${complaint.id} migration:`, data.success ? '✅ SUCCESS' : '❌ FAILED', data.error || '');
    } catch (error) {
      console.error(`❌ Error migrating complaint ${complaint.id}:`, error.message);
    }
    
    // Add a small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('\n🏁 Data issues fix completed!');
}

// Run the fix
fixDataIssues().catch(console.error);