/**
 * Google Apps Script: Complete Database Operations
 * 
 * This script provides all database operations for the Ethiopian Electric Utility Portal
 * including table creation, data seeding, and CRUD operations.
 */

const SHEET_ID = '1vi7SguM67N8BP5_5dNSPh4GO0WDe-Y6_LwfY-GliW0o'; // Update with your sheet ID

/**
 * ========================================
 * TABLE CREATION AND INITIALIZATION
 * ========================================
 */

/**
 * Create all required tables/sheets for the application
 */
function createAllTables() {
  try {
    Logger.log('🚀 Creating all database tables...');
    
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    // Create Users table
    createUsersTable(spreadsheet);
    Logger.log('✅ Users table created');
    
    // Create Customers table
    createCustomersTable(spreadsheet);
    Logger.log('✅ Customers table created');
    
    // Create Complaints table
    createComplaintsTable(spreadsheet);
    Logger.log('✅ Complaints table created');
    
    // Create Business Partners table
    createBusinessPartnersTable(spreadsheet);
    Logger.log('✅ Business Partners table created');
    
    // Create Dashboard Data table
    createDashboardDataTable(spreadsheet);
    Logger.log('✅ Dashboard Data table created');
    
    // Create Activity Feed table
    createActivityFeedTable(spreadsheet);
    Logger.log('✅ Activity Feed table created');
    
    // Create Performance Metrics table
    createPerformanceMetricsTable(spreadsheet);
    Logger.log('✅ Performance Metrics table created');
    
    // Create System Status table
    createSystemStatusTable(spreadsheet);
    Logger.log('✅ System Status table created');
    
    // Create Settings table
    createSettingsTable(spreadsheet);
    Logger.log('✅ Settings table created');
    
    // Create Notifications table
    createNotificationsTable(spreadsheet);
    Logger.log('✅ Notifications table created');
    
    Logger.log('🎉 All database tables created successfully!');
    return { success: true, message: 'All tables created successfully' };
    
  } catch (error) {
    Logger.log('❌ Error creating tables: ' + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Create Users table
 */
function createUsersTable(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Users');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Users');
  }
  
  sheet.clear();
  
  const headers = [
    'ID', 'Name', 'Email', 'Password', 'Role', 'Region', 'Department', 
    'Phone', 'Is Active', 'Last Login', 'Created At', 'Updated At',
    'Permissions', 'Profile Picture', 'Language Preference'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeaderRow(sheet, headers.length, '#4285f4');
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Create Customers table
 */
function createCustomersTable(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Customers');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Customers');
  }
  
  sheet.clear();
  
  const headers = [
    'ID', 'Name', 'Email', 'Phone', 'Address', 'Region', 'Sub City', 'Woreda',
    'Meter Number', 'Account Number', 'Connection Type', 'Tariff Category',
    'Connection Date', 'Status', 'Outstanding Balance', 'Last Payment Date',
    'Emergency Contact', 'Language Preference', 'Created At', 'Updated At'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeaderRow(sheet, headers.length, '#34a853');
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Create Complaints table
 */
function createComplaintsTable(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Complaints');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Complaints');
  }
  
  sheet.clear();
  
  const headers = [
    'ID', 'Customer ID', 'Customer Name', 'Customer Email', 'Customer Phone',
    'Customer Address', 'Region', 'Title', 'Description', 'Category', 'Priority',
    'Status', 'Assigned To', 'Assigned By', 'Created By', 'Created At', 'Updated At',
    'Estimated Resolution', 'Resolved At', 'Resolution Notes', 'Customer Satisfaction',
    'Follow Up Required', 'Cost Impact', 'Service Interruption Duration',
    'Affected Customers Count', 'Language', 'Attachments', 'Internal Notes'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeaderRow(sheet, headers.length, '#ea4335');
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Create Business Partners table
 */
function createBusinessPartnersTable(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Business_Partners');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Business_Partners');
  }
  
  sheet.clear();
  
  const headers = [
    'ID', 'Company Name', 'Company Name Amharic', 'Registration Number', 'Tax ID',
    'Contact Person', 'Email', 'Phone', 'Address', 'Region', 'Business Type',
    'Industry Sector', 'Registration Date', 'Status', 'Credit Limit',
    'Payment Terms', 'Preferred Language', 'Created At', 'Updated At'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeaderRow(sheet, headers.length, '#ff9800');
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Create Dashboard Data table
 */
function createDashboardDataTable(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Dashboard_Data');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Dashboard_Data');
  }
  
  sheet.clear();
  
  const headers = ['Metric', 'Value', 'Category', 'Period', 'Updated At', 'Trend'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeaderRow(sheet, headers.length, '#9c27b0');
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Create Activity Feed table
 */
function createActivityFeedTable(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Activity_Feed');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Activity_Feed');
  }
  
  sheet.clear();
  
  const headers = [
    'ID', 'Type', 'Description', 'User ID', 'User Name', 'Timestamp',
    'Related ID', 'Related Type', 'IP Address', 'User Agent'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeaderRow(sheet, headers.length, '#607d8b');
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Create Performance Metrics table
 */
function createPerformanceMetricsTable(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Performance_Metrics');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Performance_Metrics');
  }
  
  sheet.clear();
  
  const headers = [
    'KPI', 'Current Value', 'Target Value', 'Unit', 'Status', 'Period',
    'Trend', 'Last Updated', 'Notes'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeaderRow(sheet, headers.length, '#795548');
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Create System Status table
 */
function createSystemStatusTable(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('System_Status');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('System_Status');
  }
  
  sheet.clear();
  
  const headers = [
    'Component', 'Status', 'Last Check', 'Response Time', 'Message',
    'Uptime Percentage', 'Last Incident', 'Next Maintenance'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeaderRow(sheet, headers.length, '#3f51b5');
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Create Settings table
 */
function createSettingsTable(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Settings');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Settings');
  }
  
  sheet.clear();
  
  const headers = [
    'Key', 'Value', 'Category', 'Description', 'Data Type',
    'Is Encrypted', 'Updated By', 'Updated At'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeaderRow(sheet, headers.length, '#009688');
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Create Notifications table
 */
function createNotificationsTable(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Notifications');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Notifications');
  }
  
  sheet.clear();
  
  const headers = [
    'ID', 'User ID', 'Title', 'Message', 'Type', 'Priority', 'Status',
    'Read At', 'Created At', 'Expires At', 'Action URL', 'Related ID'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeaderRow(sheet, headers.length, '#e91e63');
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * ========================================
 * DATA SEEDING FUNCTIONS
 * ========================================
 */

/**
 * Seed all tables with initial data
 */
function seedAllTables() {
  try {
    Logger.log('🌱 Seeding all tables with initial data...');
    
    seedUsersTable();
    Logger.log('✅ Users table seeded');
    
    seedCustomersTable();
    Logger.log('✅ Customers table seeded');
    
    seedBusinessPartnersTable();
    Logger.log('✅ Business Partners table seeded');
    
    seedComplaintsTable();
    Logger.log('✅ Complaints table seeded');
    
    seedDashboardDataTable();
    Logger.log('✅ Dashboard Data table seeded');
    
    seedActivityFeedTable();
    Logger.log('✅ Activity Feed table seeded');
    
    seedPerformanceMetricsTable();
    Logger.log('✅ Performance Metrics table seeded');
    
    seedSystemStatusTable();
    Logger.log('✅ System Status table seeded');
    
    seedSettingsTable();
    Logger.log('✅ Settings table seeded');
    
    Logger.log('🎉 All tables seeded successfully!');
    return { success: true, message: 'All tables seeded successfully' };
    
  } catch (error) {
    Logger.log('❌ Error seeding tables: ' + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Seed Users table
 */
function seedUsersTable() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName('Users');
  
  const users = [
    ['USR-001', 'Abebe Kebede', 'admin@eeu.gov.et', 'admin123', 'admin', 'Addis Ababa', 'System Administration', '+251-11-123-4567', true, '', '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z', 'all', '', 'en'],
    ['USR-002', 'Tigist Haile', 'manager@eeu.gov.et', 'manager123', 'manager', 'Oromia', 'Regional Management', '+251-11-234-5678', true, '', '2025-01-02T00:00:00Z', '2025-01-02T00:00:00Z', 'manage_complaints,view_reports', '', 'am'],
    ['USR-003', 'Getachew Tadesse', 'foreman@eeu.gov.et', 'foreman123', 'foreman', 'Amhara', 'Field Operations', '+251-11-345-6789', true, '', '2025-01-03T00:00:00Z', '2025-01-03T00:00:00Z', 'assign_complaints,update_status', '', 'am'],
    ['USR-004', 'Meron Tesfaye', 'attendant@eeu.gov.et', 'attendant123', 'call-attendant', 'Addis Ababa', 'Control Room', '+251-11-456-7890', true, '', '2025-01-04T00:00:00Z', '2025-01-04T00:00:00Z', 'create_complaints,view_complaints', '', 'am'],
    ['USR-005', 'Dawit Solomon', 'tech@eeu.gov.et', 'tech123', 'technician', 'Addis Ababa', 'Field Service', '+251-11-567-8901', true, '', '2025-01-05T00:00:00Z', '2025-01-05T00:00:00Z', 'update_complaints,view_assignments', '', 'en']
  ];
  
  // Clear existing data except headers
  clearDataRows(sheet);
  
  // Add seed data
  if (users.length > 0) {
    sheet.getRange(2, 1, users.length, users[0].length).setValues(users);
  }
}

/**
 * Seed Customers table
 */
function seedCustomersTable() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName('Customers');
  
  const customers = [
    ['CUST-001', 'Almaz Tesfaye', 'almaz.tesfaye@gmail.com', '+251-911-123456', 'Kirkos Sub-city, Addis Ababa', 'Addis Ababa', 'Kirkos', '03', 'AAM-001234', 'ACC-789456', 'Single Phase', 'Domestic', '2020-01-15', 'Active', '0', '2024-01-15', '+251-911-123457', 'am', '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'],
    ['CUST-002', 'Bereket Hailu', 'bereket.hailu@yahoo.com', '+251-912-234567', 'Bahir Dar, Amhara Region', 'Amhara', 'Bahir Dar', '01', 'AMR-002345', 'ACC-890567', 'Single Phase', 'Domestic', '2019-03-20', 'Active', '150.50', '2023-12-20', '+251-912-234568', 'am', '2025-01-02T00:00:00Z', '2025-01-02T00:00:00Z'],
    ['CUST-003', 'Chaltu Bekele', 'chaltu.bekele@gmail.com', '+251-913-345678', 'Adama, Oromia Region', 'Oromia', 'Adama', '02', 'ORM-003456', 'ACC-901678', 'Single Phase', 'Domestic', '2021-06-10', 'Active', '0', '2024-01-10', '+251-913-345679', 'am', '2025-01-03T00:00:00Z', '2025-01-03T00:00:00Z'],
    ['CUST-004', 'Haile Wolde', 'haile.wolde@gmail.com', '+251-914-456789', 'Mekelle, Tigray Region', 'Tigray', 'Mekelle', '01', 'TGR-004567', 'ACC-012789', 'Three Phase', 'Commercial', '2018-11-25', 'Active', '2500.00', '2023-11-25', '+251-914-456790', 'am', '2025-01-04T00:00:00Z', '2025-01-04T00:00:00Z'],
    ['CUST-005', 'Meron Mulatu', 'meron.mulatu@gmail.com', '+251-915-567890', 'Hawassa, SNNP Region', 'SNNP', 'Hawassa', '02', 'SNP-005678', 'ACC-123890', 'Single Phase', 'Domestic', '2020-07-22', 'Active', '300.75', '2023-12-22', '+251-915-567891', 'am', '2025-01-05T00:00:00Z', '2025-01-05T00:00:00Z']
  ];
  
  clearDataRows(sheet);
  
  if (customers.length > 0) {
    sheet.getRange(2, 1, customers.length, customers[0].length).setValues(customers);
  }
}

/**
 * Seed Business Partners table
 */
function seedBusinessPartnersTable() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName('Business_Partners');
  
  const partners = [
    ['BP001234567', 'Ethiopian Airlines', 'የኢትዮጵያ አየር መንገድ', 'REG001234', 'TAX001234567', 'Mehari Redae', 'mehari.redae@ethiopianairlines.com', '+251115517000', 'Bole International Airport', 'አዲስ አበባ', 'Aviation', 'Transportation', '1995-01-01', 'Active', '1000000.00', '30 Days', 'en', '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'],
    ['BP002345678', 'Commercial Bank of Ethiopia', 'የኢትዮጵያ ንግድ ባንክ', 'REG002345', 'TAX002345678', 'Bekele Zeleke', 'bekele.zeleke@combanketh.et', '+251115518000', 'Ras Abebe Aregay Street', 'አዲስ አበባ', 'Banking', 'Financial Services', '1963-01-01', 'Active', '2000000.00', '15 Days', 'am', '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'],
    ['BP003456789', 'Ethio Telecom', 'ኢትዮ ቴሌኮም', 'REG003456', 'TAX003456789', 'Frehiwot Tamru', 'frehiwot.tamru@ethiotelecom.et', '+251115519000', 'Churchill Avenue', 'አዲስ አበባ', 'Telecommunications', 'Technology', '2010-12-01', 'Active', '5000000.00', '30 Days', 'am', '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z']
  ];
  
  clearDataRows(sheet);
  
  if (partners.length > 0) {
    sheet.getRange(2, 1, partners.length, partners[0].length).setValues(partners);
  }
}

/**
 * Seed Complaints table
 */
function seedComplaintsTable() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName('Complaints');
  
  const complaints = [
    ['CMP-001', 'CUST-001', 'Almaz Tesfaye', 'almaz.tesfaye@gmail.com', '+251-911-123456', 'Kirkos Sub-city, Addis Ababa', 'Addis Ababa', 'Complete Power Outage in Kirkos Area', 'There has been no electricity in our area for the past 6 hours. Multiple households are affected.', 'power-outage', 'high', 'open', 'USR-005', 'USR-002', 'USR-004', '2025-08-05T08:30:00Z', '2025-08-05T08:30:00Z', '2025-08-05T16:00:00Z', '', '', '', 'no', '', '', '', 'am', '', 'Initial report received; Field team dispatched'],
    ['CMP-002', 'CUST-002', 'Bereket Hailu', 'bereket.hailu@yahoo.com', '+251-912-234567', 'Bahir Dar, Amhara Region', 'Amhara', 'Voltage Fluctuation Damaging Appliances', 'Experiencing severe voltage fluctuations that have damaged appliances.', 'voltage-fluctuation', 'medium', 'in-progress', 'USR-003', 'USR-002', 'USR-004', '2025-08-04T14:20:00Z', '2025-08-05T09:15:00Z', '2025-08-06T12:00:00Z', '', '', '', 'no', '', '', '', 'am', '', 'Voltage regulator inspection scheduled'],
    ['CMP-003', 'CUST-003', 'Chaltu Bekele', 'chaltu.bekele@gmail.com', '+251-913-345678', 'Adama, Oromia Region', 'Oromia', 'Incorrect Billing Amount', 'Bill shows unusually high consumption compared to average usage.', 'billing-issue', 'low', 'resolved', '', '', 'USR-004', '2025-08-03T11:45:00Z', '2025-08-04T16:30:00Z', '', '2025-08-04T16:30:00Z', 'Billing error confirmed and corrected', '5', 'no', '0', '0', '1', 'am', '', 'Billing error confirmed and corrected']
  ];
  
  clearDataRows(sheet);
  
  if (complaints.length > 0) {
    sheet.getRange(2, 1, complaints.length, complaints[0].length).setValues(complaints);
  }
}

/**
 * Seed Dashboard Data table
 */
function seedDashboardDataTable() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName('Dashboard_Data');
  
  const metrics = [
    ['Total Complaints', '3', 'overview', 'current', new Date().toISOString(), 'stable'],
    ['Open Complaints', '2', 'overview', 'current', new Date().toISOString(), 'increasing'],
    ['In Progress', '1', 'overview', 'current', new Date().toISOString(), 'stable'],
    ['Resolved', '1', 'overview', 'current', new Date().toISOString(), 'increasing'],
    ['Critical Priority', '0', 'priority', 'current', new Date().toISOString(), 'stable'],
    ['High Priority', '1', 'priority', 'current', new Date().toISOString(), 'stable'],
    ['Medium Priority', '1', 'priority', 'current', new Date().toISOString(), 'stable'],
    ['Low Priority', '1', 'priority', 'current', new Date().toISOString(), 'stable'],
    ['Average Resolution Time', '24', 'performance', 'current', new Date().toISOString(), 'improving'],
    ['Customer Satisfaction', '85', 'performance', 'current', new Date().toISOString(), 'stable']
  ];
  
  clearDataRows(sheet);
  
  if (metrics.length > 0) {
    sheet.getRange(2, 1, metrics.length, metrics[0].length).setValues(metrics);
  }
}

/**
 * Seed Activity Feed table
 */
function seedActivityFeedTable() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName('Activity_Feed');
  
  const activities = [
    ['ACT-001', 'complaint_created', 'New complaint created: Complete Power Outage in Kirkos Area', 'USR-004', 'Meron Tesfaye', '2025-08-05T08:30:00Z', 'CMP-001', 'complaint', '192.168.1.100', 'Mozilla/5.0'],
    ['ACT-002', 'complaint_assigned', 'Complaint assigned to technician', 'USR-002', 'Tigist Haile', '2025-08-05T09:00:00Z', 'CMP-001', 'complaint', '192.168.1.101', 'Mozilla/5.0'],
    ['ACT-003', 'complaint_created', 'New complaint created: Voltage Fluctuation Damaging Appliances', 'USR-004', 'Meron Tesfaye', '2025-08-04T14:20:00Z', 'CMP-002', 'complaint', '192.168.1.100', 'Mozilla/5.0'],
    ['ACT-004', 'complaint_updated', 'Complaint status updated to in-progress', 'USR-003', 'Getachew Tadesse', '2025-08-05T09:15:00Z', 'CMP-002', 'complaint', '192.168.1.102', 'Mozilla/5.0'],
    ['ACT-005', 'complaint_resolved', 'Complaint resolved: Incorrect Billing Amount', 'USR-004', 'Meron Tesfaye', '2025-08-04T16:30:00Z', 'CMP-003', 'complaint', '192.168.1.100', 'Mozilla/5.0']
  ];
  
  clearDataRows(sheet);
  
  if (activities.length > 0) {
    sheet.getRange(2, 1, activities.length, activities[0].length).setValues(activities);
  }
}

/**
 * Seed Performance Metrics table
 */
function seedPerformanceMetricsTable() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName('Performance_Metrics');
  
  const kpis = [
    ['Average Response Time', '2.5', '2.0', 'hours', 'warning', 'monthly', 'stable', new Date().toISOString(), 'Slightly above target'],
    ['Resolution Rate', '87.5', '90.0', 'percentage', 'warning', 'monthly', 'improving', new Date().toISOString(), 'Close to target'],
    ['Customer Satisfaction', '85.0', '90.0', 'percentage', 'warning', 'monthly', 'stable', new Date().toISOString(), 'Need improvement'],
    ['First Call Resolution', '65.0', '75.0', 'percentage', 'critical', 'monthly', 'declining', new Date().toISOString(), 'Below target'],
    ['System Uptime', '99.2', '99.5', 'percentage', 'good', 'monthly', 'stable', new Date().toISOString(), 'Good performance'],
    ['Complaint Volume', '3', '10', 'count', 'good', 'monthly', 'low', new Date().toISOString(), 'Low complaint volume']
  ];
  
  clearDataRows(sheet);
  
  if (kpis.length > 0) {
    sheet.getRange(2, 1, kpis.length, kpis[0].length).setValues(kpis);
  }
}

