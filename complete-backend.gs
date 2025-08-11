/**
 * Complete Google Apps Script Backend for Ethiopian Electric Utility Portal
 * This script handles all backend operations including authentication, user management,
 * complaint management, customer management, and dashboard analytics.
 */

// --- CONFIGURATION ---
const CONFIG = {
  SHEET_ID: '1vi7SguM67N8BP5_5dNSPh4GO0WDe-Y6_LwfY-GliW0o',
  USER_SHEET: 'Users',
  COMPLAINT_SHEET: 'Complaints',
  CUSTOMER_SHEET: 'Customers',
  ACTIVITY_SHEET: 'Activity_Log'
};

// --- AUTHENTICATE USER FUNCTION (IMPROVED) ---
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
      if (!row[emailIdx] || !row[passwordIdx]) continue; // Skip blank rows
      if ((row[emailIdx] + '').trim().toLowerCase() === email && (row[passwordIdx] + '').trim() === password) {
        // Build user object without password
        let user = {};
        for (let j = 0; j < headers.length; j++) {
          if (headers[j] !== 'Password') {
            user[headers[j]] = row[j] || '';
          }
        }
        
        // Ensure required fields exist with safe defaults
        user.ID = user.ID || 'USR-' + Date.now();
        user.Name = user.Name || 'Unknown User';
        user.Email = user.Email || email;
        user.Role = user.Role || 'technician';
        user.Region = user.Region || '';
        
        return {
          success: true,
          user: user,
          message: 'Login successful'
        };
      }
    }
    return { success: false, error: 'Invalid credentials' };
  } catch (error) {
    Logger.log('authenticateUser error: ' + error.message);
    return { success: false, error: 'Login error: ' + error.message };
  }
}

// --- HEALTH CHECK ENDPOINT ---
function healthCheck() {
  try {
    const complaintSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.COMPLAINT_SHEET);
    const userSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.USER_SHEET);
    const complaintRows = complaintSheet ? complaintSheet.getLastRow() : 0;
    const userRows = userSheet ? userSheet.getLastRow() : 0;
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ok',
      complaintsSheet: complaintRows > 0 ? 'available' : 'empty',
      usersSheet: userRows > 0 ? 'available' : 'empty',
      timestamp: new Date().toISOString(),
      success: true
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      error: error.message,
      success: false,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// --- MAIN HANDLERS - GUARANTEED ContentService RESPONSES ---
