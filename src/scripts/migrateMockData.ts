
async function getMockData() {
  // Dynamic import for compatibility with both ESM and CJS
  const mod = await import('../data/mockData.js');
  return { mockUsers: mod.mockUsers, mockComplaints: mod.mockComplaints };
}

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6Do0ky06Pm6OtY62iTOuSWABmZsQAVdqtaXN27SQb8Hgtv_JqVuMPNdXKh-fW5bU/exec';

async function migrateUsers(mockUsers) {
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
      console.error(`Error migrating user ${user.name}:`, error);
    }
    
    // Add a small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

async function migrateComplaints(mockComplaints) {
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
      console.error(`Error migrating complaint ${complaint.id}:`, error);
    }
    
    // Add a small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

async function migrateAll() {
  const { mockUsers, mockComplaints } = await getMockData();
  await migrateUsers(mockUsers);
  await migrateComplaints(mockComplaints);
  console.log('Migration complete!');
}

migrateAll();
