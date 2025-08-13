// --- ENHANCED CONFIGURATION ---
const CONFIG = {
  SHEET_ID: '1vi7SguM67N8BP5_5dNSPh4GO0WDe-Y6_LwfY-GliW0o',
  USER_SHEET: 'Users',
  CUSTOMER_SHEET: 'Customers',
  COMPLAINT_SHEET: 'Complaints',
  DASHBOARD_DATA_SHEET: 'Dashboard_Data',
  ACTIVITY_FEED_SHEET: 'Activity_Feed',
  PERFORMANCE_METRICS_SHEET: 'Performance_Metrics',
  TEAM_PERFORMANCE_SHEET: 'Team_Performance',
  SYSTEM_STATUS_SHEET: 'System_Status',
  SETTINGS_SHEET: 'Settings',
  NOTIFICATIONS_SHEET: 'Notifications'
};

// --- MAIN ENTRY POINT ---
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const params = e.parameter || {};
    const action = params.action;
    
    Logger.log('Request received - Action: ' + action);
    Logger.log('Parameters: ' + JSON.stringify(params));
    
    let result;
    
    switch (action) {
      case 'login':
        result = authenticateUser(params.email, params.password);
        break;
      case 'healthCheck':
        result = healthCheck();
        break;
      case 'initializeSheets':
        result = initializeSheets();
        break;
      case 'getUsers':
        result = getUsers();
        break;
      case 'createUser':
        result = createUser(params);
        break;
      case 'updateUser':
        result = updateUser(params);
        break;
      case 'deleteUser':
        result = deleteUser(params.id);
        break;
      case 'resetUserPassword':
        result = resetUserPassword(params.id, params.newPassword);
        break;
      case 'getCustomers':
        result = getCustomers();
        break;
      case 'createCustomer':
        result = createCustomer(params);
        break;
      case 'updateCustomer':
        result = updateCustomer(params);
        break;
      case 'getComplaints':
        result = getComplaints(params);
        break;
      case 'createComplaint':
        result = createComplaint(params);
        break;
      case 'updateComplaint':
        result = updateComplaint(params);
        break;
      case 'getDashboardData':
        result = getDashboardData(params.role, params.region);
        break;
      case 'getDashboardStats':
        result = getDashboardStats();
        break;
      case 'getActivityFeed':
        result = getActivityFeed();
        break;
      case 'getPerformanceMetrics':
        result = getPerformanceMetrics();
        break;
      case 'getSystemStatus':
        result = getSystemStatus();
        break;
      case 'updateSystemStatus':
        result = updateSystemStatus(params);
        break;
      case 'getSettings':
        result = getSettings();
        break;
      case 'updateSettings':
        result = updateSettings(params);
        break;
      case 'getAnalytics':
        result = getAnalytics(params);
        break;
      case 'exportData':
        result = exportData(params);
        break;
      default:
        result = { success: false, error: 'Invalid action: ' + action };
    }
    
    Logger.log('Response: ' + JSON.stringify(result));
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    Logger.log('Error in handleRequest: ' + error.message);
    const errorResponse = {
      success: false,
      error: 'Server error: ' + error.message
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

// --- SHEET INITIALIZATION ---
function initializeSheets() {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    
    // Initialize Users Sheet
    let userSheet = spreadsheet.getSheetByName(CONFIG.USER_SHEET);
    if (!userSheet) {
      userSheet = spreadsheet.insertSheet(CONFIG.USER_SHEET);
      userSheet.getRange(1, 1, 1, 9).setValues([[
        'ID', 'Name', 'Email', 'Password', 'Role', 'Region', 'Department', 'Phone', 'Is Active', 'Created At'
      ]]);
      
      // Add seed users
      const seedUsers = [
        ['USR-001', 'Abebe Kebede', 'admin@eeu.gov.et', 'admin123', 'admin', 'Addis Ababa', 'System Administration', '+251-11-123-4567', true, new Date().toISOString()],
        ['USR-002', 'Tigist Haile', 'manager@eeu.gov.et', 'manager123', 'manager', 'Oromia', 'Regional Management', '+251-11-234-5678', true, new Date().toISOString()],
        ['USR-003', 'Getachew Tadesse', 'foreman@eeu.gov.et', 'foreman123', 'foreman', 'Amhara', 'Field Operations', '+251-11-345-6789', true, new Date().toISOString()],
        ['USR-004', 'Meron Tesfaye', 'operator@eeu.gov.et', 'operator123', 'call-attendant', 'Addis Ababa', 'Control Room', '+251-11-456-7890', true, new Date().toISOString()],
        ['USR-005', 'Dawit Solomon', 'technician@eeu.gov.et', 'tech123', 'technician', 'Addis Ababa', 'Field Service', '+251-11-567-8901', true, new Date().toISOString()]
      ];
      userSheet.getRange(2, 1, seedUsers.length, 10).setValues(seedUsers);
    }
    
    // Initialize Customers Sheet
    let customerSheet = spreadsheet.getSheetByName(CONFIG.CUSTOMER_SHEET);
    if (!customerSheet) {
      customerSheet = spreadsheet.insertSheet(CONFIG.CUSTOMER_SHEET);
      customerSheet.getRange(1, 1, 1, 8).setValues([[
        'ID', 'Name', 'Email', 'Phone', 'Address', 'Region', 'Meter Number', 'Account Number'
      ]]);
      
      // Add seed customers
      const seedCustomers = [
        ['CUST-001', 'Almaz Tesfaye', 'almaz.tesfaye@gmail.com', '+251-911-123456', 'Kirkos Sub-city, Addis Ababa', 'Addis Ababa', 'AAM-001234', 'ACC-789456'],
        ['CUST-002', 'Bereket Hailu', 'bereket.hailu@yahoo.com', '+251-912-234567', 'Bahir Dar, Amhara Region', 'Amhara', 'AMR-002345', 'ACC-890567'],
        ['CUST-003', 'Chaltu Bekele', 'chaltu.bekele@gmail.com', '+251-913-345678', 'Adama, Oromia Region', 'Oromia', 'ORM-003456', 'ACC-901678'],
        ['CUST-004', 'Tadesse Worku', 'tadesse.worku@gmail.com', '+251-914-456789', 'Mekelle, Tigray Region', 'Tigray', 'TGR-004567', 'ACC-012789'],
        ['CUST-005', 'Hanan Gebru', 'hanan.gebru@yahoo.com', '+251-915-567890', 'Hawassa, SNNPR', 'SNNPR', 'SNR-005678', 'ACC-123890']
      ];
      customerSheet.getRange(2, 1, seedCustomers.length, 8).setValues(seedCustomers);
    }
    
    // Initialize Complaints Sheet
    let complaintSheet = spreadsheet.getSheetByName(CONFIG.COMPLAINT_SHEET);
    if (!complaintSheet) {
      complaintSheet = spreadsheet.insertSheet(CONFIG.COMPLAINT_SHEET);
      complaintSheet.getRange(1, 1, 1, 16).setValues([[
        'ID', 'Customer ID', 'Title', 'Description', 'Category', 'Priority', 'Status', 'Region', 
        'Assigned To', 'Assigned By', 'Created By', 'Created At', 'Updated At', 'Resolved At', 
        'Estimated Resolution', 'Notes'
      ]]);
      
      // Add seed complaints
      const seedComplaints = [
        ['CMP-001', 'CUST-001', 'Complete Power Outage in Kirkos Area', 'There has been no electricity in our area for the past 6 hours. Multiple households are affected.', 'power-outage', 'high', 'open', 'Addis Ababa', 'USR-005', 'USR-002', 'USR-004', new Date('2025-01-08T08:30:00Z').toISOString(), new Date('2025-01-08T08:30:00Z').toISOString(), '', new Date('2025-01-08T16:00:00Z').toISOString(), 'Initial report received from customer|Dispatched field team to investigate transformer issues'],
        ['CMP-002', 'CUST-002', 'Voltage Fluctuation Damaging Appliances', 'Experiencing severe voltage fluctuations that have already damaged our refrigerator and television.', 'voltage-fluctuation', 'medium', 'in-progress', 'Amhara', 'USR-003', 'USR-002', 'USR-004', new Date('2025-01-07T14:20:00Z').toISOString(), new Date('2025-01-08T09:15:00Z').toISOString(), '', new Date('2025-01-09T12:00:00Z').toISOString(), 'Customer reported appliance damage|Voltage regulator inspection scheduled|Temporary stabilizer provided to customer'],
        ['CMP-003', 'CUST-003', 'Incorrect Billing Amount', 'My electricity bill shows consumption of 450 kWh for this month, but my average usage is only around 200 kWh.', 'billing-issue', 'low', 'resolved', 'Oromia', '', '', 'USR-004', new Date('2025-01-06T11:45:00Z').toISOString(), new Date('2025-01-07T16:30:00Z').toISOString(), new Date('2025-01-07T16:30:00Z').toISOString(), '', 'Customer disputed billing amount|Meter reading verified on-site|Billing error confirmed and corrected|Refund processed for overcharge'],
        ['CMP-004', 'CUST-001', 'Street Light Not Working', 'The street light in front of our building has been off for two weeks. This is creating safety concerns.', 'safety-concern', 'medium', 'open', 'Addis Ababa', '', '', 'USR-004', new Date('2025-01-05T19:00:00Z').toISOString(), new Date('2025-01-05T19:00:00Z').toISOString(), '', new Date('2025-01-10T12:00:00Z').toISOString(), 'Safety concern reported by community|Added to maintenance priority list'],
        ['CMP-005', 'CUST-002', 'Damaged Power Line After Storm', 'Heavy winds last night brought down a power line near our compound. Immediate attention required.', 'line-damage', 'critical', 'in-progress', 'Amhara', 'USR-003', 'USR-001', 'USR-004', new Date('2025-01-04T06:00:00Z').toISOString(), new Date('2025-01-04T07:30:00Z').toISOString(), '', new Date('2025-01-04T14:00:00Z').toISOString(), 'Emergency response activated|Area cordoned off for safety|Emergency repair crew dispatched|Estimated 8 hours for complete restoration'],
        ['CMP-006', 'CUST-003', 'Smart Meter Installation Request', 'Requesting installation of smart meter for better monitoring of electricity consumption.', 'meter-installation', 'low', 'open', 'Oromia', '', '', 'USR-004', new Date('2025-01-08T10:15:00Z').toISOString(), new Date('2025-01-08T10:15:00Z').toISOString(), '', new Date('2025-01-11T16:00:00Z').toISOString(), 'Customer request logged|Scheduled for technical assessment'],
        ['CMP-007', 'CUST-001', 'Frequent Power Interruptions', 'Experiencing frequent power cuts throughout the day, lasting 10-15 minutes each time.', 'power-quality', 'high', 'in-progress', 'Addis Ababa', 'USR-005', 'USR-002', 'USR-004', new Date('2025-01-08T14:30:00Z').toISOString(), new Date('2025-01-08T15:45:00Z').toISOString(), '', new Date('2025-01-09T12:00:00Z').toISOString(), 'Pattern analysis initiated|Field team dispatched for grid inspection|Temporary UPS solution recommended'],
        ['CMP-008', 'CUST-002', 'Underground Cable Damage', 'Construction work in the area has damaged underground electrical cables. Multiple buildings affected.', 'infrastructure-damage', 'critical', 'open', 'Amhara', 'USR-003', 'USR-001', 'USR-004', new Date('2025-01-08T16:20:00Z').toISOString(), new Date('2025-01-08T16:20:00Z').toISOString(), '', new Date('2025-01-09T08:00:00Z').toISOString(), 'Emergency response team notified|Area secured and marked|Coordination with construction company initiated']
      ];
      complaintSheet.getRange(2, 1, seedComplaints.length, 16).setValues(seedComplaints);
    }
    
    // Initialize Dashboard Data Sheet
    let dashboardSheet = spreadsheet.getSheetByName(CONFIG.DASHBOARD_DATA_SHEET);
    if (!dashboardSheet) {
      dashboardSheet = spreadsheet.insertSheet(CONFIG.DASHBOARD_DATA_SHEET);
      dashboardSheet.getRange(1, 1, 1, 8).setValues([[
        'ID', 'Role', 'Label', 'Value', 'Status', 'Trend', 'Created At', 'Updated At'
      ]]);
      
      // Add seed data for dashboard insights
      const seedDashboardData = [
        ['DASH-001', 'admin', 'System Health', '98.5%', 'good', 'stable', new Date().toISOString(), new Date().toISOString()],
        ['DASH-002', 'admin', 'Active Users', '247', 'good', 'up', new Date().toISOString(), new Date().toISOString()],
        ['DASH-003', 'admin', 'Server Load', '23%', 'good', 'down', new Date().toISOString(), new Date().toISOString()],
        ['DASH-004', 'admin', 'Data Backup', 'Current', 'good', 'stable', new Date().toISOString(), new Date().toISOString()],
        ['DASH-005', 'manager', 'Team Performance', '87%', 'good', 'up', new Date().toISOString(), new Date().toISOString()],
        ['DASH-006', 'manager', 'Regional Coverage', '94%', 'good', 'stable', new Date().toISOString(), new Date().toISOString()],
        ['DASH-007', 'manager', 'Budget Utilization', '76%', 'warning', 'up', new Date().toISOString(), new Date().toISOString()],
        ['DASH-008', 'manager', 'Customer Satisfaction', '4.2/5', 'good', 'up', new Date().toISOString(), new Date().toISOString()],
        ['DASH-009', 'foreman', 'Field Teams Active', '12', 'good', 'stable', new Date().toISOString(), new Date().toISOString()],
        ['DASH-010', 'foreman', 'Equipment Status', '89%', 'good', 'up', new Date().toISOString(), new Date().toISOString()],
        ['DASH-011', 'foreman', 'Safety Incidents', '0', 'good', 'stable', new Date().toISOString(), new Date().toISOString()],
        ['DASH-012', 'foreman', 'Maintenance Due', '3', 'warning', 'down', new Date().toISOString(), new Date().toISOString()],
        ['DASH-013', 'call-attendant', 'Calls Handled', '45', 'good', 'up', new Date().toISOString(), new Date().toISOString()],
        ['DASH-014', 'call-attendant', 'Avg Response Time', '2.3min', 'good', 'down', new Date().toISOString(), new Date().toISOString()],
        ['DASH-015', 'call-attendant', 'Customer Rating', '4.6/5', 'good', 'up', new Date().toISOString(), new Date().toISOString()],
        ['DASH-016', 'call-attendant', 'Queue Length', '2', 'good', 'stable', new Date().toISOString(), new Date().toISOString()],
        ['DASH-017', 'technician', 'Assigned Tasks', '8', 'warning', 'up', new Date().toISOString(), new Date().toISOString()],
        ['DASH-018', 'technician', 'Completed Today', '5', 'good', 'up', new Date().toISOString(), new Date().toISOString()],
        ['DASH-019', 'technician', 'Tools Available', '95%', 'good', 'stable', new Date().toISOString(), new Date().toISOString()],
        ['DASH-020', 'technician', 'Next Appointment', '2:30 PM', 'good', 'stable', new Date().toISOString(), new Date().toISOString()]
      ];
      dashboardSheet.getRange(2, 1, seedDashboardData.length, 8).setValues(seedDashboardData);
    }
    
    // Initialize Activity Feed Sheet
    let activitySheet = spreadsheet.getSheetByName(CONFIG.ACTIVITY_FEED_SHEET);
    if (!activitySheet) {
      activitySheet = spreadsheet.insertSheet(CONFIG.ACTIVITY_FEED_SHEET);
      activitySheet.getRange(1, 1, 1, 12).setValues([[
        'ID', 'Type', 'Title', 'Description', 'User ID', 'User Name', 'User Role', 'Priority', 'Region', 'Complaint ID', 'Is Important', 'Created At'
      ]]);
      
      // Add seed activity data
      const seedActivityData = [
        ['ACT-001', 'complaint_created', 'New Critical Complaint', 'Power outage reported in Addis Ababa - Bole area affecting 500+ customers', 'USR-004', 'Meron Tesfaye', 'call-attendant', 'critical', 'Addis Ababa', 'CMP-001', true, new Date(Date.now() - 5 * 60 * 1000).toISOString()],
        ['ACT-002', 'complaint_resolved', 'Complaint Resolved', 'Voltage fluctuation issue in Dire Dawa resolved by field team', 'USR-005', 'Dawit Solomon', 'technician', 'high', 'Dire Dawa', 'CMP-002', false, new Date(Date.now() - 15 * 60 * 1000).toISOString()],
        ['ACT-003', 'user_login', 'Manager Login', 'Regional manager logged in from Hawassa office', 'USR-002', 'Tigist Haile', 'manager', '', 'Hawassa', '', false, new Date(Date.now() - 30 * 60 * 1000).toISOString()],
        ['ACT-004', 'system_alert', 'System Maintenance', 'Scheduled maintenance completed for billing system', 'SYSTEM', 'System', 'system', '', '', '', false, new Date(Date.now() - 45 * 60 * 1000).toISOString()],
        ['ACT-005', 'complaint_updated', 'Complaint Status Updated', 'Meter reading issue in Bahir Dar assigned to field technician', 'USR-003', 'Getachew Tadesse', 'foreman', 'medium', 'Bahir Dar', 'CMP-003', false, new Date(Date.now() - 60 * 60 * 1000).toISOString()],
        ['ACT-006', 'report_generated', 'Monthly Report Generated', 'Monthly performance report for Tigray region completed', 'USR-002', 'Tigist Haile', 'manager', '', 'Tigray', '', false, new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()]
      ];
      activitySheet.getRange(2, 1, seedActivityData.length, 12).setValues(seedActivityData);
    }
    
    // Initialize Performance Metrics Sheet
    let performanceSheet = spreadsheet.getSheetByName(CONFIG.PERFORMANCE_METRICS_SHEET);
    if (!performanceSheet) {
      performanceSheet = spreadsheet.insertSheet(CONFIG.PERFORMANCE_METRICS_SHEET);
      performanceSheet.getRange(1, 1, 1, 11).setValues([[
        'ID', 'Title', 'Value', 'Target', 'Unit', 'Trend', 'Trend Value', 'Description', 'Category', 'Created At', 'Updated At'
      ]]);
      
      // Add seed performance metrics
      const seedPerformanceData = [
        ['PERF-001', 'Resolution Rate', 87.5, 90, '%', 'up', 5.2, 'Percentage of complaints resolved within SLA', 'efficiency', new Date().toISOString(), new Date().toISOString()],
        ['PERF-002', 'Avg Response Time', 2.3, 2.0, 'hours', 'down', -0.5, 'Average time to first response', 'speed', new Date().toISOString(), new Date().toISOString()],
        ['PERF-003', 'Customer Satisfaction', 4.2, 4.5, '/5', 'up', 0.3, 'Average customer rating', 'satisfaction', new Date().toISOString(), new Date().toISOString()],
        ['PERF-004', 'First Call Resolution', 73, 80, '%', 'up', 8.1, 'Issues resolved on first contact', 'quality', new Date().toISOString(), new Date().toISOString()],
        ['PERF-005', 'SLA Compliance', 92, 95, '%', 'stable', 0.1, 'Compliance with service level agreements', 'quality', new Date().toISOString(), new Date().toISOString()],
        ['PERF-006', 'Team Productivity', 85, 90, '%', 'up', 3.7, 'Overall team productivity score', 'efficiency', new Date().toISOString(), new Date().toISOString()]
      ];
      performanceSheet.getRange(2, 1, seedPerformanceData.length, 11).setValues(seedPerformanceData);
    }
    
    // Initialize System Status Sheet
    let systemSheet = spreadsheet.getSheetByName(CONFIG.SYSTEM_STATUS_SHEET);
    if (!systemSheet) {
      systemSheet = spreadsheet.insertSheet(CONFIG.SYSTEM_STATUS_SHEET);
      systemSheet.getRange(1, 1, 1, 10).setValues([[
        'ID', 'Temperature', 'Connectivity', 'Battery Level', 'Alerts', 'Active Incidents', 'Server Load', 'Uptime', 'Weather Condition', 'Updated At'
      ]]);
      
      // Add current system status
      const systemData = [
        ['SYS-001', 26.5, 'Strong', 92, 2, 1, 23.5, '99.8%', 'Sunny', new Date().toISOString()]
      ];
      systemSheet.getRange(2, 1, systemData.length, 10).setValues(systemData);
    }
    
    // Initialize Settings Sheet
    let settingsSheet = spreadsheet.getSheetByName(CONFIG.SETTINGS_SHEET);
    if (!settingsSheet) {
      settingsSheet = spreadsheet.insertSheet(CONFIG.SETTINGS_SHEET);
      settingsSheet.getRange(1, 1, 1, 4).setValues([[
        'Key', 'Value', 'Description', 'Updated At'
      ]]);
      
      // Add default settings
      const settingsData = [
        ['company_name', 'Ethiopian Electric Utility', 'Company name displayed in the application', new Date().toISOString()],
        ['support_email', 'support@eeu.gov.et', 'Support email address', new Date().toISOString()],
        ['support_phone', '+251-11-123-4567', 'Support phone number', new Date().toISOString()],
        ['auto_assignment', 'true', 'Enable automatic complaint assignment', new Date().toISOString()],
        ['email_notifications', 'true', 'Enable email notifications', new Date().toISOString()],
        ['sms_notifications', 'false', 'Enable SMS notifications', new Date().toISOString()],
        ['session_timeout', '60', 'Session timeout in minutes', new Date().toISOString()],
        ['refresh_interval', '30', 'Dashboard refresh interval in seconds', new Date().toISOString()]
      ];
      settingsSheet.getRange(2, 1, settingsData.length, 4).setValues(settingsData);
    }
    
    return { success: true, message: 'All sheets initialized successfully with seed data' };
  } catch (error) {
    Logger.log('initializeSheets error: ' + error.message);
    return { success: false, error: 'Failed to initialize sheets: ' + error.message };
  }
}