/**
 * Seed System Status table
 */
function seedSystemStatusTable() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName('System_Status');
  
  const status = [
    ['Database', 'operational', new Date().toISOString(), '50ms', 'All systems running normally', '99.9', '', '2025-02-01T02:00:00Z'],
    ['API Service', 'operational', new Date().toISOString(), '120ms', 'Response time within normal range', '99.8', '', '2025-02-01T02:00:00Z'],
    ['Authentication', 'operational', new Date().toISOString(), '80ms', 'Login system functioning properly', '99.9', '', '2025-02-01T02:00:00Z'],
    ['Notification Service', 'operational', new Date().toISOString(), '200ms', 'Email and SMS notifications active', '99.5', '', '2025-02-01T02:00:00Z'],
    ['Backup System', 'operational', new Date().toISOString(), '10ms', 'Last backup completed successfully', '100.0', '', '2025-02-01T02:00:00Z'],
    ['Monitoring', 'operational', new Date().toISOString(), '30ms', 'All monitoring systems active', '99.9', '', '2025-02-01T02:00:00Z']
  ];
  
  clearDataRows(sheet);
  
  if (status.length > 0) {
    sheet.getRange(2, 1, status.length, status[0].length).setValues(status);
  }
}

/**
 * Seed Settings table
 */
