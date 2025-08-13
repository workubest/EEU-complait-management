/**
 * Google Apps Script: Mock Data Migration to Sheets
 * 
 * This script migrates all mock data from the frontend to Google Sheets
 * and provides functions to manage the data in Google Sheets.
 */

const SHEET_ID = '1vi7SguM67N8BP5_5dNSPh4GO0WDe-Y6_LwfY-GliW0o'; // Update with your sheet ID

// Mock data from the frontend
const mockData = {
  users: [
    {
      ID: 'USR-001',
      Name: 'Abebe Kebede',
      Email: 'admin@eeu.gov.et',
      Password: 'admin123',
      Role: 'admin',
      Region: 'Addis Ababa',
      Department: 'System Administration',
      Phone: '+251-11-123-4567',
      'Is Active': true,
      'Created At': '2025-01-01T00:00:00Z',
      'Updated At': '2025-01-01T00:00:00Z'
    },
    {
      ID: 'USR-002',
      Name: 'Tigist Haile',
      Email: 'manager@eeu.gov.et',
      Password: 'manager123',
      Role: 'manager',
      Region: 'Oromia',
      Department: 'Regional Management',
      Phone: '+251-11-234-5678',
      'Is Active': true,
      'Created At': '2025-01-02T00:00:00Z',
      'Updated At': '2025-01-02T00:00:00Z'
    },
    {
      ID: 'USR-003',
      Name: 'Getachew Tadesse',
      Email: 'foreman@eeu.gov.et',
      Password: 'foreman123',
      Role: 'foreman',
      Region: 'Amhara',
      Department: 'Field Operations',
      Phone: '+251-11-345-6789',
      'Is Active': true,
      'Created At': '2025-01-03T00:00:00Z',
      'Updated At': '2025-01-03T00:00:00Z'
    },
    {
      ID: 'USR-004',
      Name: 'Meron Tesfaye',
      Email: 'attendant@eeu.gov.et',
      Password: 'attendant123',
      Role: 'call-attendant',
      Region: 'Addis Ababa',
      Department: 'Control Room',
      Phone: '+251-11-456-7890',
      'Is Active': true,
      'Created At': '2025-01-04T00:00:00Z',
      'Updated At': '2025-01-04T00:00:00Z'
    },
    {
      ID: 'USR-005',
      Name: 'Dawit Solomon',
      Email: 'tech@eeu.gov.et',
      Password: 'tech123',
      Role: 'technician',
      Region: 'Addis Ababa',
      Department: 'Field Service',
      Phone: '+251-11-567-8901',
      'Is Active': true,
      'Created At': '2025-01-05T00:00:00Z',
      'Updated At': '2025-01-05T00:00:00Z'
    }
  ],
  
  customers: [
    {
      ID: 'CUST-001',
      Name: 'Almaz Tesfaye',
      Email: 'almaz.tesfaye@gmail.com',
      Phone: '+251-911-123456',
      Address: 'Kirkos Sub-city, Addis Ababa',
      Region: 'Addis Ababa',
      'Meter Number': 'AAM-001234',
      'Account Number': 'ACC-789456',
      'Created At': '2025-01-01T00:00:00Z',
      'Updated At': '2025-01-01T00:00:00Z'
    },
    {
      ID: 'CUST-002',
      Name: 'Bereket Hailu',
      Email: 'bereket.hailu@yahoo.com',
      Phone: '+251-912-234567',
      Address: 'Bahir Dar, Amhara Region',
      Region: 'Amhara',
      'Meter Number': 'AMR-002345',
      'Account Number': 'ACC-890567',
      'Created At': '2025-01-02T00:00:00Z',
      'Updated At': '2025-01-02T00:00:00Z'
    },
    {
      ID: 'CUST-003',
      Name: 'Chaltu Bekele',
      Email: 'chaltu.bekele@gmail.com',
      Phone: '+251-913-345678',
      Address: 'Adama, Oromia Region',
      Region: 'Oromia',
      'Meter Number': 'ORM-003456',
      'Account Number': 'ACC-901678',
      'Created At': '2025-01-03T00:00:00Z',
      'Updated At': '2025-01-03T00:00:00Z'
    }
  ],
  
  complaints: [
    {
      ID: 'CMP-001',
      'Customer ID': 'CUST-001',
      'Customer Name': 'Almaz Tesfaye',
      'Customer Email': 'almaz.tesfaye@gmail.com',
      'Customer Phone': '+251-911-123456',
      Title: 'Complete Power Outage in Kirkos Area',
      Description: 'There has been no electricity in our area for the past 6 hours. Multiple households are affected. This is causing significant inconvenience especially for our home-based business.',
      Category: 'power-outage',
      Priority: 'high',
      Status: 'open',
      Region: 'Addis Ababa',
      'Assigned To': 'USR-005',
      'Assigned By': 'USR-002',
      'Created By': 'USR-004',
      'Created At': '2025-08-05T08:30:00Z',
      'Updated At': '2025-08-05T08:30:00Z',
      'Estimated Resolution': '2025-08-05T16:00:00Z',
      Notes: 'Initial report received from customer; Dispatched field team to investigate transformer issues'
    },
    {
      ID: 'CMP-002',
      'Customer ID': 'CUST-002',
      'Customer Name': 'Bereket Hailu',
      'Customer Email': 'bereket.hailu@yahoo.com',
      'Customer Phone': '+251-912-234567',
      Title: 'Voltage Fluctuation Damaging Appliances',
      Description: 'Experiencing severe voltage fluctuations that have already damaged our refrigerator and television. The voltage seems to drop and spike randomly throughout the day.',
      Category: 'voltage-fluctuation',
      Priority: 'medium',
      Status: 'in-progress',
      Region: 'Amhara',
      'Assigned To': 'USR-003',
      'Assigned By': 'USR-002',
      'Created By': 'USR-004',
      'Created At': '2025-08-04T14:20:00Z',
      'Updated At': '2025-08-05T09:15:00Z',
      'Estimated Resolution': '2025-08-06T12:00:00Z',
      Notes: 'Customer reported appliance damage; Voltage regulator inspection scheduled; Temporary stabilizer provided to customer'
    },
    {
      ID: 'CMP-003',
      'Customer ID': 'CUST-003',
      'Customer Name': 'Chaltu Bekele',
      'Customer Email': 'chaltu.bekele@gmail.com',
      'Customer Phone': '+251-913-345678',
      Title: 'Incorrect Billing Amount',
      Description: 'My electricity bill shows consumption of 450 kWh for this month, but my average usage is only around 200 kWh. I believe there might be a meter reading error.',
      Category: 'billing-issue',
      Priority: 'low',
      Status: 'resolved',
      Region: 'Oromia',
      'Created By': 'USR-004',
      'Created At': '2025-08-03T11:45:00Z',
      'Updated At': '2025-08-04T16:30:00Z',
      'Resolved At': '2025-08-04T16:30:00Z',
      Notes: 'Customer disputed billing amount; Meter reading verified on-site; Billing error confirmed and corrected; Refund processed for overcharge'
    },
    {
      ID: 'CMP-004',
      'Customer ID': 'CUST-001',
      'Customer Name': 'Almaz Tesfaye',
      'Customer Email': 'almaz.tesfaye@gmail.com',
      'Customer Phone': '+251-911-123456',
      Title: 'Street Light Not Working',
      Description: 'The street light in front of our building has been off for two weeks. This is creating safety concerns for our neighborhood, especially for children and elderly residents.',
      Category: 'safety-concern',
      Priority: 'medium',
      Status: 'open',
      Region: 'Addis Ababa',
      'Created By': 'USR-004',
      'Created At': '2025-08-02T19:00:00Z',
      'Updated At': '2025-08-02T19:00:00Z',
      'Estimated Resolution': '2025-08-07T12:00:00Z',
      Notes: 'Safety concern reported by community; Added to maintenance priority list'
    },
    {
      ID: 'CMP-005',
      'Customer ID': 'CUST-002',
      'Customer Name': 'Bereket Hailu',
      'Customer Email': 'bereket.hailu@yahoo.com',
      'Customer Phone': '+251-912-234567',
      Title: 'Damaged Power Line After Storm',
      Description: 'Heavy winds last night brought down a power line near our compound. The line is currently on the ground creating a hazardous situation. Immediate attention required.',
      Category: 'line-damage',
      Priority: 'critical',
      Status: 'in-progress',
      Region: 'Amhara',
      'Assigned To': 'USR-003',
      'Assigned By': 'USR-001',
      'Created By': 'USR-004',
      'Created At': '2025-08-01T06:00:00Z',
      'Updated At': '2025-08-01T07:30:00Z',
      'Estimated Resolution': '2025-08-01T14:00:00Z',
      Notes: 'Emergency response activated; Area cordoned off for safety; Emergency repair crew dispatched; Estimated 8 hours for complete restoration'
    },
    {
      ID: 'CMP-006',
      'Customer ID': 'CUST-003',
      'Customer Name': 'Chaltu Bekele',
      'Customer Email': 'chaltu.bekele@gmail.com',
      'Customer Phone': '+251-913-345678',
      Title: 'Smart Meter Installation Request',
      Description: 'Requesting installation of smart meter for better monitoring of electricity consumption. Current analog meter is old and may not be accurate.',
      Category: 'meter-installation',
      Priority: 'low',
      Status: 'open',
      Region: 'Oromia',
      'Created By': 'USR-004',
      'Created At': '2025-08-07T10:15:00Z',
      'Updated At': '2025-08-07T10:15:00Z',
      'Estimated Resolution': '2025-08-10T16:00:00Z',
      Notes: 'Customer request logged; Scheduled for technical assessment'
    },
    {
      ID: 'CMP-007',
      'Customer ID': 'CUST-001',
      'Customer Name': 'Almaz Tesfaye',
      'Customer Email': 'almaz.tesfaye@gmail.com',
      'Customer Phone': '+251-911-123456',
      Title: 'Frequent Power Interruptions',
      Description: 'Experiencing frequent power cuts throughout the day, lasting 10-15 minutes each time. This is affecting our business operations and causing data loss.',
      Category: 'power-quality',
      Priority: 'high',
      Status: 'in-progress',
      Region: 'Addis Ababa',
      'Assigned To': 'USR-005',
      'Assigned By': 'USR-002',
      'Created By': 'USR-004',
      'Created At': '2025-08-07T14:30:00Z',
      'Updated At': '2025-08-07T15:45:00Z',
      'Estimated Resolution': '2025-08-08T12:00:00Z',
      Notes: 'Pattern analysis initiated; Field team dispatched for grid inspection; Temporary UPS solution recommended'
    },
    {
      ID: 'CMP-008',
      'Customer ID': 'CUST-002',
      'Customer Name': 'Bereket Hailu',
      'Customer Email': 'bereket.hailu@yahoo.com',
      'Customer Phone': '+251-912-234567',
      Title: 'Underground Cable Damage',
      Description: 'Construction work in the area has damaged underground electrical cables. Multiple buildings in the block are without power.',
      Category: 'infrastructure-damage',
      Priority: 'critical',
      Status: 'open',
      Region: 'Amhara',
      'Assigned To': 'USR-003',
      'Assigned By': 'USR-001',
      'Created By': 'USR-004',
      'Created At': '2025-08-07T16:20:00Z',
      'Updated At': '2025-08-07T16:20:00Z',
      'Estimated Resolution': '2025-08-08T08:00:00Z',
      Notes: 'Emergency response team notified; Area secured and marked; Coordination with construction company initiated'
    }
  ]
};