function doGet(e) {
  try {
    Logger.log('doGet called with params: ' + JSON.stringify(e && e.parameter));

    // Handle health check directly
    if (e.parameter && e.parameter.action === 'healthCheck') {
      return healthCheck();
    }

    // Handle other GET requests
    return handleAllRequests(e, null);

  } catch (error) {
    Logger.log('doGet error: ' + error.message);
    return ContentService.createTextOutput(JSON.stringify({
      error: 'doGet error: ' + error.message,
      success: false
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    let data = {};

    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseError) {
        return jsonResponse({ error: "Invalid JSON format", success: false });
      }
    }

    return handleAllRequests(e, data);
  } catch (error) {
    Logger.log('doPost error: ' + error.message);
    return jsonResponse({ error: 'doPost error: ' + error.message, success: false });
  }
}

function handleAllRequests(e, data) {
  try {
    const params = e.parameter || {};
    const action = data?.action || params?.action;

    Logger.log('handleAllRequests - action: ' + action);
    Logger.log('data: ' + JSON.stringify(data));

    let result = { error: 'No action specified', success: false };

    if (action) {
      switch (action) {
        case 'login':
          result = loginInternal(data);
          break;
        case 'getUsers':
          result = getUsersInternal(params);
          break;
        case 'createUser':
          result = createUserInternal(data);
          break;
        case 'updateUser':
          result = updateUserInternal(data);
          break;
        case 'deleteUser':
          result = deleteUserInternal(data);
          break;
        case 'resetUserPassword':
          result = resetUserPasswordInternal(data);
          break;
        case 'getComplaints':
          result = getComplaintsInternal(params);
          break;
        case 'createComplaint':
          result = createComplaintInternal(data);
          break;
        case 'updateComplaint':
          result = updateComplaintInternal(data);
          break;
        case 'getCustomers':
          result = getCustomersInternal(params);
          break;
        case 'createCustomer':
          result = createCustomerInternal(data);
          break;
        case 'getDashboardStats':
          result = getDashboardStatsInternal();
          break;
        case 'getActivityFeed':
          result = getActivityFeedInternal(params);
          break;
        case 'healthCheck':
          return healthCheck();
        default:
          result = { error: 'Invalid action: ' + action, success: false };
      }
    }

    return jsonResponse(result);
  } catch (error) {
    Logger.log('handleAllRequests error: ' + error.message);
    return jsonResponse({ error: 'Handler error: ' + error.message, success: false });
  }
}

// ✅ CORS-friendly JSON Response
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// --- LOGIN INTERNAL FUNCTION ---
function loginInternal(data) {
  return authenticateUser(data.email, data.password);
}

// --- USER CRUD FUNCTIONS ---
function getUsersInternal(params) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.USER_SHEET);
    if (!sheet) {
      Logger.log('getUsersInternal error: Users sheet not found');
      return { error: 'Users sheet not found', success: false };
    }
    const data = sheet.getDataRange().getValues();
    if (!data || data.length === 0) {
      Logger.log('getUsersInternal error: No data in Users sheet');
      return { data: [], pagination: { page: 1, limit: 0, total: 0, totalPages: 1, hasNext: false, hasPrev: false }, success: true };
    }
    const headers = data[0];
    if (!headers || headers.length === 0) {
      Logger.log('getUsersInternal error: No headers in Users sheet');
      return { error: 'No headers in Users sheet', success: false };
    }
    const users = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row.every(cell => cell === '' || cell === null || typeof cell === 'undefined')) continue;
      let user = {};
      for (let j = 0; j < headers.length; j++) {
        user[headers[j]] = row[j] || '';
      }
      delete user.Password;
      users.push(user);
    }
    return {
      data: users,
      pagination: {
        page: 1,
        limit: users.length,
        total: users.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      },
      success: true
    };
  } catch (error) {
    Logger.log('getUsersInternal error: ' + error.message);
    return { error: 'Failed to get users: ' + error.message, success: false };
  }
}

function createUserInternal(data) {
  try {
    if (!data.name || !data.email || !data.role) {
      return { error: 'Missing required fields: name, email, role', success: false };
    }
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.USER_SHEET);
    if (!sheet) {
      return { error: 'Users sheet not found', success: false };
    }
    const headers = sheet.getDataRange().getValues()[0];
    const newUser = {
      ID: 'USR-' + Date.now(),
      Name: data.name,
      Email: data.email,
      Password: data.password || 'temp123',
      Role: data.role,
      Region: data.region || '',
      Department: data.department || '',
      Phone: data.phone || '',
      'Is Active': true,
      'Created At': new Date().toISOString(),
      'Updated At': new Date().toISOString()
    };
    const row = headers.map(h => newUser[h] !== undefined ? newUser[h] : '');
    sheet.appendRow(row);
    
    delete newUser.Password; // Don't return password
    return {
      message: 'User created successfully',
      user: newUser,
      success: true
    };
  } catch (error) {
    return { error: 'Failed to create user: ' + error.message, success: false };
  }
}

function updateUserInternal(data) {
  try {
    if (!data.id) return { error: 'Missing user ID', success: false };
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.USER_SHEET);
    if (!sheet) return { error: 'Users sheet not found', success: false };
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const idIdx = headers.indexOf('ID');
    if (idIdx === -1) return { error: 'ID column missing', success: false };
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][idIdx] == data.id) {
        // Update user data
        const updatedUser = { ...data, 'Updated At': new Date().toISOString() };
        const row = headers.map(h => updatedUser[h] !== undefined ? updatedUser[h] : values[i][headers.indexOf(h)]);
        sheet.getRange(i + 1, 1, 1, headers.length).setValues([row]);
        
        delete updatedUser.Password; // Don't return password
        return {
          message: 'User updated successfully',
          user: updatedUser,
          success: true
        };
      }
    }
    return { error: 'User not found', success: false };
  } catch (error) {
    return { error: 'Failed to update user: ' + error.message, success: false };
  }
}