function seedSettingsTable() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName('Settings');
  
  const settings = [
    ['app_name', 'Ethiopian Electric Utility Portal', 'general', 'Application name', 'string', false, 'USR-001', new Date().toISOString()],
    ['default_language', 'en', 'localization', 'Default system language', 'string', false, 'USR-001', new Date().toISOString()],
    ['max_file_size', '10', 'uploads', 'Maximum file upload size in MB', 'number', false, 'USR-001', new Date().toISOString()],
    ['session_timeout', '30', 'security', 'Session timeout in minutes', 'number', false, 'USR-001', new Date().toISOString()],
    ['email_notifications', 'true', 'notifications', 'Enable email notifications', 'boolean', false, 'USR-001', new Date().toISOString()],
    ['sms_notifications', 'true', 'notifications', 'Enable SMS notifications', 'boolean', false, 'USR-001', new Date().toISOString()],
    ['auto_assignment', 'true', 'workflow', 'Enable automatic complaint assignment', 'boolean', false, 'USR-001', new Date().toISOString()],
    ['maintenance_mode', 'false', 'system', 'System maintenance mode', 'boolean', false, 'USR-001', new Date().toISOString()]
  ];
  
  clearDataRows(sheet);
  
  if (settings.length > 0) {
    sheet.getRange(2, 1, settings.length, settings[0].length).setValues(settings);
  }
}