/**
 * Main function to migrate all mock data to Google Sheets
 */
function migrateAllMockData() {
  try {
    Logger.log('🚀 Starting migration of all mock data to Google Sheets...');
    
    // Migrate users
    migrateUsersData();
    Logger.log('✅ Users data migrated');
    
    // Migrate customers
    migrateCustomersData();
    Logger.log('✅ Customers data migrated');
    
    // Migrate complaints
    migrateComplaintsData();
    Logger.log('✅ Complaints data migrated');
    
    Logger.log('🎉 All mock data migration completed successfully!');
    return { success: true, message: 'All mock data migrated successfully' };
    
  } catch (error) {
    Logger.log('❌ Migration failed: ' + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Migrate users data to Google Sheets
 */
function migrateUsersData() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName('Users');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Users');
  }
  
  // Clear existing data
  sheet.clear();
  
  // Add headers
  const headers = ['ID', 'Name', 'Email', 'Password', 'Role', 'Region', 'Department', 'Phone', 'Is Active', 'Created At', 'Updated At'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  
  // Add user data
  const userData = mockData.users.map(user => [
    user.ID,
    user.Name,
    user.Email,
    user.Password,
    user.Role,
    user.Region,
    user.Department,
    user.Phone,
    user['Is Active'],
    user['Created At'],
    user['Updated At']
  ]);
  
  if (userData.length > 0) {
    sheet.getRange(2, 1, userData.length, headers.length).setValues(userData);
  }
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
  
  Logger.log(`Migrated ${mockData.users.length} users to Google Sheets`);
}

/**
 * Migrate customers data to Google Sheets
 */
function migrateCustomersData() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName('Customers');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Customers');
  }
  
  // Clear existing data
  sheet.clear();
  
  // Add headers
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Address', 'Region', 'Meter Number', 'Account Number', 'Created At', 'Updated At'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#34a853');
  headerRange.setFontColor('white');
  
  // Add customer data
  const customerData = mockData.customers.map(customer => [
    customer.ID,
    customer.Name,
    customer.Email,
    customer.Phone,
    customer.Address,
    customer.Region,
    customer['Meter Number'],
    customer['Account Number'],
    customer['Created At'],
    customer['Updated At']
  ]);
  
  if (customerData.length > 0) {
    sheet.getRange(2, 1, customerData.length, headers.length).setValues(customerData);
  }
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
  
  Logger.log(`Migrated ${mockData.customers.length} customers to Google Sheets`);
}

