/**
 * Google Apps Script for generating complaint seed data
 * This script creates realistic complaint data for the Ethiopian Electric Utility system
 * All complaints are set for North Addis Ababa Region, NAAR No.6 service center, Yeka woreda
 */

function generateComplaintSeedData() {
  console.log('🌱 Starting complaint seed data generation...');
  
  // Get or create the spreadsheet
  const spreadsheet = getOrCreateSeedDataSheet();
  const sheet = spreadsheet.getActiveSheet();
  
  // Generate the seed data
  const complaints = generateComplaints(100); // Generate 100 complaints
  
  // Write data to sheet
  writeComplaintsToSheet(sheet, complaints);
  
  // Generate statistics
  const stats = generateStatistics(complaints);
  logStatistics(stats);
  
  console.log('✅ Seed data generation completed!');
  console.log(`📊 Generated ${complaints.length} complaints in spreadsheet: ${spreadsheet.getUrl()}`);
  
  return {
    spreadsheetUrl: spreadsheet.getUrl(),
    totalComplaints: complaints.length,
    statistics: stats
  };
}

function getOrCreateSeedDataSheet() {
  const sheetName = 'Complaint_Seed_Data';
  
  try {
    // Try to get existing spreadsheet
    let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }
    
    return spreadsheet;
  } catch (error) {
    // Create new spreadsheet if none exists
    const spreadsheet = SpreadsheetApp.create('Ethiopian Electric Utility - Complaint Seed Data');
    const sheet = spreadsheet.getActiveSheet();
    sheet.setName(sheetName);
    return spreadsheet;
  }
}

function generateComplaints(count) {
  const complaints = [];
  
  for (let i = 0; i < count; i++) {
    const category = getRandomComplaintCategory();
    const title = getRandomComplaintTitle(category);
    const customerName = getRandomCustomerName();
    const createdDate = getRandomDate();
    
    // Generate status based on how old the complaint is
    const daysSinceCreated = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));
    const status = getStatusBasedOnAge(daysSinceCreated);
    
    // Generate priority based on category
    const priority = getPriorityBasedOnCategory(category);
    
    const complaint = {
      id: `CMP-${String(i + 1).padStart(6, '0')}`,
      customerName: customerName,
      customerEmail: generateEmail(customerName),
      customerPhone: generatePhoneNumber(),
      customerAddress: getRandomYekaAddress(),
      region: 'North Addis Ababa Region',
      serviceCenter: 'NAAR No.6',
      accountNumber: generateAccountNumber(),
      meterNumber: generateMeterNumber(),
      title: title,
      description: generateDescription(category, title),
      category: category,
      priority: priority,
      status: status,
      createdAt: createdDate,
      updatedAt: new Date(createdDate.getTime() + Math.random() * (new Date() - createdDate)),
      createdBy: 'system-seed',
      assignedTo: status !== 'open' ? `TECH-${Math.floor(Math.random() * 10) + 1}` : '',
      assignedBy: status !== 'open' ? 'MANAGER-1' : '',
      assignedAt: status !== 'open' ? new Date(createdDate.getTime() + Math.random() * 24 * 60 * 60 * 1000) : '',
      resolvedAt: (status === 'resolved' || status === 'closed') ? new Date(createdDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : '',
      closedAt: status === 'closed' ? new Date(createdDate.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000) : '',
      escalatedAt: status === 'escalated' ? new Date(createdDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000) : '',
      notes: status !== 'open' ? `Initial assessment completed. ${category.replace('-', ' ')} issue identified.` : ''
    };
    
    complaints.push(complaint);
  }
  
  return complaints;
}

function getRandomComplaintCategory() {
  const categories = [
    'pole-fall', 'prepaid-meter-issue', 'postpaid-meter-malfunction', 'wire-cut', 'wire-sag',
    'no-supply-partial', 'no-supply-total', 'no-supply-single-house', 'over-voltage', 'under-voltage',
    'voltage-fluctuation', 'transformer-issue', 'breaker-problem', 'billing-issue', 'meter-reading-issue',
    'new-connection-request', 'disconnection-request', 'reconnection-request', 'line-maintenance',
    'safety-concern', 'other'
  ];
  return categories[Math.floor(Math.random() * categories.length)];
}

