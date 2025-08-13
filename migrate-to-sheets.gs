/**
 * Google Apps Script for Migrating Data to Sheets
 * This script initializes Google Sheets with all mock data for the Ethiopian Electric Utility Portal
 */

const SHEET_ID = '1vi7SguM67N8BP5_5dNSPh4GO0WDe-Y6_LwfY-GliW0o'; // Update with your sheet ID

/**
 * Main function to initialize all sheets with seed data
 */
function initializeSheets() {
  try {
    Logger.log('🚀 Initializing Google Sheets with migrated data...');
    
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    // Initialize Users sheet
    initializeUsersSheet(spreadsheet);
    Logger.log('✅ Users sheet initialized');
    
    // Initialize Customers sheet
    initializeCustomersSheet(spreadsheet);
    Logger.log('✅ Customers sheet initialized');
    
    // Initialize Complaints sheet
    initializeComplaintsSheet(spreadsheet);
    Logger.log('✅ Complaints sheet initialized');
    
    // Initialize Dashboard Data sheet
    initializeDashboardDataSheet(spreadsheet);
    Logger.log('✅ Dashboard Data sheet initialized');
    
    // Initialize Activity Feed sheet
    initializeActivityFeedSheet(spreadsheet);
    Logger.log('✅ Activity Feed sheet initialized');
    
    // Initialize Performance Metrics sheet
    initializePerformanceMetricsSheet(spreadsheet);
    Logger.log('✅ Performance Metrics sheet initialized');
    
    // Initialize System Status sheet
    initializeSystemStatusSheet(spreadsheet);
    Logger.log('✅ System Status sheet initialized');
    
    // Initialize Settings sheet
    initializeSettingsSheet(spreadsheet);
    Logger.log('✅ Settings sheet initialized');
    
    Logger.log('📊 All sheets have been initialized with seed data');
    Logger.log('📋 Sheets created:');
    Logger.log('   - Users (with 5 seed users)');
    Logger.log('   - Customers (with 5 seed customers)');
    Logger.log('   - Complaints (with 8 seed complaints)');
    Logger.log('   - Dashboard_Data (with role-specific insights)');
    Logger.log('   - Activity_Feed (with recent activities)');
    Logger.log('   - Performance_Metrics (with KPIs)');
    Logger.log('   - System_Status (with current status)');
    Logger.log('   - Settings (with default configuration)');
    
    return { success: true, message: 'All sheets initialized successfully' };
    
  } catch (error) {
    Logger.log('❌ Migration failed: ' + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Initialize Users sheet with seed data
 */
function initializeUsersSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Users');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Users');
  }
  
  // Clear existing data
  sheet.clear();
  
  // Headers
  const headers = ['ID', 'Name', 'Email', 'Password', 'Role', 'Region', 'Department', 'Phone', 'Is Active', 'Created At', 'Updated At'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Seed data
  const users = [
    ['USR-001', 'Abebe Kebede', 'admin@eeu.gov.et', 'admin123', 'admin', 'Addis Ababa', 'System Administration', '+251-11-123-4567', true, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'],
    ['USR-002', 'Tigist Haile', 'manager@eeu.gov.et', 'manager123', 'manager', 'Oromia', 'Regional Management', '+251-11-234-5678', true, '2025-01-02T00:00:00Z', '2025-01-02T00:00:00Z'],
    ['USR-003', 'Getachew Tadesse', 'foreman@eeu.gov.et', 'foreman123', 'foreman', 'Amhara', 'Field Operations', '+251-11-345-6789', true, '2025-01-03T00:00:00Z', '2025-01-03T00:00:00Z'],
    ['USR-004', 'Meron Tesfaye', 'attendant@eeu.gov.et', 'attendant123', 'call-attendant', 'Addis Ababa', 'Control Room', '+251-11-456-7890', true, '2025-01-04T00:00:00Z', '2025-01-04T00:00:00Z'],
    ['USR-005', 'Dawit Solomon', 'tech@eeu.gov.et', 'tech123', 'technician', 'Addis Ababa', 'Field Service', '+251-11-567-8901', true, '2025-01-05T00:00:00Z', '2025-01-05T00:00:00Z']
  ];
  
  sheet.getRange(2, 1, users.length, headers.length).setValues(users);
}

/**
 * Initialize Customers sheet with seed data
 */
function initializeCustomersSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Customers');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Customers');
  }
  
  // Clear existing data
  sheet.clear();
  
  // Headers
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Address', 'Region', 'Meter Number', 'Account Number', 'Created At', 'Updated At'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Seed data
  const customers = [
    ['CUST-001', 'Almaz Tesfaye', 'almaz.tesfaye@gmail.com', '+251-911-123456', 'Kirkos Sub-city, Addis Ababa', 'Addis Ababa', 'AAM-001234', 'ACC-789456', '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'],
    ['CUST-002', 'Bereket Hailu', 'bereket.hailu@yahoo.com', '+251-912-234567', 'Bahir Dar, Amhara Region', 'Amhara', 'AMR-002345', 'ACC-890567', '2025-01-02T00:00:00Z', '2025-01-02T00:00:00Z'],
    ['CUST-003', 'Chaltu Bekele', 'chaltu.bekele@gmail.com', '+251-913-345678', 'Adama, Oromia Region', 'Oromia', 'ORM-003456', 'ACC-901678', '2025-01-03T00:00:00Z', '2025-01-03T00:00:00Z'],
    ['CUST-004', 'Haile Wolde', 'haile.wolde@gmail.com', '+251-914-456789', 'Mekelle, Tigray Region', 'Tigray', 'TGR-004567', 'ACC-012789', '2025-01-04T00:00:00Z', '2025-01-04T00:00:00Z'],
    ['CUST-005', 'Meron Mulatu', 'meron.mulatu@gmail.com', '+251-915-567890', 'Hawassa, SNNP Region', 'SNNP', 'SNP-005678', 'ACC-123890', '2025-01-05T00:00:00Z', '2025-01-05T00:00:00Z']
  ];
  
  sheet.getRange(2, 1, customers.length, headers.length).setValues(customers);
}