function deleteUserInternal(data) {
  try {
    if (!data.id) return { error: 'Missing user ID', success: false };
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.USER_SHEET);
    if (!sheet) return { error: 'Users sheet not found', success: false };
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const idIdx = headers.indexOf('ID');
    const activeIdx = headers.indexOf('Is Active');
    if (idIdx === -1) return { error: 'ID column missing', success: false };
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][idIdx] == data.id) {
        // Deactivate user instead of deleting
        if (activeIdx !== -1) {
          sheet.getRange(i + 1, activeIdx + 1).setValue(false);
        }
        return {
          message: 'User deactivated successfully',
          success: true
        };
      }
    }
    return { error: 'User not found', success: false };
  } catch (error) {
    return { error: 'Failed to delete user: ' + error.message, success: false };
  }
}

function resetUserPasswordInternal(data) {
  try {
    if (!data.id) return { error: 'Missing user ID', success: false };
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.USER_SHEET);
    if (!sheet) return { error: 'Users sheet not found', success: false };
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const idIdx = headers.indexOf('ID');
    const passwordIdx = headers.indexOf('Password');
    if (idIdx === -1 || passwordIdx === -1) return { error: 'Required columns missing', success: false };
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][idIdx] == data.id) {
        const newPassword = data.newPassword || 'temp123';
        sheet.getRange(i + 1, passwordIdx + 1).setValue(newPassword);
        return {
          message: 'Password reset successfully',
          success: true
        };
      }
    }
    return { error: 'User not found', success: false };
  } catch (error) {
    return { error: 'Failed to reset password: ' + error.message, success: false };
  }
}

// --- COMPLAINT CRUD FUNCTIONS ---
function getComplaintsInternal(params) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.COMPLAINT_SHEET);
    if (!sheet) {
      return { error: 'Complaints sheet not found', success: false };
    }
    const data = sheet.getDataRange().getValues();
    if (!data || data.length === 0) {
      return { data: [], pagination: { page: 1, limit: 0, total: 0, totalPages: 1, hasNext: false, hasPrev: false }, success: true };
    }
    const headers = data[0];
    const complaints = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row.every(cell => cell === '' || cell === null || typeof cell === 'undefined')) continue;
      let complaint = {};
      for (let j = 0; j < headers.length; j++) {
        complaint[headers[j]] = row[j] || '';
      }
      complaints.push(complaint);
    }
    return {
      data: complaints,
      pagination: {
        page: 1,
        limit: complaints.length,
        total: complaints.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      },
      success: true
    };
  } catch (error) {
    Logger.log('getComplaintsInternal error: ' + error.message);
    return { error: 'Failed to get complaints: ' + error.message, success: false };
  }
}

function createComplaintInternal(data) {
  try {
    Logger.log('createComplaintInternal called with data: ' + JSON.stringify(data));
    
    if (!data.title || !data.description) {
      return { error: 'Missing required fields: title, description', success: false };
    }
    
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.COMPLAINT_SHEET);
    if (!sheet) {
      return { error: 'Complaints sheet not found', success: false };
    }
    
    const headers = sheet.getDataRange().getValues()[0];
    const complaintId = 'CMP-' + Date.now();
    const timestamp = new Date().toISOString();
    
    // Extract customer data from the request
    const customer = data.customer || {};
    
    const newComplaint = {
      'ID': complaintId,
      'Customer ID': customer.id || 'CUST-' + Date.now(),
      'Customer Name': customer.name || data.customerName || '',
      'Customer Email': customer.email || data.customerEmail || '',
      'Customer Phone': customer.phone || data.customerPhone || '',
      'Customer Address': customer.address || data.customerAddress || '',
      'Region': customer.region || data.region || '',
      'Title': data.title,
      'Description': data.description,
      'Category': data.category || 'other',
      'Priority': data.priority || 'medium',
      'Status': 'open',
      'Assigned To': '',
      'Assigned By': '',
      'Created By': data.createdBy || 'anonymous',
      'Created At': timestamp,
      'Updated At': timestamp,
      'Estimated Resolution': '',
      'Resolved At': '',
      'Resolution Notes': '',
      'Customer Satisfaction': '',
      'Follow Up Required': false,
      'Cost Impact': '',
      'Service Interruption Duration': '',
      'Affected Customers Count': 1,
      'Language': 'en',
      'Attachments': '',
      'Internal Notes': ''
    };
    
    // Create row data matching the headers
    const row = headers.map(h => newComplaint[h] !== undefined ? newComplaint[h] : '');
    sheet.appendRow(row);
    
    // Log activity
    logActivity('complaint_created', 'New complaint created: ' + data.title, data.createdBy || 'anonymous', complaintId);
    
    Logger.log('Complaint created successfully with ID: ' + complaintId);
    
    return {
      message: 'Complaint created successfully',
      data: { id: complaintId, ...newComplaint },
      success: true
    };
  } catch (error) {
    Logger.log('createComplaintInternal error: ' + error.message);
    return { error: 'Failed to create complaint: ' + error.message, success: false };
  }
}