function getRandomComplaintTitle(category) {
  const titles = {
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
  
  const categoryTitles = titles[category] || titles['other'];
  return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
}

function getRandomCustomerName() {
  const names = [
    'Abebe Kebede', 'Almaz Tadesse', 'Bekele Hailu', 'Chaltu Negash', 'Dawit Mekonnen',
    'Emebet Girma', 'Fekadu Wolde', 'Genet Assefa', 'Haile Mariam', 'Iyasu Tesfaye',
    'Kalkidan Desta', 'Lemma Bekele', 'Meron Tadele', 'Negash Alemu', 'Olana Gemechu',
    'Rahel Getachew', 'Solomon Yohannes', 'Tigist Mulugeta', 'Worku Shiferaw', 'Yeshi Abera',
    'Zelalem Teshome', 'Birtukan Wolde', 'Chala Regassa', 'Desta Kebede', 'Eyob Tesfaye',
    'Frehiwot Alemu', 'Girma Tadesse', 'Hanan Mohammed', 'Ibrahim Hassan', 'Jemal Ahmed'
  ];
  return names[Math.floor(Math.random() * names.length)];
}

function getRandomYekaAddress() {
  const addresses = [
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
  return addresses[Math.floor(Math.random() * addresses.length)];
}

function getRandomDate() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime());
  return new Date(randomTime);
}