/**
 * Initialize Complaints sheet with seed data
 */
function initializeComplaintsSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Complaints');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Complaints');
  }
  
  // Clear existing data
  sheet.clear();
  
  // Headers
  const headers = ['ID', 'Customer ID', 'Customer Name', 'Customer Email', 'Customer Phone', 'Title', 'Description', 'Category', 'Priority', 'Status', 'Region', 'Assigned To', 'Assigned By', 'Created By', 'Created At', 'Updated At', 'Estimated Resolution', 'Resolved At', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Seed data
  const complaints = [
    ['CMP-001', 'CUST-001', 'Almaz Tesfaye', 'almaz.tesfaye@gmail.com', '+251-911-123456', 'Complete Power Outage in Kirkos Area', 'There has been no electricity in our area for the past 6 hours. Multiple households are affected.', 'power-outage', 'high', 'open', 'Addis Ababa', 'USR-005', 'USR-002', 'USR-004', '2025-08-05T08:30:00Z', '2025-08-05T08:30:00Z', '2025-08-05T16:00:00Z', '', 'Initial report received; Field team dispatched'],
    ['CMP-002', 'CUST-002', 'Bereket Hailu', 'bereket.hailu@yahoo.com', '+251-912-234567', 'Voltage Fluctuation Damaging Appliances', 'Experiencing severe voltage fluctuations that have damaged appliances.', 'voltage-fluctuation', 'medium', 'in-progress', 'Amhara', 'USR-003', 'USR-002', 'USR-004', '2025-08-04T14:20:00Z', '2025-08-05T09:15:00Z', '2025-08-06T12:00:00Z', '', 'Voltage regulator inspection scheduled'],
    ['CMP-003', 'CUST-003', 'Chaltu Bekele', 'chaltu.bekele@gmail.com', '+251-913-345678', 'Incorrect Billing Amount', 'Bill shows unusually high consumption compared to average usage.', 'billing-issue', 'low', 'resolved', 'Oromia', '', '', 'USR-004', '2025-08-03T11:45:00Z', '2025-08-04T16:30:00Z', '', '2025-08-04T16:30:00Z', 'Billing error confirmed and corrected'],
    ['CMP-004', 'CUST-001', 'Almaz Tesfaye', 'almaz.tesfaye@gmail.com', '+251-911-123456', 'Street Light Not Working', 'Street light has been off for two weeks, creating safety concerns.', 'safety-concern', 'medium', 'open', 'Addis Ababa', '', '', 'USR-004', '2025-08-02T19:00:00Z', '2025-08-02T19:00:00Z', '2025-08-07T12:00:00Z', '', 'Added to maintenance priority list'],
    ['CMP-005', 'CUST-002', 'Bereket Hailu', 'bereket.hailu@yahoo.com', '+251-912-234567', 'Damaged Power Line After Storm', 'Power line brought down by heavy winds, creating hazardous situation.', 'line-damage', 'critical', 'in-progress', 'Amhara', 'USR-003', 'USR-001', 'USR-004', '2025-08-01T06:00:00Z', '2025-08-01T07:30:00Z', '2025-08-01T14:00:00Z', '', 'Emergency response activated; Area cordoned off'],
    ['CMP-006', 'CUST-003', 'Chaltu Bekele', 'chaltu.bekele@gmail.com', '+251-913-345678', 'Smart Meter Installation Request', 'Requesting smart meter installation for better consumption monitoring.', 'meter-installation', 'low', 'open', 'Oromia', '', '', 'USR-004', '2025-08-07T10:15:00Z', '2025-08-07T10:15:00Z', '2025-08-10T16:00:00Z', '', 'Scheduled for technical assessment'],
    ['CMP-007', 'CUST-001', 'Almaz Tesfaye', 'almaz.tesfaye@gmail.com', '+251-911-123456', 'Frequent Power Interruptions', 'Frequent power cuts affecting business operations.', 'power-quality', 'high', 'in-progress', 'Addis Ababa', 'USR-005', 'USR-002', 'USR-004', '2025-08-07T14:30:00Z', '2025-08-07T15:45:00Z', '2025-08-08T12:00:00Z', '', 'Pattern analysis initiated; Field team dispatched'],
    ['CMP-008', 'CUST-002', 'Bereket Hailu', 'bereket.hailu@yahoo.com', '+251-912-234567', 'Underground Cable Damage', 'Construction work damaged underground cables affecting multiple buildings.', 'infrastructure-damage', 'critical', 'open', 'Amhara', 'USR-003', 'USR-001', 'USR-004', '2025-08-07T16:20:00Z', '2025-08-07T16:20:00Z', '2025-08-08T08:00:00Z', '', 'Emergency response team notified; Area secured']
  ];
  
  sheet.getRange(2, 1, complaints.length, headers.length).setValues(complaints);
}

