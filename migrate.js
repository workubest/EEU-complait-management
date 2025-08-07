import fetch from 'node-fetch';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6Do0ky06Pm6OtY62iTOuSWABmZsQAVdqtaXN27SQb8Hgtv_JqVuMPNdXKh-fW5bU/exec';

// Mock data
const mockUsers = [
  {
    id: '1',
    name: 'Abebe Kebede',
    email: 'admin@eeu.gov.et',
    role: 'admin',
    region: 'Addis Ababa',
    department: 'System Administration',
    phone: '+251-11-123-4567',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Tigist Haile',
    email: 'manager@eeu.gov.et',
    role: 'manager',
    region: 'Oromia',
    department: 'Regional Management',
    phone: '+251-11-234-5678',
    isActive: true,
    createdAt: '2024-01-02'
  },
  {
    id: '3',
    name: 'Getachew Tadesse',
    email: 'foreman@eeu.gov.et',
    role: 'foreman',
    region: 'Amhara',
    department: 'Field Operations',
    phone: '+251-11-345-6789',
    isActive: true,
    createdAt: '2024-01-03'
  },
  {
    id: '4',
    name: 'Meron Tesfaye',
    email: 'operator@eeu.gov.et',
    role: 'call-attendant',
    region: 'Addis Ababa',
    department: 'Control Room',
    phone: '+251-11-456-7890',
    isActive: true,
    createdAt: '2024-01-04'
  },
  {
    id: '5',
    name: 'Dawit Solomon',
    email: 'technician@eeu.gov.et',
    role: 'technician',
    region: 'Addis Ababa',
    department: 'Field Service',
    phone: '+251-11-567-8901',
    isActive: true,
    createdAt: '2024-01-05'
  }
];