// --- AUTHENTICATION ---
function authenticateUser(email, password) {
  try {
    if (!email || !password) {
      return { success: false, error: 'Missing email or password' };
    }
    email = (email + '').trim().toLowerCase();
    password = (password + '').trim();

    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.USER_SHEET);
    if (!sheet) {
      return { success: false, error: 'Users sheet not found' };
    }
    const data = sheet.getDataRange().getValues();
    if (!data || data.length < 2) {
      return { success: false, error: 'No users found' };
    }
    const headers = data[0];
    const emailIdx = headers.indexOf('Email');
    const passwordIdx = headers.indexOf('Password');
    if (emailIdx === -1 || passwordIdx === -1) {
      return { success: false, error: 'Email or Password column missing in Users sheet' };
    }
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[emailIdx] || !row[passwordIdx]) continue;
      if ((row[emailIdx] + '').trim().toLowerCase() === email && (row[passwordIdx] + '').trim() === password) {
        // Build user object without password
        let user = {};
        for (let j = 0; j < headers.length; j++) {
          if (headers[j] !== 'Password') {
            user[headers[j]] = row[j] || ''; // Ensure no null/undefined values
          }
        }
        
        // Ensure required fields exist with safe defaults
        user.ID = user.ID || 'USR-' + Date.now();
        user.Name = user.Name || 'Unknown User';
        user.Email = user.Email || email;
        user.Role = user.Role || 'technician';
        user.Region = user.Region || '';
        
        // Log user activity with safe property access
        try {
          logActivity('user_login', 'User Login', (user.Name || 'User') + ' logged in', 
                     user.ID || '', user.Name || '', user.Role || '', '', user.Region || '', '', false);
        } catch (logError) {
          Logger.log('logActivity error: ' + logError.message);
          // Continue with login even if logging fails
        }
        
        return {
          success: true,
          data: { user: user },
          message: 'Login successful'
        };
      }
    }
    return { success: false, error: 'Invalid credentials' };
  } catch (error) {
    Logger.log('authenticateUser error: ' + error.message);
    return { success: false, error: 'Login failed: ' + error.message };
  }
}

