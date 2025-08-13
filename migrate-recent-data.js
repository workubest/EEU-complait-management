import fetch from 'node-fetch';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6Do0ky06Pm6OtY62iTOuSWABmZsQAVdqtaXN27SQb8Hgtv_JqVuMPNdXKh-fW5bU/exec';

// Updated recent mock complaints with proper formatting
const recentComplaints = [
  {
    id: 'CMP-RECENT-001',
    title: 'Complete Power Outage in Kirkos Area',
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
    createdAt: '2025-08-05T08:30:00Z',
    updatedAt: '2025-08-05T08:30:00Z',
    estimatedResolution: '2025-08-05T16:00:00Z',
    notes: 'Initial report received from customer; Dispatched field team to investigate transformer issues'
  },
  {
    id: 'CMP-RECENT-002',
    title: 'Voltage Fluctuation Damaging Appliances',
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
    createdAt: '2025-08-04T14:20:00Z',
    updatedAt: '2025-08-05T09:15:00Z',
    estimatedResolution: '2025-08-06T12:00:00Z',
    notes: 'Customer reported appliance damage; Voltage regulator inspection scheduled; Temporary stabilizer provided to customer'
  },
  {
    id: 'CMP-RECENT-003',
    title: 'Smart Meter Installation Request',
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
    createdAt: '2025-08-07T10:15:00Z',
    updatedAt: '2025-08-07T10:15:00Z',
    estimatedResolution: '2025-08-10T16:00:00Z',
    notes: 'Customer request logged; Scheduled for technical assessment'
  },
  {
    id: 'CMP-RECENT-004',
    title: 'Frequent Power Interruptions',
    description: 'Experiencing frequent power cuts throughout the day, lasting 10-15 minutes each time. This is affecting our business operations and causing data loss.',
    category: 'power-quality',
    priority: 'high',
    status: 'in-progress',
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
    createdAt: '2025-08-07T14:30:00Z',
    updatedAt: '2025-08-07T15:45:00Z',
    estimatedResolution: '2025-08-08T12:00:00Z',
    notes: 'Pattern analysis initiated; Field team dispatched for grid inspection; Temporary UPS solution recommended'
  },
  {
    id: 'CMP-RECENT-005',
    title: 'Underground Cable Damage',
    description: 'Construction work in the area has damaged underground electrical cables. Multiple buildings in the block are without power.',
    category: 'infrastructure-damage',
    priority: 'critical',
    status: 'open',
    region: 'Amhara',
    customerName: 'Bereket Hailu',
    customerEmail: 'bereket.hailu@yahoo.com',
    customerPhone: '+251-912-234567',
    customerAddress: 'Bahir Dar, Amhara Region',
    meterNumber: 'AMR-002345',
    accountNumber: 'ACC-890567',
    assignedTo: '3',
    assignedBy: '1',
    createdBy: '4',
    createdAt: '2025-08-07T16:20:00Z',
    updatedAt: '2025-08-07T16:20:00Z',
    estimatedResolution: '2025-08-08T08:00:00Z',
    notes: 'Emergency response team notified; Area secured and marked; Coordination with construction company initiated'
  }
];

async function migrateRecentComplaints() {
  console.log('Starting migration of recent complaint data...');
  
  for (const complaint of recentComplaints) {
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
      console.log(`Complaint ${complaint.id} migration:`, data.success ? 'SUCCESS' : 'FAILED', data.error || '');
    } catch (error) {
      console.error(`Error migrating complaint ${complaint.id}:`, error.message);
    }
    
    // Add a small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('Recent complaint migration complete!');
}

// Run the migration
migrateRecentComplaints().catch(console.error);