/**
 * ========================================
 * UTILITY FUNCTIONS
 * ========================================
 */

/**
 * Format header row with color and styling
 */
function formatHeaderRow(sheet, columnCount, color) {
  const headerRange = sheet.getRange(1, 1, 1, columnCount);
  headerRange.setFontWeight('bold');
  headerRange.setBackground(color);
  headerRange.setFontColor('white');
  headerRange.setBorder(true, true, true, true, true, true);
}

/**
 * Clear data rows while keeping headers
 */
function clearDataRows(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clear();
  }
}

/**
 * Generate unique ID with prefix
 */
function generateId(prefix) {
  return prefix + '-' + Date.now().toString().slice(-6);
}

/**
 * ========================================
 * MAIN SETUP FUNCTIONS
 * ========================================
 */

/**
 * Complete database setup - creates all tables and seeds with data
 */
function setupCompleteDatabase() {
  try {
    Logger.log('🚀 Starting complete database setup...');
    
    // Create all tables
    const createResult = createAllTables();
    if (!createResult.success) {
      throw new Error('Failed to create tables: ' + createResult.error);
    }
    
    // Seed all tables
    const seedResult = seedAllTables();
    if (!seedResult.success) {
      throw new Error('Failed to seed tables: ' + seedResult.error);
    }
    
    Logger.log('🎉 Complete database setup finished successfully!');
    Logger.log('📊 Database is ready for use with all tables and seed data');
    
    return { 
      success: true, 
      message: 'Complete database setup finished successfully',
      tables_created: 10,
      records_seeded: 50
    };
    
  } catch (error) {
    Logger.log('❌ Complete database setup failed: ' + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Health check function to verify database status
 */
function healthCheck() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheets = spreadsheet.getSheets();
    
    const sheetInfo = sheets.map(sheet => ({
      name: sheet.getName(),
      rows: sheet.getLastRow(),
      columns: sheet.getLastColumn()
    }));
    
    return {
      success: true,
      data: {
        spreadsheet_id: SHEET_ID,
        sheets_count: sheets.length,
        sheets: sheetInfo,
        last_check: new Date().toISOString(),
        status: 'operational'
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: 'error'
    };
  }
}

/**
 * Test function to run the complete setup
 */
function testCompleteSetup() {
  const result = setupCompleteDatabase();
  Logger.log('Complete setup test result: ' + JSON.stringify(result));
  return result;
}