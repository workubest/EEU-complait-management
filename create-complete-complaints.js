import fetch from 'node-fetch';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6Do0ky06Pm6OtY62iTOuSWABmZsQAVdqtaXN27SQb8Hgtv_JqVuMPNdXKh-fW5bU/exec';

// Complete complaints with all required fields
const completeComplaints = [
  {
    title: 'Power Outage in Bole District - Complete Data',
    description: 'Complete power outage affecting residential and commercial areas in Bole district. Multiple transformers appear to be down. Estimated 500+ households affected. Business operations severely impacted.',
    category: 'power-outage',
    priority: 'critical',
    status: 'open',
    customerName: 'Almaz Tesfaye',
    customerEmail: 'almaz.tesfaye@gmail.com',
    customerPhone: '+251-911-123456',
    customerAddress: 'Bole Sub-city, Addis Ababa',
    region: 'Addis Ababa',
    location: 'Addis Ababa',
    meterNumber: 'AAB-001234',
    accountNumber: 'ACC-789456',
    assignedTo: '5',
    assignedBy: '2',
    createdBy: '4',
    createdAt: '2025-08-07T23:30:00Z',
    updatedAt: '2025-08-07T23:30:00Z',
    estimatedResolution: '2025-08-08T18:00:00Z',
    notes: 'Emergency response activated; Multiple transformers down; Field team dispatched; Estimated 18 hours for full restoration'
  },
  {
    title: 'Voltage Fluctuation Damaging Equipment - Complete Data',
    description: 'Severe voltage fluctuations causing damage to sensitive electronic equipment. Multiple customers in the area reporting similar issues. Voltage readings show irregular patterns between 180V-260V.',
    category: 'voltage-fluctuation',
    priority: 'high',
    status: 'in-progress',
    customerName: 'Bereket Hailu',
    customerEmail: 'bereket.hailu@yahoo.com',
    customerPhone: '+251-912-234567',
    customerAddress: 'Bahir Dar, Amhara Region',
    region: 'Amhara',
    location: 'Amhara',
    meterNumber: 'AMR-002345',
    accountNumber: 'ACC-890567',
    assignedTo: '3',
    assignedBy: '2',
    createdBy: '4',
    createdAt: '2025-08-07T23:45:00Z',
    updatedAt: '2025-08-07T23:50:00Z',
    estimatedResolution: '2025-08-08T14:00:00Z',
    notes: 'Voltage regulator inspection completed; Replacement unit ordered; Temporary stabilizer provided to affected customers'
  },
  {
    title: 'Smart Meter Installation Request - Complete Data',
    description: 'Customer requesting upgrade from analog to smart meter for better consumption monitoring and billing accuracy. Current meter is over 15 years old and showing signs of wear.',
    category: 'meter-installation',
    priority: 'medium',
    status: 'open',
    customerName: 'Chaltu Bekele',
    customerEmail: 'chaltu.bekele@gmail.com',
    customerPhone: '+251-913-345678',
    customerAddress: 'Adama, Oromia Region',
    region: 'Oromia',
    location: 'Oromia',
    meterNumber: 'ORM-003456',
    accountNumber: 'ACC-901678',
    createdBy: '4',
    createdAt: '2025-08-08T00:15:00Z',
    updatedAt: '2025-08-08T00:15:00Z',
    estimatedResolution: '2025-08-12T16:00:00Z',
    notes: 'Customer eligibility verified; Smart meter availability confirmed; Installation scheduled for next week'
  },
  {
    title: 'Emergency Line Repair After Storm - Complete Data',
    description: 'High-voltage transmission line damaged by severe storm. Line is down across main highway creating safety hazard and power outage for entire district. Emergency crews on standby.',
    category: 'line-damage',
    priority: 'critical',
    status: 'in-progress',
    customerName: 'Haile Wolde',
    customerEmail: 'haile.wolde@gmail.com',
    customerPhone: '+251-914-456789',
    customerAddress: 'Mekelle, Tigray Region',
    region: 'Tigray',
    location: 'Tigray',
    meterNumber: 'TGR-004567',
    accountNumber: 'ACC-012789',
    assignedTo: '3',
    assignedBy: '1',
    createdBy: '4',
    createdAt: '2025-08-08T01:00:00Z',
    updatedAt: '2025-08-08T01:30:00Z',
    estimatedResolution: '2025-08-08T08:00:00Z',
    notes: 'Emergency response team deployed; Highway traffic diverted; Specialized equipment en route; Safety perimeter established'
  },
  {
    title: 'Billing Discrepancy Investigation - Complete Data',
    description: 'Customer disputing monthly bill showing unusually high consumption (950 kWh vs typical 280 kWh). Requesting meter reading verification and consumption history analysis.',
    category: 'billing-issue',
    priority: 'medium',
    status: 'open',
    customerName: 'Meron Mulatu',
    customerEmail: 'meron.mulatu@gmail.com',
    customerPhone: '+251-915-567890',
    customerAddress: 'Hawassa, SNNP Region',
    region: 'SNNP',
    location: 'SNNP',
    meterNumber: 'SNP-005678',
    accountNumber: 'ACC-123890',
    createdBy: '4',
    createdAt: '2025-08-08T02:10:00Z',
    updatedAt: '2025-08-08T02:10:00Z',
    estimatedResolution: '2025-08-10T16:00:00Z',
    notes: 'Billing history reviewed; Meter reading verification scheduled; Consumption pattern analysis initiated'
  }
];

async function createCompleteComplaints() {
  console.log('🚀 Creating complaints with complete data...\n');

  for (const complaint of completeComplaints) {
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createComplaint',
          ...complaint
        }),
      });
      
      const data = await response.json();
      console.log(`Complaint "${complaint.title.substring(0, 40)}...":`, data.success ? '✅ SUCCESS' : '❌ FAILED', data.error || '');
      
      if (data.success && data.complaint) {
        console.log(`   ID: ${data.complaint.ID}`);
        console.log(`   Customer: ${data.complaint['Customer Name']}`);
        console.log(`   Region: ${data.complaint.Region || 'Not set'}`);
        console.log(`   Phone: ${data.complaint['Customer Phone']}`);
        console.log('');
      }
      
    } catch (error) {
      console.error(`❌ Error creating complaint "${complaint.title}":`, error.message);
    }
    
    // Add delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('🏁 Complete complaints creation finished!');
}

createCompleteComplaints();