// --- USER MANAGEMENT ---
function getUsers() {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.USER_SHEET);
    if (!sheet) {
      return { success: false, error: 'Users sheet not found' };
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return { success: true, data: [] };
    }
    
    const headers = data[0];
    const users = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      let user = {};
      for (let j = 0; j < headers.length; j++) {
        if (headers[j] !== 'Password') { // Exclude password from response
          user[headers[j]] = row[j];
        }
      }
      users.push(user);
    }
    
    return { success: true, data: users };
  } catch (error) {
    Logger.log('getUsers error: ' + error.message);
    return { success: false, error: 'Failed to get users: ' + error.message };
  }
}

function createUser(params) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.USER_SHEET);
    if (!sheet) {
      return { success: false, error: 'Users sheet not found' };
    }
    
    const userId = 'USR-' + Date.now();
    const newUser = [
      userId,
      params.name,
      params.email,
      params.password || 'defaultpass123',
      params.role,
      params.region,
      params.department,
      params.phone,
      true,
      new Date().toISOString()
    ];
    
    sheet.appendRow(newUser);
    
    // Log activity
    logActivity('user_created', 'User Created', 'New user ' + params.name + ' created', userId, params.name, params.role, '', params.region, '', false);
    
    return { success: true, data: { id: userId }, message: 'User created successfully' };
  } catch (error) {
    Logger.log('createUser error: ' + error.message);
    return { success: false, error: 'Failed to create user: ' + error.message };
  }
}