function updateComplaintInternal(data) {
  try {
    if (!data.id) return { error: 'Missing complaint ID', success: false };
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.COMPLAINT_SHEET);
    if (!sheet) return { error: 'Complaints sheet not found', success: false };
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const idIdx = headers.indexOf('ID');
    if (idIdx === -1) return { error: 'ID column missing', success: false };
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][idIdx] == data.id) {
        // Update complaint data
        const updatedComplaint = { ...data, 'Updated At': new Date().toISOString() };
        const row = headers.map(h => updatedComplaint[h] !== undefined ? updatedComplaint[h] : values[i][headers.indexOf(h)]);
        sheet.getRange(i + 1, 1, 1, headers.length).setValues([row]);
        
        // Log activity
        logActivity('complaint_updated', 'Complaint updated: ' + data.title, data.updatedBy || 'anonymous', data.id);
        
        return {
          message: 'Complaint updated successfully',
          data: updatedComplaint,
          success: true
        };
      }
    }
    return { error: 'Complaint not found', success: false };
  } catch (error) {
    return { error: 'Failed to update complaint: ' + error.message, success: false };
  }
}

// --- CUSTOMER CRUD FUNCTIONS ---
function getCustomersInternal(params) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.CUSTOMER_SHEET);
    if (!sheet) {
      return { error: 'Customers sheet not found', success: false };
    }
    const data = sheet.getDataRange().getValues();
    if (!data || data.length === 0) {
      return { data: [], success: true };
    }
    const headers = data[0];
    const customers = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row.every(cell => cell === '' || cell === null || typeof cell === 'undefined')) continue;
      let customer = {};
      for (let j = 0; j < headers.length; j++) {
        customer[headers[j]] = row[j] || '';
      }
      customers.push(customer);
    }
    return {
      data: customers,
      success: true
    };
  } catch (error) {
    Logger.log('getCustomersInternal error: ' + error.message);
    return { error: 'Failed to get customers: ' + error.message, success: false };
  }
}

function createCustomerInternal(data) {
  try {
    if (!data.name || !data.phone) {
      return { error: 'Missing required fields: name, phone', success: false };
    }
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.CUSTOMER_SHEET);
    if (!sheet) {
      return { error: 'Customers sheet not found', success: false };
    }
    const headers = sheet.getDataRange().getValues()[0];
    const newCustomer = {
      ID: 'CUST-' + Date.now(),
      Name: data.name,
      Email: data.email || '',
      Phone: data.phone,
      Address: data.address || '',
      Region: data.region || '',
      'Meter Number': data.meterNumber || '',
      'Account Number': data.accountNumber || '',
      'Created At': new Date().toISOString(),
      'Updated At': new Date().toISOString()
    };
    const row = headers.map(h => newCustomer[h] !== undefined ? newCustomer[h] : '');
    sheet.appendRow(row);
    
    return {
      message: 'Customer created successfully',
      data: newCustomer,
      success: true
    };
  } catch (error) {
    return { error: 'Failed to create customer: ' + error.message, success: false };
  }
}