/**
 * Initialize Dashboard Data sheet
 */
function initializeDashboardDataSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Dashboard_Data');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Dashboard_Data');
  }
  
  // Clear existing data
  sheet.clear();
  
  // Headers
  const headers = ['Metric', 'Value', 'Category', 'Updated At'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Dashboard metrics
  const metrics = [
    ['Total Complaints', '8', 'overview', new Date().toISOString()],
    ['Open Complaints', '5', 'overview', new Date().toISOString()],
    ['In Progress', '3', 'overview', new Date().toISOString()],
    ['Resolved', '1', 'overview', new Date().toISOString()],
    ['Critical Priority', '2', 'priority', new Date().toISOString()],
    ['High Priority', '2', 'priority', new Date().toISOString()],
    ['Medium Priority', '3', 'priority', new Date().toISOString()],
    ['Low Priority', '1', 'priority', new Date().toISOString()],
    ['Power Outage', '1', 'category', new Date().toISOString()],
    ['Voltage Issues', '1', 'category', new Date().toISOString()],
    ['Billing Issues', '1', 'category', new Date().toISOString()],
    ['Safety Concerns', '1', 'category', new Date().toISOString()],
    ['Line Damage', '1', 'category', new Date().toISOString()],
    ['Infrastructure', '1', 'category', new Date().toISOString()],
    ['Average Resolution Time', '24', 'performance', new Date().toISOString()],
    ['Customer Satisfaction', '85', 'performance', new Date().toISOString()]
  ];
  
  sheet.getRange(2, 1, metrics.length, headers.length).setValues(metrics);
}