// --- CUSTOMER MANAGEMENT ---
function getCustomers() {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.CUSTOMER_SHEET);
    if (!sheet) {
      return { success: false, error: 'Customers sheet not found' };
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return { success: true, data: [] };
    }
    
    const headers = data[0];
    const customers = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      let customer = {};
      for (let j = 0; j < headers.length; j++) {
        customer[headers[j]] = row[j];
      }
      customers.push(customer);
    }
    
    return { success: true, data: customers };
  } catch (error) {
    Logger.log('getCustomers error: ' + error.message);
    return { success: false, error: 'Failed to get customers: ' + error.message };
  }
}

function createCustomer(params) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.CUSTOMER_SHEET);
    if (!sheet) {
      return { success: false, error: 'Customers sheet not found' };
    }
    
    const customerId = 'CUST-' + Date.now();
    const newCustomer = [
      customerId,
      params.name,
      params.email,
      params.phone,
      params.address,
      params.region,
      params.meterNumber || '',
      params.accountNumber || ''
    ];
    
    sheet.appendRow(newCustomer);
    
    return { success: true, data: { id: customerId }, message: 'Customer created successfully' };
  } catch (error) {
    Logger.log('createCustomer error: ' + error.message);
    return { success: false, error: 'Failed to create customer: ' + error.message };
  }
}

