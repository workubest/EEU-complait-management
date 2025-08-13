import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample data for seeding complaints
const complaintCategories = [
  'pole-fall',
  'prepaid-meter-issue',
  'postpaid-meter-malfunction',
  'wire-cut',
  'wire-sag',
  'no-supply-partial',
  'no-supply-total',
  'no-supply-single-house',
  'over-voltage',
  'under-voltage',
  'voltage-fluctuation',
  'transformer-issue',
  'breaker-problem',
  'billing-issue',
  'meter-reading-issue',
  'new-connection-request',
  'disconnection-request',
  'reconnection-request',
  'line-maintenance',
  'safety-concern',
  'other'
];

const priorities = ['low', 'medium', 'high', 'critical'];
const statuses = ['open', 'in-progress', 'resolved', 'escalated', 'closed'];

// Yeka woreda specific areas
const yekaAreas = [
  'Yeka Sub City, Woreda 01, Kebele 01/02',
  'Yeka Sub City, Woreda 01, Kebele 03/04',
  'Yeka Sub City, Woreda 01, Kebele 05/06',
  'Yeka Sub City, Woreda 01, Kebele 07/08',
  'Yeka Sub City, Woreda 01, Kebele 09/10',
  'Yeka Sub City, Woreda 02, Kebele 01/02',
  'Yeka Sub City, Woreda 02, Kebele 03/04',
  'Yeka Sub City, Woreda 02, Kebele 05/06',
  'Yeka Sub City, Woreda 02, Kebele 07/08',
  'Yeka Sub City, Woreda 02, Kebele 09/10',
  'Yeka Sub City, Woreda 03, Kebele 01/02',
  'Yeka Sub City, Woreda 03, Kebele 03/04',
  'Yeka Sub City, Woreda 03, Kebele 05/06',
  'Yeka Sub City, Woreda 03, Kebele 07/08',
  'Yeka Sub City, Woreda 03, Kebele 09/10'
];

// Sample customer names (Ethiopian names)
const customerNames = [
  'Abebe Kebede',
  'Almaz Tadesse',
  'Bekele Hailu',
  'Chaltu Negash',
  'Dawit Mekonnen',
  'Emebet Girma',
  'Fekadu Wolde',
  'Genet Assefa',
  'Haile Mariam',
  'Iyasu Tesfaye',
  'Kalkidan Desta',
  'Lemma Bekele',
  'Meron Tadele',
  'Negash Alemu',
  'Olana Gemechu',
  'Rahel Getachew',
  'Solomon Yohannes',
  'Tigist Mulugeta',
  'Worku Shiferaw',
  'Yeshi Abera',
  'Zelalem Teshome',
  'Birtukan Wolde',
  'Chala Regassa',
  'Desta Kebede',
  'Eyob Tesfaye',
  'Frehiwot Alemu',
  'Girma Tadesse',
  'Hanan Mohammed',
  'Ibrahim Hassan',
  'Jemal Ahmed'
];