// --- DASHBOARD FUNCTIONS ---
function getDashboardStatsInternal() {
  try {
    const complaintsSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.COMPLAINT_SHEET);
    const usersSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.USER_SHEET);
    const customersSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.CUSTOMER_SHEET);
    
    let stats = {
      totalComplaints: 0,
      openComplaints: 0,
      resolvedComplaints: 0,
      inProgressComplaints: 0,
      totalUsers: 0,
      activeUsers: 0,
      totalCustomers: 0,
      recentComplaints: [],
      complaintsByCategory: {},
      complaintsByPriority: {},
      complaintsByRegion: {},
      performance: {
        resolutionRate: 85,
        averageResolutionTime: 2.5,
        customerSatisfaction: 4.2
      }
    };
    
    // Get complaints data
    if (complaintsSheet) {
      const complaintsData = complaintsSheet.getDataRange().getValues();
      if (complaintsData.length > 1) {
        const headers = complaintsData[0];
        const statusIdx = headers.indexOf('Status');
        const categoryIdx = headers.indexOf('Category');
        const priorityIdx = headers.indexOf('Priority');
        const regionIdx = headers.indexOf('Region');
        const createdAtIdx = headers.indexOf('Created At');
        
        for (let i = 1; i < complaintsData.length; i++) {
          const row = complaintsData[i];
          if (row.every(cell => cell === '' || cell === null)) continue;
          
          stats.totalComplaints++;
          
          const status = row[statusIdx] || 'open';
          if (status === 'open') stats.openComplaints++;
          else if (status === 'resolved') stats.resolvedComplaints++;
          else if (status === 'in-progress') stats.inProgressComplaints++;
          
          // Category stats
          const category = row[categoryIdx] || 'other';
          stats.complaintsByCategory[category] = (stats.complaintsByCategory[category] || 0) + 1;
          
          // Priority stats
          const priority = row[priorityIdx] || 'medium';
          stats.complaintsByPriority[priority] = (stats.complaintsByPriority[priority] || 0) + 1;
          
          // Region stats
          const region = row[regionIdx] || 'Unknown';
          stats.complaintsByRegion[region] = (stats.complaintsByRegion[region] || 0) + 1;
          
          // Recent complaints (last 5)
          if (stats.recentComplaints.length < 5) {
            let complaint = {};
            for (let j = 0; j < headers.length; j++) {
              complaint[headers[j]] = row[j] || '';
            }
            stats.recentComplaints.push(complaint);
          }
        }
      }
    }
    
    // Get users data
    if (usersSheet) {
      const usersData = usersSheet.getDataRange().getValues();
      if (usersData.length > 1) {
        const headers = usersData[0];
        const activeIdx = headers.indexOf('Is Active');
        
        for (let i = 1; i < usersData.length; i++) {
          const row = usersData[i];
          if (row.every(cell => cell === '' || cell === null)) continue;
          
          stats.totalUsers++;
          if (activeIdx !== -1 && row[activeIdx]) {
            stats.activeUsers++;
          }
        }
      }
    }
    
    // Get customers data
    if (customersSheet) {
      const customersData = customersSheet.getDataRange().getValues();
      stats.totalCustomers = Math.max(0, customersData.length - 1);
    }
    
    return {
      data: stats,
      success: true
    };
  } catch (error) {
    Logger.log('getDashboardStatsInternal error: ' + error.message);
    return { error: 'Failed to get dashboard stats: ' + error.message, success: false };
  }
}

// --- ACTIVITY LOGGING ---
function getActivityFeedInternal(params) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.ACTIVITY_SHEET);
    if (!sheet) {
      return { data: [], success: true };
    }
    const data = sheet.getDataRange().getValues();
    if (!data || data.length === 0) {
      return { data: [], success: true };
    }
    const headers = data[0];
    const activities = [];
    for (let i = 1; i < Math.min(data.length, 21); i++) { // Get last 20 activities
      const row = data[i];
      if (row.every(cell => cell === '' || cell === null)) continue;
      let activity = {};
      for (let j = 0; j < headers.length; j++) {
        activity[headers[j]] = row[j] || '';
      }
      activities.push(activity);
    }
    return {
      data: activities.reverse(), // Most recent first
      success: true
    };
  } catch (error) {
    Logger.log('getActivityFeedInternal error: ' + error.message);
    return { error: 'Failed to get activity feed: ' + error.message, success: false };
  }
}