// --- COMPLAINT MANAGEMENT ---
function getComplaints(params) {
  try {
    const complaintSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.COMPLAINT_SHEET);
    const customerSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.CUSTOMER_SHEET);
    
    if (!complaintSheet || !customerSheet) {
      return { success: false, error: 'Required sheets not found' };
    }
    
    // Get complaints data
    const complaintData = complaintSheet.getDataRange().getValues();
    if (complaintData.length < 2) {
      return { success: true, data: [] };
    }
    
    // Get customers data for lookup
    const customerData = customerSheet.getDataRange().getValues();
    const customerHeaders = customerData[0];
    const customers = {};
    
    for (let i = 1; i < customerData.length; i++) {
      const row = customerData[i];
      let customer = {};
      for (let j = 0; j < customerHeaders.length; j++) {
        customer[customerHeaders[j]] = row[j];
      }
      customers[customer.ID] = customer;
    }
    
    const complaintHeaders = complaintData[0];
    const complaints = [];
    
    for (let i = 1; i < complaintData.length; i++) {
      const row = complaintData[i];
      let complaint = {};
      for (let j = 0; j < complaintHeaders.length; j++) {
        if (complaintHeaders[j] === 'Notes') {
          complaint[complaintHeaders[j]] = row[j] ? row[j].split('|') : [];
        } else {
          complaint[complaintHeaders[j]] = row[j];
        }
      }
      
      // Add customer data
      const customerId = complaint['Customer ID'];
      if (customers[customerId]) {
        complaint.customer = customers[customerId];
      }
      
      complaints.push(complaint);
    }
    
    // Apply filters if provided
    let filteredComplaints = complaints;
    if (params.status) {
      filteredComplaints = filteredComplaints.filter(c => c.Status === params.status);
    }
    if (params.priority) {
      filteredComplaints = filteredComplaints.filter(c => c.Priority === params.priority);
    }
    if (params.region) {
      filteredComplaints = filteredComplaints.filter(c => c.Region === params.region);
    }
    
    return { success: true, data: filteredComplaints };
  } catch (error) {
    Logger.log('getComplaints error: ' + error.message);
    return { success: false, error: 'Failed to get complaints: ' + error.message };
  }
}