function generatePhoneNumber() {
  const prefixes = ['091', '092', '093', '094', '097'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `+251${prefix}${number}`;
}

function generateEmail(name) {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const username = name.toLowerCase().replace(/\s+/g, '.');
  return `${username}@${domain}`;
}

function generateAccountNumber() {
  return Math.floor(Math.random() * 900000000) + 100000000; // 9-digit number
}

function generateMeterNumber() {
  return Math.floor(Math.random() * 90000000) + 10000000; // 8-digit number
}

function getStatusBasedOnAge(daysSinceCreated) {
  if (daysSinceCreated < 1) return 'open';
  else if (daysSinceCreated < 3) return Math.random() > 0.5 ? 'open' : 'in-progress';
  else if (daysSinceCreated < 7) {
    const statuses = ['in-progress', 'resolved', 'escalated'];
    return statuses[Math.floor(Math.random() * 3)];
  } else {
    const statuses = ['resolved', 'closed'];
    return statuses[Math.floor(Math.random() * 2)];
  }
}

function getPriorityBasedOnCategory(category) {
  const criticalCategories = ['pole-fall', 'wire-cut', 'no-supply-total', 'over-voltage', 'transformer-issue', 'safety-concern'];
  const highCategories = ['no-supply-partial', 'no-supply-single-house', 'under-voltage', 'voltage-fluctuation', 'breaker-problem'];
  
  if (criticalCategories.includes(category)) {
    const priorities = ['high', 'critical'];
    return priorities[Math.floor(Math.random() * 2)];
  } else if (highCategories.includes(category)) {
    const priorities = ['medium', 'high'];
    return priorities[Math.floor(Math.random() * 2)];
  } else {
    const priorities = ['low', 'medium'];
    return priorities[Math.floor(Math.random() * 2)];
  }
}

function generateDescription(category, title) {
  const descriptions = {
    'pole-fall': [
      'The electric pole in our area has fallen down completely blocking the main road. This happened during the heavy rain last night. The fallen pole is creating a safety hazard for pedestrians and vehicles. Please send a team urgently to fix this issue.',
      'An electric pole has collapsed near our residential area. The pole appears to have been damaged by strong winds. There are exposed wires that pose a serious safety risk to the community. We need immediate attention to this matter.'
    ],
    'prepaid-meter-issue': [
      'My prepaid electricity meter is not accepting the tokens I purchased. I have tried multiple times but the meter shows an error message. This is very inconvenient as I cannot load credit to get electricity. Please help resolve this issue.',
      'The prepaid meter display is showing strange error codes and not functioning properly. I bought tokens yesterday but cannot load them. The meter seems to have a technical problem that needs professional attention.'
    ],
    'postpaid-meter-malfunction': [
      'The postpaid electricity meter at our house is giving incorrect readings. It shows much higher consumption than our actual usage. This is affecting our monthly bills significantly. Please check and calibrate the meter.',
      'Our electricity meter is not recording consumption properly. Sometimes it runs very fast and sometimes it stops completely. This inconsistency is causing billing issues. We need a meter inspection and possible replacement.'
    ],
    'wire-cut': [
      'A tree branch fell on the power line during the storm and cut the electrical wire. This has caused a power outage in our area. The cut wire is hanging dangerously and needs immediate repair for safety reasons.',
      'During construction work in our neighborhood, the electrical wire was accidentally severed. This has left several houses without power. Please send a repair team to fix the damaged cable.'
    ],
    'wire-sag': [
      'The electrical wires in our area are hanging very low, almost touching the rooftops of houses. This creates a serious safety hazard, especially for children. Please raise the wires to a safe height.',
      'Power lines are sagging dangerously low near our building. During windy weather, the wires move and could potentially touch the building structure. This needs immediate attention for safety.'
    ],
    'no-supply-partial': [
      'We are experiencing partial power outage in our area. Some houses have electricity while others do not. This intermittent supply is very inconvenient and affects our daily activities. Please investigate and fix the problem.',
      'There is inconsistent power supply in our neighborhood. The electricity comes and goes randomly throughout the day. Some areas have power while others are in darkness. We need a stable power supply.'
    ],
    'no-supply-total': [
      'Our entire neighborhood has been without electricity for the past two days. This complete blackout is affecting all residents and businesses in the area. Please restore power supply urgently.',
      'There has been a total power failure in our area since yesterday evening. No houses or buildings have electricity. This is causing significant hardship for all residents. We need immediate restoration.'
    ],
    'no-supply-single-house': [
      'Only our house seems to be without electricity while all neighboring houses have power. This appears to be an isolated issue with our connection. Please check our individual power supply line.',
      'Our house has been disconnected from the power grid while all other houses in the area have electricity. We are not sure why this happened. Please investigate and reconnect our supply.'
    ],
    'over-voltage': [
      'We are experiencing high voltage in our power supply which has already damaged some of our electrical appliances. The voltage seems to be much higher than normal. Please check and regulate the voltage supply.',
      'Excessive voltage in our electricity supply has burned out several electronic devices in our home. This over-voltage problem needs immediate attention to prevent further damage.'
    ],
    'under-voltage': [
      'The voltage in our power supply is too low. Our electrical appliances are not working properly due to insufficient voltage. Please check and increase the voltage to normal levels.',
      'We are experiencing low voltage problems. The electricity is there but it is not sufficient to run our appliances normally. Lights are dim and motors are not working properly.'
    ],
    'voltage-fluctuation': [
      'The voltage in our power supply keeps fluctuating throughout the day. This unstable voltage is damaging our electrical devices and making them unreliable. Please stabilize the voltage.',
      'We are experiencing severe voltage fluctuations. The power keeps going up and down randomly. This is very harmful to our electronic equipment and needs to be fixed.'
    ],
    'transformer-issue': [
      'The transformer in our area is making very loud noises, especially at night. This is disturbing the peace and might indicate a serious problem. Please inspect and repair the transformer.',
      'We noticed smoke coming from the transformer near our house. This looks very dangerous and could cause a fire. Please send technicians immediately to check the transformer.'
    ],
    'breaker-problem': [
      'Our main circuit breaker keeps tripping frequently without any apparent reason. This is causing repeated power cuts in our house. Please check and repair the breaker.',
      'The electrical breaker is not working properly. It does not trip when it should and sometimes trips unnecessarily. This is a safety concern that needs professional attention.'
    ],
    'billing-issue': [
      'Our monthly electricity bill shows an amount that is much higher than our normal consumption. We believe there is an error in the calculation. Please review and correct our bill.',
      'There is a discrepancy in our electricity bill. The amount charged does not match our actual usage. We need clarification and correction of the billing error.'
    ],
    'meter-reading-issue': [
      'The meter reader has not been able to access our electricity meter for the past three months due to a locked gate. We need to arrange a convenient time for meter reading.',
      'There seems to be an error in our meter reading. The consumption recorded is much higher than possible. Please re-read the meter and correct the records.'
    ],
    'new-connection-request': [
      'We have built a new house and need electricity connection. We have completed all the necessary paperwork and are ready for installation. Please process our connection request.',
      'I am requesting a new electricity connection for my residential property. All construction work is complete and we need power supply. Please guide us through the connection process.'
    ],
    'disconnection-request': [
      'We are moving out of this property and need to disconnect the electricity service. Please arrange for disconnection and final bill settlement.',
      'I request temporary disconnection of electricity service as the property will be vacant for several months. Please disconnect and stop billing.'
    ],
    'reconnection-request': [
      'Our electricity was disconnected due to unpaid bills. We have now cleared all dues and request reconnection of our power supply. Please restore our electricity.',
      'We need reconnection of our electricity service. The disconnection was temporary and we are ready to resume service. Please reconnect our power supply.'
    ],
    'line-maintenance': [
      'The power lines in our area need maintenance. Some wires are old and worn out. Please schedule preventive maintenance to avoid future problems.',
      'We request inspection and maintenance of the electrical infrastructure in our neighborhood. Some equipment looks old and might need replacement.'
    ],
    'safety-concern': [
      'There are exposed electrical wires in our area that pose a serious safety hazard. Children play nearby and this is very dangerous. Please cover or repair the exposed wires immediately.',
      'We have identified a dangerous electrical installation that could cause accidents. The wiring is not properly insulated and is accessible to the public. Please make it safe.'
    ],
    'other': [
      'We have a general inquiry about our electricity service. We need information about our account and billing. Please provide assistance.',
      'There is an electrical issue that does not fit into standard categories. We need technical support to identify and resolve the problem.'
    ]
  };
  
  const categoryDescriptions = descriptions[category] || descriptions['other'];
  return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
}

function writeComplaintsToSheet(sheet, complaints) {
  // Clear existing content
  sheet.clear();
  
  // Set headers
  const headers = [
    'ID', 'Customer Name', 'Customer Email', 'Customer Phone', 'Customer Address',
    'Region', 'Service Center', 'Account Number', 'Meter Number',
    'Title', 'Description', 'Category', 'Priority', 'Status',
    'Created At', 'Updated At', 'Created By', 'Assigned To', 'Assigned By',
    'Assigned At', 'Resolved At', 'Closed At', 'Escalated At', 'Notes'
  ];
  
  // Write headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  
  // Prepare data rows
  const rows = complaints.map(complaint => [
    complaint.id,
    complaint.customerName,
    complaint.customerEmail,
    complaint.customerPhone,
    complaint.customerAddress,
    complaint.region,
    complaint.serviceCenter,
    complaint.accountNumber,
    complaint.meterNumber,
    complaint.title,
    complaint.description,
    complaint.category,
    complaint.priority,
    complaint.status,
    complaint.createdAt,
    complaint.updatedAt,
    complaint.createdBy,
    complaint.assignedTo,
    complaint.assignedBy,
    complaint.assignedAt,
    complaint.resolvedAt,
    complaint.closedAt,
    complaint.escalatedAt,
    complaint.notes
  ]);
  
  // Write data
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  console.log(`✅ Written ${complaints.length} complaints to sheet`);
}

function generateStatistics(complaints) {
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
    const date = complaint.createdAt.toISOString().split('T')[0];
    stats.byDate[date] = (stats.byDate[date] || 0) + 1;
  });
  
  return stats;
}