/**
 * Migrate complaints data to Google Sheets
 */
function migrateComplaintsData() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName('Complaints');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Complaints');
  }
  
  // Clear existing data
  sheet.clear();
  
  // Add headers
  const headers = ['ID', 'Customer ID', 'Customer Name', 'Customer Email', 'Customer Phone', 'Title', 'Description', 'Category', 'Priority', 'Status', 'Region', 'Assigned To', 'Assigned By', 'Created By', 'Created At', 'Updated At', 'Estimated Resolution', 'Resolved At', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#ea4335');
  headerRange.setFontColor('white');
  
  // Add complaint data
  const complaintData = mockData.complaints.map(complaint => [
    complaint.ID,
    complaint['Customer ID'],
    complaint['Customer Name'],
    complaint['Customer Email'],
    complaint['Customer Phone'],
    complaint.Title,
    complaint.Description,
    complaint.Category,
    complaint.Priority,
    complaint.Status,
    complaint.Region,
    complaint['Assigned To'] || '',
    complaint['Assigned By'] || '',
    complaint['Created By'],
    complaint['Created At'],
    complaint['Updated At'],
    complaint['Estimated Resolution'] || '',
    complaint['Resolved At'] || '',
    complaint.Notes
  ]);
  
  if (complaintData.length > 0) {
    sheet.getRange(2, 1, complaintData.length, headers.length).setValues(complaintData);
  }
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
  
  Logger.log(`Migrated ${mockData.complaints.length} complaints to Google Sheets`);
}