function createComplaint(params) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.COMPLAINT_SHEET);
    if (!sheet) {
      return { success: false, error: 'Complaints sheet not found' };
    }
    
    const complaintId = 'CMP-' + Date.now();
    const now = new Date().toISOString();
    
    const newComplaint = [
      complaintId,
      params.customerId,
      params.title,
      params.description,
      params.category,
      params.priority,
      'open',
      params.region,
      params.assignedTo || '',
      params.assignedBy || '',
      params.createdBy,
      now,
      now,
      '',
      params.estimatedResolution || '',
      params.notes ? params.notes.join('|') : ''
    ];
    
    sheet.appendRow(newComplaint);
    
    // Log activity
    logActivity('complaint_created', 'New Complaint Created', params.title, params.createdBy, '', '', params.priority, params.region, complaintId, params.priority === 'critical');
    
    return { success: true, data: { id: complaintId }, message: 'Complaint created successfully' };
  } catch (error) {
    Logger.log('createComplaint error: ' + error.message);
    return { success: false, error: 'Failed to create complaint: ' + error.message };
  }
}

// --- DASHBOARD DATA ---
function getDashboardData(role, region) {
  try {
    // Get role-specific insights
    const dashboardSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.DASHBOARD_DATA_SHEET);
    const systemSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.SYSTEM_STATUS_SHEET);
    
    let roleInsights = [];
    if (dashboardSheet) {
      const data = dashboardSheet.getDataRange().getValues();
      const headers = data[0];
      
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[1] === role) { // Role column
          roleInsights.push({
            label: row[2], // Label
            value: row[3], // Value
            status: row[4], // Status
            trend: row[5] // Trend
          });
        }
      }
    }
    
    // Get system status
    let systemStatus = {
      temperature: 24 + Math.random() * 6,
      connectivity: Math.random() > 0.1 ? 'Strong' : 'Weak',
      batteryLevel: 85 + Math.random() * 15,
      lastUpdate: new Date(),
      alerts: Math.floor(Math.random() * 5),
      activeIncidents: Math.floor(Math.random() * 3),
      serverLoad: Math.random() * 50,
      uptime: '99.8%'
    };
    
    if (systemSheet) {
      const systemData = systemSheet.getDataRange().getValues();
      if (systemData.length > 1) {
        const row = systemData[1]; // Get first data row
        systemStatus = {
          temperature: row[1] || systemStatus.temperature,
          connectivity: row[2] || systemStatus.connectivity,
          batteryLevel: row[3] || systemStatus.batteryLevel,
          lastUpdate: new Date(),
          alerts: row[4] || systemStatus.alerts,
          activeIncidents: row[5] || systemStatus.activeIncidents,
          serverLoad: row[6] || systemStatus.serverLoad,
          uptime: row[7] || systemStatus.uptime
        };
      }
    }
    
    return {
      success: true,
      data: {
        roleInsights: roleInsights,
        systemStatus: systemStatus,
        weatherData: {
          temperature: 25 + Math.random() * 10,
          condition: ['Sunny', 'Partly Cloudy', 'Cloudy'][Math.floor(Math.random() * 3)],
          windSpeed: Math.random() * 20,
          visibility: ['Excellent', 'Good', 'Fair'][Math.floor(Math.random() * 3)],
          safetyLevel: Math.random() > 0.8 ? 'caution' : 'safe'
        }
      }
    };
  } catch (error) {
    Logger.log('getDashboardData error: ' + error.message);
    return { success: false, error: 'Failed to get dashboard data: ' + error.message };
  }
}