function logStatistics(stats) {
  console.log('\n📊 Seed Data Statistics:');
  console.log('Total Complaints:', stats.total);
  
  console.log('\nBy Category:');
  Object.entries(stats.byCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
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
}

/**
 * Helper function to create a summary sheet with statistics
 */
function createSummarySheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let summarySheet = spreadsheet.getSheetByName('Summary_Statistics');
  
  if (!summarySheet) {
    summarySheet = spreadsheet.insertSheet('Summary_Statistics');
  }
  
  summarySheet.clear();
  
  // Add summary information
  const summaryData = [
    ['Ethiopian Electric Utility - Complaint Seed Data Summary', ''],
    ['', ''],
    ['Generated On:', new Date()],
    ['Total Complaints:', '100'],
    ['Region:', 'North Addis Ababa Region'],
    ['Service Center:', 'NAAR No.6'],
    ['Location:', 'Yeka Sub City (Woreda 01, 02, 03)'],
    ['Date Range:', 'Last 30 days'],
    ['', ''],
    ['Data Specifications:', ''],
    ['- 21 complaint categories included', ''],
    ['- 4 priority levels (Low, Medium, High, Critical)', ''],
    ['- 5 status types (Open, In-Progress, Resolved, Escalated, Closed)', ''],
    ['- 30 Ethiopian customer names', ''],
    ['- Ethiopian phone number format (+251-09X-XXXXXXX)', ''],
    ['- 15 different Yeka Sub City addresses', ''],
    ['- Realistic account and meter numbers', ''],
    ['- Trend distribution across 30 days', ''],
    ['', ''],
    ['Usage Instructions:', ''],
    ['1. Use the Complaint_Seed_Data sheet for analysis', ''],
    ['2. Create pivot tables and charts for reporting', ''],
    ['3. Export data for use in other systems', ''],
    ['4. Modify the generateComplaintSeedData() function to customize data', '']
  ];
  
  summarySheet.getRange(1, 1, summaryData.length, 2).setValues(summaryData);
  
  // Format the summary sheet
  summarySheet.getRange(1, 1).setFontSize(14).setFontWeight('bold');
  summarySheet.getRange(3, 1, 6, 1).setFontWeight('bold');
  summarySheet.getRange(10, 1).setFontWeight('bold');
  summarySheet.getRange(20, 1).setFontWeight('bold');
  
  summarySheet.autoResizeColumns(1, 2);
  
  console.log('✅ Created summary sheet with statistics and instructions');
}

/**
 * Main function to run everything
 */
function runCompleteSeeding() {
  console.log('🚀 Starting complete complaint seeding process...');
  
  const result = generateComplaintSeedData();
  createSummarySheet();
  
  console.log('\n🎉 Complete seeding process finished!');
  console.log(`📊 Spreadsheet URL: ${result.spreadsheetUrl}`);
  console.log('📋 Check the Summary_Statistics sheet for detailed information');
  
  return result;
}