// Complaint titles based on categories
const complaintTitles = {
  'pole-fall': [
    'Electric pole fell down blocking the road',
    'Damaged electric pole after heavy rain',
    'Pole collapsed near residential area',
    'Electric pole tilted dangerously'
  ],
  'prepaid-meter-issue': [
    'Prepaid meter not accepting tokens',
    'Meter display showing error message',
    'Unable to load credit to prepaid meter',
    'Prepaid meter stopped working suddenly'
  ],
  'postpaid-meter-malfunction': [
    'Postpaid meter reading incorrectly',
    'Meter not recording consumption properly',
    'Digital display not working on meter',
    'Meter making unusual sounds'
  ],
  'wire-cut': [
    'Power line cut by tree branch',
    'Electrical wire severed during construction',
    'Cut power cable causing outage',
    'Damaged wire after storm'
  ],
  'wire-sag': [
    'Low hanging electrical wires',
    'Sagging power lines pose safety risk',
    'Electrical cables hanging too low',
    'Wire sagging near building'
  ],
  'no-supply-partial': [
    'Partial power outage in the area',
    'Some houses without electricity',
    'Intermittent power supply',
    'Power available only in some rooms'
  ],
  'no-supply-total': [
    'Complete power outage in neighborhood',
    'No electricity for entire area',
    'Total blackout since yesterday',
    'Area-wide power failure'
  ],
  'no-supply-single-house': [
    'No power supply to my house only',
    'Single house electricity disconnected',
    'Power cut to individual residence',
    'House isolated from power grid'
  ],
  'over-voltage': [
    'High voltage damaging appliances',
    'Voltage fluctuation causing equipment damage',
    'Excessive voltage in power supply',
    'Over-voltage burning electrical devices'
  ],
  'under-voltage': [
    'Low voltage affecting appliances',
    'Insufficient power supply voltage',
    'Voltage too low for normal operation',
    'Under-voltage causing equipment malfunction'
  ],
  'voltage-fluctuation': [
    'Unstable voltage supply',
    'Power voltage keeps changing',
    'Fluctuating electricity voltage',
    'Irregular voltage affecting devices'
  ],
  'transformer-issue': [
    'Transformer making loud noise',
    'Smoking transformer in the area',
    'Transformer oil leakage',
    'Faulty transformer needs replacement'
  ],
  'breaker-problem': [
    'Circuit breaker keeps tripping',
    'Main breaker not working properly',
    'Electrical breaker needs repair',
    'Faulty breaker causing power cuts'
  ],
  'billing-issue': [
    'Incorrect electricity bill amount',
    'Billing discrepancy in monthly statement',
    'Overcharged in electricity bill',
    'Bill calculation error'
  ],
  'meter-reading-issue': [
    'Meter reader unable to access meter',
    'Incorrect meter reading recorded',
    'Meter reading not taken for months',
    'Dispute over meter reading'
  ],
  'new-connection-request': [
    'Request for new electricity connection',
    'New house needs power connection',
    'Application for electrical service',
    'New meter installation request'
  ],
  'disconnection-request': [
    'Request to disconnect electricity service',
    'Temporary disconnection needed',
    'Permanent service disconnection',
    'Stop electricity service request'
  ],
  'reconnection-request': [
    'Request to reconnect electricity',
    'Restore disconnected power service',
    'Reconnection after payment',
    'Resume electricity supply'
  ],
  'line-maintenance': [
    'Power line needs maintenance',
    'Electrical infrastructure repair needed',
    'Preventive maintenance request',
    'Line inspection and repair'
  ],
  'safety-concern': [
    'Exposed electrical wires safety hazard',
    'Dangerous electrical installation',
    'Safety risk from power equipment',
    'Electrical hazard in public area'
  ],
  'other': [
    'General electrical service inquiry',
    'Other electrical related issue',
    'Miscellaneous power supply problem',
    'Additional electrical concern'
  ]
};

// Generate random date within last 30 days
function getRandomDate() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime());
  return new Date(randomTime);
}