function getDashboardStats() {
  try {
    const complaintSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.COMPLAINT_SHEET);
    const userSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.USER_SHEET);
    
    let stats = {
      complaints: {
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        active: 0,
        inactive: 0,
        overdue: 0
      },
      users: {
        total: 0,
        active: 0,
        inactive: 0
      },
      performance: {
        resolutionRate: 87.5,
        averageResponseTime: '2.3h',
        customerSatisfaction: 4.2
      }
    };
    
    // Calculate complaint stats
    if (complaintSheet) {
      const data = complaintSheet.getDataRange().getValues();
      if (data.length > 1) {
        stats.complaints.total = data.length - 1;
        
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          const status = row[6]; // Status column
          const priority = row[5]; // Priority column
          
          // Count by status
          if (status === 'open') stats.complaints.open++;
          else if (status === 'in-progress') stats.complaints.inProgress++;
          else if (status === 'resolved') stats.complaints.resolved++;
          
          // Count by priority
          if (priority === 'critical') stats.complaints.critical++;
          else if (priority === 'high') stats.complaints.high++;
          else if (priority === 'medium') stats.complaints.medium++;
          else if (priority === 'low') stats.complaints.low++;
          
          // Count active (open + in-progress)
          if (status === 'open' || status === 'in-progress') {
            stats.complaints.active++;
          } else {
            stats.complaints.inactive++;
          }
        }
      }
    }
    
    // Calculate user stats
    if (userSheet) {
      const data = userSheet.getDataRange().getValues();
      if (data.length > 1) {
        stats.users.total = data.length - 1;
        
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          const isActive = row[8]; // Is Active column
          
          if (isActive) {
            stats.users.active++;
          } else {
            stats.users.inactive++;
          }
        }
      }
    }
    
    return { success: true, data: stats };
  } catch (error) {
    Logger.log('getDashboardStats error: ' + error.message);
    return { success: false, error: 'Failed to get dashboard stats: ' + error.message };
  }
}

// --- ACTIVITY FEED ---
function getActivityFeed() {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.ACTIVITY_FEED_SHEET);
    if (!sheet) {
      return { success: false, error: 'Activity feed sheet not found' };
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return { success: true, data: [] };
    }
    
    const headers = data[0];
    const activities = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      let activity = {};
      for (let j = 0; j < headers.length; j++) {
        activity[headers[j]] = row[j];
      }
      
      // Format for frontend
      activity.user = {
        id: activity['User ID'],
        name: activity['User Name'],
        role: activity['User Role']
      };
      activity.timestamp = activity['Created At'];
      activity.metadata = {
        priority: activity.Priority,
        region: activity.Region
      };
      activity.isImportant = activity['Is Important'];
      
      activities.push(activity);
    }
    
    // Sort by timestamp (newest first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return { success: true, data: activities.slice(0, 20) }; // Return latest 20
  } catch (error) {
    Logger.log('getActivityFeed error: ' + error.message);
    return { success: false, error: 'Failed to get activity feed: ' + error.message };
  }
}