function logActivity(type, description, userId, relatedId) {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let sheet = spreadsheet.getSheetByName(CONFIG.ACTIVITY_SHEET);
    
    // Create activity sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONFIG.ACTIVITY_SHEET);
      const headers = ['ID', 'Type', 'Description', 'User ID', 'User Name', 'Timestamp', 'Related ID', 'Related Type'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    const activityId = 'ACT-' + Date.now();
    const timestamp = new Date().toISOString();
    
    const activity = [
      activityId,
      type,
      description,
      userId || 'anonymous',
      '', // User name - could be populated from user data
      timestamp,
      relatedId || '',
      type.includes('complaint') ? 'complaint' : type.includes('user') ? 'user' : 'system'
    ];
    
    sheet.appendRow(activity);
  } catch (error) {
    Logger.log('logActivity error: ' + error.message);
  }
}

// --- UTILITY FUNCTIONS ---
function generateId(prefix) {
  return prefix + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^\+?[\d\s\-\(\)]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// --- INITIALIZATION FUNCTIONS ---
function initializeSheets() {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    
    // Create sheets if they don't exist
    const requiredSheets = [CONFIG.USER_SHEET, CONFIG.COMPLAINT_SHEET, CONFIG.CUSTOMER_SHEET, CONFIG.ACTIVITY_SHEET];
    
    requiredSheets.forEach(sheetName => {
      let sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(sheetName);
        
        // Add headers based on sheet type
        if (sheetName === CONFIG.USER_SHEET) {
          const headers = ['ID', 'Name', 'Email', 'Password', 'Role', 'Region', 'Department', 'Phone', 'Is Active', 'Created At', 'Updated At'];
          sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        } else if (sheetName === CONFIG.COMPLAINT_SHEET) {
          const headers = ['ID', 'Customer ID', 'Customer Name', 'Customer Email', 'Customer Phone', 'Customer Address', 'Region', 'Title', 'Description', 'Category', 'Priority', 'Status', 'Assigned To', 'Assigned By', 'Created By', 'Created At', 'Updated At', 'Estimated Resolution', 'Resolved At', 'Resolution Notes', 'Customer Satisfaction', 'Follow Up Required', 'Cost Impact', 'Service Interruption Duration', 'Affected Customers Count', 'Language', 'Attachments', 'Internal Notes'];
          sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        } else if (sheetName === CONFIG.CUSTOMER_SHEET) {
          const headers = ['ID', 'Name', 'Email', 'Phone', 'Address', 'Region', 'Meter Number', 'Account Number', 'Created At', 'Updated At'];
          sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        } else if (sheetName === CONFIG.ACTIVITY_SHEET) {
          const headers = ['ID', 'Type', 'Description', 'User ID', 'User Name', 'Timestamp', 'Related ID', 'Related Type'];
          sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        }
      }
    });
    
    return { success: true, message: 'Sheets initialized successfully' };
  } catch (error) {
    Logger.log('initializeSheets error: ' + error.message);
    return { success: false, error: error.message };
  }
}

// --- TEST FUNCTIONS ---
function testBackend() {
  Logger.log('Testing backend functionality...');
  
  // Test health check
  const health = healthCheck();
  Logger.log('Health check result: ' + health.getContent());
  
  // Test authentication
  const loginResult = authenticateUser('admin@eeu.gov.et', 'admin123');
  Logger.log('Login test result: ' + JSON.stringify(loginResult));
  
  // Test dashboard stats
  const statsResult = getDashboardStatsInternal();
  Logger.log('Dashboard stats result: ' + JSON.stringify(statsResult));
  
  Logger.log('Backend test completed');
}