const mockComplaints = [
  {
    id: 'CMP-001',
    customerId: '1',
    customer: {
      id: '1',
      name: 'Almaz Tesfaye',
      email: 'almaz.tesfaye@gmail.com',
      phone: '+251-911-123456',
      address: 'Kirkos Sub-city, Addis Ababa',
      region: 'Addis Ababa',
      meterNumber: 'AAM-001234',
      accountNumber: 'ACC-789456'
    },
    title: 'Complete Power Outage in Kirkos Area',
    description: 'There has been no electricity in our area for the past 6 hours. Multiple households are affected. This is causing significant inconvenience especially for our home-based business.',
    category: 'power-outage',
    priority: 'high',
    status: 'open',
    region: 'Addis Ababa',
    assignedTo: '5',
    assignedBy: '2',
    createdBy: '4',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
    estimatedResolution: '2024-01-15T16:00:00Z',
    notes: [
      'Initial report received from customer',
      'Dispatched field team to investigate transformer issues'
    ]
  },
  {
    id: 'CMP-002',
    customerId: '2',
    customer: {
      id: '2',
      name: 'Bereket Hailu',
      email: 'bereket.hailu@yahoo.com',
      phone: '+251-912-234567',
      address: 'Bahir Dar, Amhara Region',
      region: 'Amhara',
      meterNumber: 'AMR-002345',
      accountNumber: 'ACC-890567'
    },
    title: 'Voltage Fluctuation Damaging Appliances',
    description: 'Experiencing severe voltage fluctuations that have already damaged our refrigerator and television. The voltage seems to drop and spike randomly throughout the day.',
    category: 'voltage-fluctuation',
    priority: 'medium',
    status: 'in-progress',
    region: 'Amhara',
    assignedTo: '3',
    assignedBy: '2',
    createdBy: '4',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    estimatedResolution: '2024-01-16T12:00:00Z',
    notes: [
      'Customer reported appliance damage',
      'Voltage regulator inspection scheduled',
      'Temporary stabilizer provided to customer'
    ]
  },
  {
    id: 'CMP-003',
    customerId: '3',
    customer: {
      id: '3',
      name: 'Chaltu Bekele',
      email: 'chaltu.bekele@gmail.com',
      phone: '+251-913-345678',
      address: 'Adama, Oromia Region',
      region: 'Oromia',
      meterNumber: 'ORM-003456',
      accountNumber: 'ACC-901678'
    },
    title: 'Incorrect Billing Amount',
    description: 'My electricity bill shows consumption of 450 kWh for this month, but my average usage is only around 200 kWh. I believe there might be a meter reading error.',
    category: 'billing-issue',
    priority: 'low',
    status: 'resolved',
    region: 'Oromia',
    createdBy: '4',
    createdAt: '2024-01-10T11:45:00Z',
    updatedAt: '2024-01-14T16:30:00Z',
    resolvedAt: '2024-01-14T16:30:00Z',
    notes: [
      'Customer disputed billing amount',
      'Meter reading verified on-site',
      'Billing error confirmed and corrected',
      'Refund processed for overcharge'
    ]
  },
  {
    id: 'CMP-004',
    customerId: '1',
    customer: {
      id: '1',
      name: 'Almaz Tesfaye',
      email: 'almaz.tesfaye@gmail.com',
      phone: '+251-911-123456',
      address: 'Kirkos Sub-city, Addis Ababa',
      region: 'Addis Ababa',
      meterNumber: 'AAM-001234',
      accountNumber: 'ACC-789456'
    },
    title: 'Street Light Not Working',
    description: 'The street light in front of our building has been off for two weeks. This is creating safety concerns for our neighborhood, especially for children and elderly residents.',
    category: 'safety-concern',
    priority: 'medium',
    status: 'open',
    region: 'Addis Ababa',
    createdBy: '4',
    createdAt: '2024-01-13T19:00:00Z',
    updatedAt: '2024-01-13T19:00:00Z',
    estimatedResolution: '2024-01-17T12:00:00Z',
    notes: [
      'Safety concern reported by community',
      'Added to maintenance priority list'
    ]
  },
  {
    id: 'CMP-005',
    customerId: '2',
    customer: {
      id: '2',
      name: 'Bereket Hailu',
      email: 'bereket.hailu@yahoo.com',
      phone: '+251-912-234567',
      address: 'Bahir Dar, Amhara Region',
      region: 'Amhara',
      meterNumber: 'AMR-002345',
      accountNumber: 'ACC-890567'
    },
    title: 'Damaged Power Line After Storm',
    description: 'Heavy winds last night brought down a power line near our compound. The line is currently on the ground creating a hazardous situation. Immediate attention required.',
    category: 'line-damage',
    priority: 'critical',
    status: 'in-progress',
    region: 'Amhara',
    assignedTo: '3',
    assignedBy: '1',
    createdBy: '4',
    createdAt: '2024-01-15T06:00:00Z',
    updatedAt: '2024-01-15T07:30:00Z',
    estimatedResolution: '2024-01-15T14:00:00Z',
    notes: [
      'Emergency response activated',
      'Area cordoned off for safety',
      'Emergency repair crew dispatched',
      'Estimated 8 hours for complete restoration'
    ]
  }
];

async function migrateUsers() {
  console.log('Starting user migration...');
  for (const user of mockUsers) {
    const payload = {
      action: 'createUser',
      name: user.name,
      email: user.email,
      role: user.role,
      region: user.region,
      department: user.department,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
    
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log(`User ${user.name} migration:`, data.success ? 'SUCCESS' : 'FAILED', data.error || '');
    } catch (error) {
      console.error(`Error migrating user ${user.name}:`, error.message);
    }
    
    // Add a small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

async function migrateComplaints() {
  console.log('Starting complaint migration...');
  for (const complaint of mockComplaints) {
    const payload = {
      action: 'createComplaint',
      title: complaint.title,
      description: complaint.description,
      status: complaint.status,
      priority: complaint.priority,
      category: complaint.category,
      customerName: complaint.customer.name,
      customerEmail: complaint.customer.email,
      customerPhone: complaint.customer.phone,
      customerAddress: complaint.customer.address,
      region: complaint.region,
      meterNumber: complaint.customer.meterNumber,
      accountNumber: complaint.customer.accountNumber,
      assignedTo: complaint.assignedTo || '',
      assignedBy: complaint.assignedBy || '',
      createdBy: complaint.createdBy || '',
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
      estimatedResolution: complaint.estimatedResolution || '',
      resolvedAt: complaint.resolvedAt || '',
      notes: complaint.notes ? complaint.notes.join('; ') : ''
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
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

async function migrateAll() {
  console.log('Starting migration process...');
  await migrateUsers();
  await migrateComplaints();
  console.log('Migration complete!');
}

migrateAll().catch(console.error);