// --- PERFORMANCE METRICS ---
function getPerformanceMetrics() {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.PERFORMANCE_METRICS_SHEET);
    if (!sheet) {
      return { success: false, error: 'Performance metrics sheet not found' };
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return { success: true, data: { metrics: [] } };
    }
    
    const headers = data[0];
    const metrics = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      let metric = {};
      for (let j = 0; j < headers.length; j++) {
        metric[headers[j]] = row[j];
      }
      
      // Format for frontend
      metric.id = metric.ID;
      metric.title = metric.Title;
      metric.value = metric.Value;
      metric.target = metric.Target;
      metric.unit = metric.Unit;
      metric.trend = metric.Trend;
      metric.trendValue = metric['Trend Value'];
      metric.description = metric.Description;
      metric.category = metric.Category;
      
      metrics.push(metric);
    }
    
    return { success: true, data: { metrics: metrics } };
  } catch (error) {
    Logger.log('getPerformanceMetrics error: ' + error.message);
    return { success: false, error: 'Failed to get performance metrics: ' + error.message };
  }
}

// --- SYSTEM STATUS ---
function getSystemStatus() {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.SYSTEM_STATUS_SHEET);
    if (!sheet) {
      return { success: false, error: 'System status sheet not found' };
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return { success: true, data: {} };
    }
    
    const row = data[1]; // Get first data row
    const systemStatus = {
      temperature: row[1],
      connectivity: row[2],
      batteryLevel: row[3],
      alerts: row[4],
      activeIncidents: row[5],
      serverLoad: row[6],
      uptime: row[7],
      weatherCondition: row[8],
      lastUpdate: row[9]
    };
    
    return { success: true, data: systemStatus };
  } catch (error) {
    Logger.log('getSystemStatus error: ' + error.message);
    return { success: false, error: 'Failed to get system status: ' + error.message };
  }
}

// --- SETTINGS ---
function getSettings() {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.SETTINGS_SHEET);
    if (!sheet) {
      return { success: false, error: 'Settings sheet not found' };
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return { success: true, data: {} };
    }
    
    const settings = {};
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      settings[row[0]] = row[1]; // Key -> Value
    }
    
    return { success: true, data: settings };
  } catch (error) {
    Logger.log('getSettings error: ' + error.message);
    return { success: false, error: 'Failed to get settings: ' + error.message };
  }
}

// --- ANALYTICS ---
function getAnalytics(params) {
  try {
    // This would typically calculate analytics from complaint data
    // For now, return mock analytics data
    const analytics = {
      complaintTrends: [
        { month: 'Jan', complaints: 45, resolved: 42 },
        { month: 'Feb', complaints: 52, resolved: 48 },
        { month: 'Mar', complaints: 38, resolved: 35 },
        { month: 'Apr', complaints: 61, resolved: 58 },
        { month: 'May', complaints: 49, resolved: 46 },
        { month: 'Jun', complaints: 55, resolved: 52 }
      ],
      categoryBreakdown: [
        { category: 'Power Outage', count: 45, percentage: 35 },
        { category: 'Billing Issue', count: 32, percentage: 25 },
        { category: 'Voltage Fluctuation', count: 28, percentage: 22 },
        { category: 'Line Damage', count: 15, percentage: 12 },
        { category: 'Other', count: 8, percentage: 6 }
      ],
      regionPerformance: [
        { region: 'Addis Ababa', complaints: 89, resolved: 82, rate: 92 },
        { region: 'Oromia', complaints: 67, resolved: 59, rate: 88 },
        { region: 'Amhara', complaints: 54, resolved: 47, rate: 87 },
        { region: 'Tigray', complaints: 32, resolved: 28, rate: 88 }
      ]
    };
    
    return { success: true, data: analytics };
  } catch (error) {
    Logger.log('getAnalytics error: ' + error.message);
    return { success: false, error: 'Failed to get analytics: ' + error.message };
  }
}

// --- EXPORT DATA ---
function exportData(params) {
  try {
    // This would typically generate export data
    // For now, return success message
    return { 
      success: true, 
      data: 'Export data would be generated here',
      message: 'Export functionality not yet implemented' 
    };
  } catch (error) {
    Logger.log('exportData error: ' + error.message);
    return { success: false, error: 'Failed to export data: ' + error.message };
  }
}

// --- ACTIVITY LOGGING FUNCTION ---
function logActivity(type, title, description, userId, userName, userRole, priority, region, complaintId, isImportant) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.ACTIVITY_FEED_SHEET);
    if (!sheet) return;
    
    const activityId = 'ACT-' + Date.now();
    const newActivity = [
      activityId,
      type,
      title,
      description,
      userId || '',
      userName || '',
      userRole || '',
      priority || '',
      region || '',
      complaintId || '',
      isImportant || false,
      new Date().toISOString()
    ];
    
    sheet.appendRow(newActivity);
  } catch (error) {
    Logger.log('logActivity error: ' + error.message);
  }
}

// --- HEALTH CHECK ENDPOINT ---
function healthCheck() {
  try {
    const complaintSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.COMPLAINT_SHEET);
    const userSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.USER_SHEET);
    const complaintRows = complaintSheet ? complaintSheet.getLastRow() : 0;
    const userRows = userSheet ? userSheet.getLastRow() : 0;
    
    return {
      success: true,
      data: {
        status: 'ok',
        complaintsSheet: complaintRows > 0 ? 'available' : 'empty',
        usersSheet: userRows > 0 ? 'available' : 'empty',
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}