/**
 * Initialize Activity Feed sheet
 */
function initializeActivityFeedSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Activity_Feed');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Activity_Feed');
  }
  
  // Clear existing data
  sheet.clear();
  
  // Headers
  const headers = ['ID', 'Type', 'Description', 'User', 'Timestamp', 'Related ID'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Recent activities
  const activities = [
    ['ACT-001', 'complaint_created', 'New complaint created: Underground Cable Damage', 'USR-004', '2025-08-07T16:20:00Z', 'CMP-008'],
    ['ACT-002', 'complaint_updated', 'Complaint status updated to in-progress', 'USR-005', '2025-08-07T15:45:00Z', 'CMP-007'],
    ['ACT-003', 'complaint_assigned', 'Complaint assigned to technician', 'USR-002', '2025-08-07T14:30:00Z', 'CMP-007'],
    ['ACT-004', 'complaint_created', 'New complaint created: Smart Meter Installation Request', 'USR-004', '2025-08-07T10:15:00Z', 'CMP-006'],
    ['ACT-005', 'complaint_updated', 'Complaint status updated to in-progress', 'USR-003', '2025-08-01T07:30:00Z', 'CMP-005']
  ];
  
  sheet.getRange(2, 1, activities.length, headers.length).setValues(activities);
}

/**
 * Initialize Performance Metrics sheet
 */
function initializePerformanceMetricsSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Performance_Metrics');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Performance_Metrics');
  }
  
  // Clear existing data
  sheet.clear();
  
  // Headers
  const headers = ['KPI', 'Current Value', 'Target Value', 'Unit', 'Status', 'Updated At'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Performance KPIs
  const kpis = [
    ['Average Response Time', '2.5', '2.0', 'hours', 'warning', new Date().toISOString()],
    ['Resolution Rate', '87.5', '90.0', 'percentage', 'warning', new Date().toISOString()],
    ['Customer Satisfaction', '85.0', '90.0', 'percentage', 'warning', new Date().toISOString()],
    ['First Call Resolution', '65.0', '75.0', 'percentage', 'critical', new Date().toISOString()],
    ['System Uptime', '99.2', '99.5', 'percentage', 'good', new Date().toISOString()],
    ['Complaint Volume', '8', '10', 'count', 'good', new Date().toISOString()]
  ];
  
  sheet.getRange(2, 1, kpis.length, headers.length).setValues(kpis);
}

/**
 * Initialize System Status sheet
 */
function initializeSystemStatusSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('System_Status');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('System_Status');
  }
  
  // Clear existing data
  sheet.clear();
  
  // Headers
  const headers = ['Component', 'Status', 'Last Check', 'Message'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // System components status
  const status = [
    ['Database', 'operational', new Date().toISOString(), 'All systems running normally'],
    ['API Service', 'operational', new Date().toISOString(), 'Response time within normal range'],
    ['Authentication', 'operational', new Date().toISOString(), 'Login system functioning properly'],
    ['Notification Service', 'operational', new Date().toISOString(), 'Email and SMS notifications active'],
    ['Backup System', 'operational', new Date().toISOString(), 'Last backup completed successfully'],
    ['Monitoring', 'operational', new Date().toISOString(), 'All monitoring systems active']
  ];
  
  sheet.getRange(2, 1, status.length, headers.length).setValues(status);
}

/**
 * Initialize Settings sheet
 */
function initializeSettingsSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Settings');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Settings');
  }
  
  // Clear existing data
  sheet.clear();
  
  // Headers
  const headers = ['Key', 'Value', 'Category', 'Description', 'Updated At'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // System settings
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
}

/**
 * Health check function
 */
function healthCheck() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheets = spreadsheet.getSheets();
    
    return {
      success: true,
      data: {
        spreadsheet_id: SHEET_ID,
        sheets_count: sheets.length,
        sheet_names: sheets.map(sheet => sheet.getName()),
        last_check: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test function to run the migration
 */
function testMigration() {
  const result = initializeSheets();
  Logger.log('Migration test result: ' + JSON.stringify(result));
  return result;
}