// Generate random phone number
function generatePhoneNumber() {
  const prefixes = ['091', '092', '093', '094', '097'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `+251${prefix}${number}`;
}

// Generate random email
function generateEmail(name) {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const username = name.toLowerCase().replace(/\s+/g, '.');
  return `${username}@${domain}`;
}

// Generate random account/meter numbers
function generateAccountNumber() {
  return Math.floor(Math.random() * 900000000) + 100000000; // 9-digit number
}

function generateMeterNumber() {
  return Math.floor(Math.random() * 90000000) + 10000000; // 8-digit number
}

// Generate complaint description based on category
function generateDescription(category, title) {
  const descriptions = {
    'pole-fall': [
      'The electric pole in our area has fallen down completely blocking the main road. This happened during the heavy rain last night. The fallen pole is creating a safety hazard for pedestrians and vehicles. Please send a team urgently to fix this issue.',
      'An electric pole has collapsed near our residential area. The pole appears to have been damaged by strong winds. There are exposed wires that pose a serious safety risk to the community. We need immediate attention to this matter.',
      'The electric pole on our street has tilted dangerously and looks like it might fall at any moment. This is causing great concern among residents. Please inspect and repair or replace the pole as soon as possible.'
    ],
    'prepaid-meter-issue': [
      'My prepaid electricity meter is not accepting the tokens I purchased. I have tried multiple times but the meter shows an error message. This is very inconvenient as I cannot load credit to get electricity. Please help resolve this issue.',
      'The prepaid meter display is showing strange error codes and not functioning properly. I bought tokens yesterday but cannot load them. The meter seems to have a technical problem that needs professional attention.',
      'Our prepaid electricity meter stopped working suddenly. It was working fine yesterday but today it does not respond to any tokens. The display is blank and we have no electricity. Please send a technician.'
    ],
    'postpaid-meter-malfunction': [
      'The postpaid electricity meter at our house is giving incorrect readings. It shows much higher consumption than our actual usage. This is affecting our monthly bills significantly. Please check and calibrate the meter.',
      'Our electricity meter is not recording consumption properly. Sometimes it runs very fast and sometimes it stops completely. This inconsistency is causing billing issues. We need a meter inspection and possible replacement.',
      'The digital display on our postpaid meter is not working. We cannot see our current consumption or any readings. The meter might still be working but we have no way to monitor our usage.'
    ],
    'wire-cut': [
      'A tree branch fell on the power line during the storm and cut the electrical wire. This has caused a power outage in our area. The cut wire is hanging dangerously and needs immediate repair for safety reasons.',
      'During construction work in our neighborhood, the electrical wire was accidentally severed. This has left several houses without power. Please send a repair team to fix the damaged cable.',
      'The power cable supplying our area has been cut, possibly by vandals. This has caused a complete blackout. We need urgent repair to restore electricity supply.'
    ],
    'wire-sag': [
      'The electrical wires in our area are hanging very low, almost touching the rooftops of houses. This creates a serious safety hazard, especially for children. Please raise the wires to a safe height.',
      'Power lines are sagging dangerously low near our building. During windy weather, the wires move and could potentially touch the building structure. This needs immediate attention for safety.',
      'The electrical cables on our street are hanging too low. Tall vehicles have difficulty passing under them. This is both a safety and traffic concern that needs to be addressed.'
    ],
    'no-supply-partial': [
      'We are experiencing partial power outage in our area. Some houses have electricity while others do not. This intermittent supply is very inconvenient and affects our daily activities. Please investigate and fix the problem.',
      'There is inconsistent power supply in our neighborhood. The electricity comes and goes randomly throughout the day. Some areas have power while others are in darkness. We need a stable power supply.',
      'Our area has been experiencing partial blackouts for the past few days. Only some sections have electricity while others remain without power. This uneven distribution needs to be corrected.'
    ],
    'no-supply-total': [
      'Our entire neighborhood has been without electricity for the past two days. This complete blackout is affecting all residents and businesses in the area. Please restore power supply urgently.',
      'There has been a total power failure in our area since yesterday evening. No houses or buildings have electricity. This is causing significant hardship for all residents. We need immediate restoration.',
      'Complete power outage has affected our entire district. All homes, shops, and offices are without electricity. This is severely impacting daily life and business operations.'
    ],
    'no-supply-single-house': [
      'Only our house seems to be without electricity while all neighboring houses have power. This appears to be an isolated issue with our connection. Please check our individual power supply line.',
      'Our house has been disconnected from the power grid while all other houses in the area have electricity. We are not sure why this happened. Please investigate and reconnect our supply.',
      'We are the only house in our area without electricity. All our neighbors have power but our house remains in darkness. This seems to be a specific problem with our connection.'
    ],
    'over-voltage': [
      'We are experiencing high voltage in our power supply which has already damaged some of our electrical appliances. The voltage seems to be much higher than normal. Please check and regulate the voltage supply.',
      'Excessive voltage in our electricity supply has burned out several electronic devices in our home. This over-voltage problem needs immediate attention to prevent further damage.',
      'The voltage in our area is too high and is causing damage to electrical equipment. Many neighbors are also experiencing the same problem. Please adjust the voltage to normal levels.'
    ],
    'under-voltage': [
      'The voltage in our power supply is too low. Our electrical appliances are not working properly due to insufficient voltage. Please check and increase the voltage to normal levels.',
      'We are experiencing low voltage problems. The electricity is there but it is not sufficient to run our appliances normally. Lights are dim and motors are not working properly.',
      'Under-voltage in our area is causing equipment malfunction. Many electrical devices are not operating correctly due to insufficient power supply voltage.'
    ],
    'voltage-fluctuation': [
      'The voltage in our power supply keeps fluctuating throughout the day. This unstable voltage is damaging our electrical devices and making them unreliable. Please stabilize the voltage.',
      'We are experiencing severe voltage fluctuations. The power keeps going up and down randomly. This is very harmful to our electronic equipment and needs to be fixed.',
      'Irregular voltage supply is affecting all electrical devices in our home. The voltage changes frequently causing lights to flicker and appliances to malfunction.'
    ],
    'transformer-issue': [
      'The transformer in our area is making very loud noises, especially at night. This is disturbing the peace and might indicate a serious problem. Please inspect and repair the transformer.',
      'We noticed smoke coming from the transformer near our house. This looks very dangerous and could cause a fire. Please send technicians immediately to check the transformer.',
      'There is oil leakage from the transformer in our neighborhood. The oil is dripping on the ground and creating an environmental hazard. Please fix this problem urgently.'
    ],
    'breaker-problem': [
      'Our main circuit breaker keeps tripping frequently without any apparent reason. This is causing repeated power cuts in our house. Please check and repair the breaker.',
      'The electrical breaker is not working properly. It does not trip when it should and sometimes trips unnecessarily. This is a safety concern that needs professional attention.',
      'We have a faulty breaker that is causing irregular power cuts. The breaker needs to be replaced or repaired to ensure stable electricity supply.'
    ],
    'billing-issue': [
      'Our monthly electricity bill shows an amount that is much higher than our normal consumption. We believe there is an error in the calculation. Please review and correct our bill.',
      'There is a discrepancy in our electricity bill. The amount charged does not match our actual usage. We need clarification and correction of the billing error.',
      'We have been overcharged in our electricity bill for the past two months. The consumption shown is impossible for our household size. Please investigate and adjust our bill.'
    ],
    'meter-reading-issue': [
      'The meter reader has not been able to access our electricity meter for the past three months due to a locked gate. We need to arrange a convenient time for meter reading.',
      'There seems to be an error in our meter reading. The consumption recorded is much higher than possible. Please re-read the meter and correct the records.',
      'Our electricity meter has not been read for several months. We are receiving estimated bills which are not accurate. Please arrange for proper meter reading.'
    ],
    'new-connection-request': [
      'We have built a new house and need electricity connection. We have completed all the necessary paperwork and are ready for installation. Please process our connection request.',
      'I am requesting a new electricity connection for my residential property. All construction work is complete and we need power supply. Please guide us through the connection process.',
      'We need a new electricity meter and connection for our newly constructed building. Please let us know the requirements and timeline for new connection.'
    ],
    'disconnection-request': [
      'We are moving out of this property and need to disconnect the electricity service. Please arrange for disconnection and final bill settlement.',
      'I request temporary disconnection of electricity service as the property will be vacant for several months. Please disconnect and stop billing.',
      'We need permanent disconnection of our electricity service. The building is being demolished. Please arrange for service termination.'
    ],
    'reconnection-request': [
      'Our electricity was disconnected due to unpaid bills. We have now cleared all dues and request reconnection of our power supply. Please restore our electricity.',
      'We need reconnection of our electricity service. The disconnection was temporary and we are ready to resume service. Please reconnect our power supply.',
      'Our power was disconnected for maintenance work. The work is now complete and we request restoration of our electricity connection.'
    ],
    'line-maintenance': [
      'The power lines in our area need maintenance. Some wires are old and worn out. Please schedule preventive maintenance to avoid future problems.',
      'We request inspection and maintenance of the electrical infrastructure in our neighborhood. Some equipment looks old and might need replacement.',
      'The electrical lines and equipment in our area require regular maintenance. Please arrange for inspection and necessary repairs.'
    ],
    'safety-concern': [
      'There are exposed electrical wires in our area that pose a serious safety hazard. Children play nearby and this is very dangerous. Please cover or repair the exposed wires immediately.',
      'We have identified a dangerous electrical installation that could cause accidents. The wiring is not properly insulated and is accessible to the public. Please make it safe.',
      'There is an electrical safety hazard in our neighborhood. Some power equipment is not properly secured and could be dangerous. Please inspect and make necessary safety improvements.'
    ],
    'other': [
      'We have a general inquiry about our electricity service. We need information about our account and billing. Please provide assistance.',
      'There is an electrical issue that does not fit into standard categories. We need technical support to identify and resolve the problem.',
      'We have a miscellaneous electrical concern that requires professional attention. Please send a technician to assess the situation.'
    ]
  };

  const categoryDescriptions = descriptions[category] || descriptions['other'];
  return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
}

// Generate seed data
function generateComplaintData(count = 50) {
  const complaints = [];
  
  for (let i = 0; i < count; i++) {
    const category = complaintCategories[Math.floor(Math.random() * complaintCategories.length)];
    const titles = complaintTitles[category];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
    const createdDate = getRandomDate();
    
    // Generate status based on how old the complaint is
    const daysSinceCreated = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));
    let status;
    if (daysSinceCreated < 1) status = 'open';
    else if (daysSinceCreated < 3) status = Math.random() > 0.5 ? 'open' : 'in-progress';
    else if (daysSinceCreated < 7) status = ['in-progress', 'resolved', 'escalated'][Math.floor(Math.random() * 3)];
    else status = ['resolved', 'closed'][Math.floor(Math.random() * 2)];
    
    // Generate priority based on category
    let priority;
    if (['pole-fall', 'wire-cut', 'no-supply-total', 'over-voltage', 'transformer-issue', 'safety-concern'].includes(category)) {
      priority = ['high', 'critical'][Math.floor(Math.random() * 2)];
    } else if (['no-supply-partial', 'no-supply-single-house', 'under-voltage', 'voltage-fluctuation', 'breaker-problem'].includes(category)) {
      priority = ['medium', 'high'][Math.floor(Math.random() * 2)];
    } else {
      priority = ['low', 'medium'][Math.floor(Math.random() * 2)];
    }
    
    const complaint = {
      id: `CMP-${String(i + 1).padStart(6, '0')}`,
      customer: {
        id: `CUST-${String(i + 1).padStart(6, '0')}`,
        name: customerName,
        email: generateEmail(customerName),
        phone: generatePhoneNumber(),
        address: yekaAreas[Math.floor(Math.random() * yekaAreas.length)],
        region: 'North Addis Ababa Region',
        serviceCenter: 'NAAR No.6',
        accountNumber: generateAccountNumber().toString(),
        meterNumber: generateMeterNumber().toString()
      },
      title: title,
      description: generateDescription(category, title),
      category: category,
      priority: priority,
      status: status,
      region: 'North Addis Ababa Region',
      serviceCenter: 'NAAR No.6',
      createdAt: createdDate.toISOString(),
      updatedAt: new Date(createdDate.getTime() + Math.random() * (new Date() - createdDate)).toISOString(),
      createdBy: 'system-seed',
      assignedTo: status !== 'open' ? `TECH-${Math.floor(Math.random() * 10) + 1}` : undefined,
      assignedBy: status !== 'open' ? 'MANAGER-1' : undefined,
      assignedAt: status !== 'open' ? new Date(createdDate.getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString() : undefined,
      resolvedAt: status === 'resolved' || status === 'closed' ? new Date(createdDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      closedAt: status === 'closed' ? new Date(createdDate.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      escalatedAt: status === 'escalated' ? new Date(createdDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      notes: status !== 'open' ? [
        {
          id: `NOTE-${i + 1}-1`,
          content: `Initial assessment completed. ${category.replace('-', ' ')} issue identified.`,
          createdBy: 'TECH-1',
          createdAt: new Date(createdDate.getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString()
        }
      ] : [],
      attachments: Math.random() > 0.7 ? [
        {
          id: `ATT-${i + 1}-1`,
          filename: `complaint_photo_${i + 1}.jpg`,
          url: `/uploads/complaint_photo_${i + 1}.jpg`,
          uploadedBy: 'system-seed',
          uploadedAt: createdDate.toISOString()
        }
      ] : []
    };
    
    complaints.push(complaint);
  }
  
  return complaints;
}

// Generate CSV format for easy import
function generateCSV(complaints) {
  const headers = [
    'ID', 'Customer Name', 'Customer Email', 'Customer Phone', 'Customer Address',
    'Region', 'Service Center', 'Account Number', 'Meter Number',
    'Title', 'Description', 'Category', 'Priority', 'Status',
    'Created At', 'Updated At', 'Created By', 'Assigned To', 'Assigned By'
  ];
  
  const rows = complaints.map(complaint => [
    complaint.id,
    complaint.customer.name,
    complaint.customer.email,
    complaint.customer.phone,
    complaint.customer.address,
    complaint.customer.region,
    complaint.customer.serviceCenter,
    complaint.customer.accountNumber,
    complaint.customer.meterNumber,
    complaint.title,
    complaint.description.replace(/"/g, '""'), // Escape quotes in description
    complaint.category,
    complaint.priority,
    complaint.status,
    complaint.createdAt,
    complaint.updatedAt,
    complaint.createdBy,
    complaint.assignedTo || '',
    complaint.assignedBy || ''
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
  
  return csvContent;
}

// Main execution
console.log('🌱 Generating complaint seed data...');

const complaints = generateComplaintData(100); // Generate 100 complaints
const jsonData = JSON.stringify(complaints, null, 2);
const csvData = generateCSV(complaints);

// Write JSON file
fs.writeFileSync(path.join(__dirname, 'seed-complaints.json'), jsonData);
console.log('✅ Generated seed-complaints.json with', complaints.length, 'complaints');

// Write CSV file
fs.writeFileSync(path.join(__dirname, 'seed-complaints.csv'), csvData);
console.log('✅ Generated seed-complaints.csv with', complaints.length, 'complaints');

// Generate summary statistics
const stats = {
  total: complaints.length,
  byCategory: {},
  byPriority: {},
  byStatus: {},
  byDate: {}
};

complaints.forEach(complaint => {
  // Category stats
  stats.byCategory[complaint.category] = (stats.byCategory[complaint.category] || 0) + 1;
  
  // Priority stats
  stats.byPriority[complaint.priority] = (stats.byPriority[complaint.priority] || 0) + 1;
  
  // Status stats
  stats.byStatus[complaint.status] = (stats.byStatus[complaint.status] || 0) + 1;
  
  // Date stats (by day)
  const date = complaint.createdAt.split('T')[0];
  stats.byDate[date] = (stats.byDate[date] || 0) + 1;
});

console.log('\n📊 Seed Data Statistics:');
console.log('Total Complaints:', stats.total);
console.log('\nBy Category:');
Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
  console.log(`  ${category}: ${count}`);
});

console.log('\nBy Priority:');
Object.entries(stats.byPriority).forEach(([priority, count]) => {
  console.log(`  ${priority}: ${count}`);
});

console.log('\nBy Status:');
Object.entries(stats.byStatus).forEach(([status, count]) => {
  console.log(`  ${status}: ${count}`);
});

console.log('\nBy Date (last 10 days):');
Object.entries(stats.byDate)
  .sort((a, b) => new Date(b[0]) - new Date(a[0]))
  .slice(0, 10)
  .forEach(([date, count]) => {
    console.log(`  ${date}: ${count}`);
  });

console.log('\n🎯 All complaints are set for:');
console.log('  Region: North Addis Ababa Region');
console.log('  Service Center: NAAR No.6');
console.log('  Area: Yeka Sub City (Woreda 01, 02, 03)');
console.log('  Date Range: Last 30 days with trend distribution');

console.log('\n📁 Files generated:');
console.log('  - seed-complaints.json (for API import)');
console.log('  - seed-complaints.csv (for spreadsheet import)');