/**
 * Create additional sheets for dashboard and analytics
 */
function createAdditionalSheets() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  
  // Create Dashboard Data sheet
  createDashboardDataSheet(spreadsheet);
  
  // Create Activity Feed sheet
  createActivityFeedSheet(spreadsheet);
  
  // Create Performance Metrics sheet
  createPerformanceMetricsSheet(spreadsheet);
  
  // Create System Status sheet
  createSystemStatusSheet(spreadsheet);
  
  // Create Settings sheet
  createSettingsSheet(spreadsheet);
  
  Logger.log('✅ Additional sheets created successfully');
}

/**
 * Create Dashboard Data sheet
 */
function createDashboardDataSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Dashboard_Data');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Dashboard_Data');
  }
  
  sheet.clear();
  
  const headers = ['Metric', 'Value', 'Category', 'Updated At'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#ff9800');
  headerRange.setFontColor('white');
  
  const metrics = [
    ['Total Complaints', '8', 'overview', new Date().toISOString()],
    ['Open Complaints', '5', 'overview', new Date().toISOString()],
    ['In Progress', '3', 'overview', new Date().toISOString()],
    ['Resolved', '1', 'overview', new Date().toISOString()],
    ['Critical Priority', '2', 'priority', new Date().toISOString()],
    ['High Priority', '2', 'priority', new Date().toISOString()],
    ['Medium Priority', '3', 'priority', new Date().toISOString()],
    ['Low Priority', '1', 'priority', new Date().toISOString()],
    ['Average Resolution Time', '24', 'performance', new Date().toISOString()],
    ['Customer Satisfaction', '85', 'performance', new Date().toISOString()]
  ];
  
  sheet.getRange(2, 1, metrics.length, headers.length).setValues(metrics);
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Create Activity Feed sheet
 */
function createActivityFeedSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Activity_Feed');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Activity_Feed');
  }
  
  sheet.clear();
  
  const headers = ['ID', 'Type', 'Description', 'User', 'Timestamp', 'Related ID'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#9c27b0');
  headerRange.setFontColor('white');
  
  const activities = [
    ['ACT-001', 'complaint_created', 'New complaint created: Underground Cable Damage', 'USR-004', '2025-08-07T16:20:00Z', 'CMP-008'],
    ['ACT-002', 'complaint_updated', 'Complaint status updated to in-progress', 'USR-005', '2025-08-07T15:45:00Z', 'CMP-007'],
    ['ACT-003', 'complaint_assigned', 'Complaint assigned to technician', 'USR-002', '2025-08-07T14:30:00Z', 'CMP-007'],
    ['ACT-004', 'complaint_created', 'New complaint created: Smart Meter Installation Request', 'USR-004', '2025-08-07T10:15:00Z', 'CMP-006'],
    ['ACT-005', 'complaint_updated', 'Complaint status updated to in-progress', 'USR-003', '2025-08-01T07:30:00Z', 'CMP-005']
  ];
  
  sheet.getRange(2, 1, activities.length, headers.length).setValues(activities);
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Create Performance Metrics sheet
 */
function createPerformanceMetricsSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Performance_Metrics');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Performance_Metrics');
  }
  
  sheet.clear();
  
  const headers = ['KPI', 'Current Value', 'Target Value', 'Unit', 'Status', 'Updated At'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#607d8b');
  headerRange.setFontColor('white');
  
  const kpis = [
    ['Average Response Time', '2.5', '2.0', 'hours', 'warning', new Date().toISOString()],
    ['Resolution Rate', '87.5', '90.0', 'percentage', 'warning', new Date().toISOString()],
    ['Customer Satisfaction', '85.0', '90.0', 'percentage', 'warning', new Date().toISOString()],
    ['First Call Resolution', '65.0', '75.0', 'percentage', 'critical', new Date().toISOString()],
    ['System Uptime', '99.2', '99.5', 'percentage', 'good', new Date().toISOString()],
    ['Complaint Volume', '8', '10', 'count', 'good', new Date().toISOString()]
  ];
  
  sheet.getRange(2, 1, kpis.length, headers.length).setValues(kpis);
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Create System Status sheet
 */
function createSystemStatusSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('System_Status');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('System_Status');
  }
  
  sheet.clear();
  
  const headers = ['Component', 'Status', 'Last Check', 'Message'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#795548');
  headerRange.setFontColor('white');
  
  const status = [
    ['Database', 'operational', new Date().toISOString(), 'All systems running normally'],
    ['API Service', 'operational', new Date().toISOString(), 'Response time within normal range'],
    ['Authentication', 'operational', new Date().toISOString(), 'Login system functioning properly'],
    ['Notification Service', 'operational', new Date().toISOString(), 'Email and SMS notifications active'],
    ['Backup System', 'operational', new Date().toISOString(), 'Last backup completed successfully'],
    ['Monitoring', 'operational', new Date().toISOString(), 'All monitoring systems active']
  ];
  
  sheet.getRange(2, 1, status.length, headers.length).setValues(status);
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Create Settings sheet
 */
function createSettingsSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Settings');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Settings');
  }
  
  sheet.clear();
  
  const headers = ['Key', 'Value', 'Category', 'Description', 'Updated At'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#3f51b5');
  headerRange.setFontColor('white');
  
  const settings = [
    ['app_name', 'Ethiopian Electric Utility Portal', 'general', 'Application name', new Date().toISOString()],
    ['default_language', 'en', 'localization', 'Default system language', new Date().toISOString()],
    ['max_file_size', '10', 'uploads', 'Maximum file upload size in MB', new Date().toISOString()],
    ['session_timeout', '30', 'security', 'Session timeout in minutes', new Date().toISOString()],
    ['email_notifications', 'true', 'notifications', 'Enable email notifications', new Date().toISOString()],
    ['sms_notifications', 'true', 'notifications', 'Enable SMS notifications', new Date().toISOString()],
    ['auto_assignment', 'true', 'workflow', 'Enable automatic complaint assignment', new Date().toISOString()],
    ['maintenance_mode', 'false', 'system', 'System maintenance mode', new Date().toISOString()]
  ];
  
  sheet.getRange(2, 1, settings.length, headers.length).setValues(settings);
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Complete migration function that creates all sheets and migrates all data
 */
function completeMigration() {
  try {
    Logger.log('🚀 Starting complete migration process...');
    
    // Migrate all mock data
    migrateAllMockData();
    
    // Create additional sheets
    createAdditionalSheets();
    
    Logger.log('🎉 Complete migration finished successfully!');
    Logger.log('📊 All sheets have been created and populated with data');
    Logger.log('📋 Available sheets:');
    Logger.log('   - Users (with user accounts)');
    Logger.log('   - Customers (with customer data)');
    Logger.log('   - Complaints (with complaint records)');
    Logger.log('   - Dashboard_Data (with metrics)');
    Logger.log('   - Activity_Feed (with recent activities)');
    Logger.log('   - Performance_Metrics (with KPIs)');
    Logger.log('   - System_Status (with system status)');
    Logger.log('   - Settings (with configuration)');
    
    return { success: true, message: 'Complete migration finished successfully' };
    
  } catch (error) {
    Logger.log('❌ Complete migration failed: ' + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test function to verify the migration
 */
function testMigration() {
  const result = completeMigration();
  Logger.log('Migration test result: ' + JSON.stringify(result));
  return result;
}