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
        headers.forEach((h, j) => {
          if (h !== 'ID' && h !== 'Created At' && data[h] !== undefined) {
            sheet.getRange(i + 1, j + 1).setValue(data[h]);
          }
        });
        const updatedAtIdx = headers.indexOf('Updated At');
        if (updatedAtIdx !== -1) {
          sheet.getRange(i + 1, updatedAtIdx + 1).setValue(new Date().toISOString());
        }
        return { message: 'User updated successfully', success: true };
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
    const isActiveIdx = headers.indexOf('Is Active');
    
    if (idIdx === -1 || isActiveIdx === -1) return { error: 'ID or Is Active column missing', success: false };
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][idIdx] == data.id) {
        // Soft delete - set Is Active to false
        sheet.getRange(i + 1, isActiveIdx + 1).setValue(false);
        const updatedAtIdx = headers.indexOf('Updated At');
        if (updatedAtIdx !== -1) {
          sheet.getRange(i + 1, updatedAtIdx + 1).setValue(new Date().toISOString());
        }
        return { message: 'User deactivated successfully', success: true };
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
    
    if (idIdx === -1 || passwordIdx === -1) return { error: 'ID or Password column missing', success: false };
    
    const newPassword = data.newPassword || 'temp123';
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][idIdx] == data.id) {
        sheet.getRange(i + 1, passwordIdx + 1).setValue(newPassword);
        const updatedAtIdx = headers.indexOf('Updated At');
        if (updatedAtIdx !== -1) {
          sheet.getRange(i + 1, updatedAtIdx + 1).setValue(new Date().toISOString());
        }
        return { message: 'Password reset successfully', success: true };
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
    if (!data.title || !data.description) {
      return { error: 'Missing required fields: title, description', success: false };
    }
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.COMPLAINT_SHEET);
    if (!sheet) {
      return { error: 'Complaints sheet not found', success: false };
    }
    const headers = sheet.getDataRange().getValues()[0];
    const newComplaint = {
      ID: 'CMP-' + Date.now(),
      'Customer ID': data.customerId || '',
      'Customer Name': data.customerName || '',
      'Customer Email': data.customerEmail || '',
      'Customer Phone': data.customerPhone || '',
      Title: data.title,
      Description: data.description,
      Category: data.category || 'other',
      Priority: data.priority || 'medium',
      Status: data.status || 'open',
      Region: data.region || '',
      'Assigned To': data.assignedTo || '',
      'Assigned By': data.assignedBy || '',
      'Created By': data.createdBy || '',
      'Created At': new Date().toISOString(),
      'Updated At': new Date().toISOString(),
      'Estimated Resolution': data.estimatedResolution || '',
      'Resolved At': '',
      Notes: data.notes || ''
    };
    
    const row = headers.map(h => newComplaint[h] !== undefined ? newComplaint[h] : '');
    sheet.appendRow(row);
    
    return {
      message: 'Complaint created successfully',
      complaint: newComplaint,
      success: true
    };
  } catch (error) {
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
        headers.forEach((h, j) => {
          if (h !== 'ID' && h !== 'Created At' && data[h] !== undefined) {
            sheet.getRange(i + 1, j + 1).setValue(data[h]);
          }
        });
        const updatedAtIdx = headers.indexOf('Updated At');
        if (updatedAtIdx !== -1) {
          sheet.getRange(i + 1, updatedAtIdx + 1).setValue(new Date().toISOString());
        }
        
        // If status is being set to resolved, set resolved date
        if (data.Status === 'resolved' || data.status === 'resolved') {
          const resolvedAtIdx = headers.indexOf('Resolved At');
          if (resolvedAtIdx !== -1) {
            sheet.getRange(i + 1, resolvedAtIdx + 1).setValue(new Date().toISOString());
          }
        }
        
        return { message: 'Complaint updated successfully', success: true };
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
    
    return { data: customers, success: true };
  } catch (error) {
    Logger.log('getCustomersInternal error: ' + error.message);
    return { error: 'Failed to get customers: ' + error.message, success: false };
  }
}

function createCustomerInternal(data) {
  try {
    if (!data.name || !data.email) {
      return { error: 'Missing required fields: name, email', success: false };
    }
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.CUSTOMER_SHEET);
    if (!sheet) {
      return { error: 'Customers sheet not found', success: false };
    }
    const headers = sheet.getDataRange().getValues()[0];
    const newCustomer = {
      ID: 'CUST-' + Date.now(),
      Name: data.name,
      Email: data.email,
      Phone: data.phone || '',
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
      customer: newCustomer,
      success: true
    };
  } catch (error) {
    return { error: 'Failed to create customer: ' + error.message, success: false };
  }
}

// --- DASHBOARD STATS FUNCTION ---
function getDashboardStatsInternal() {
  try {
    const complaintSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.COMPLAINT_SHEET);
    const userSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.USER_SHEET);
    
    let stats = {
      complaints: {
        total: 0,
        open: 0,
        'in-progress': 0,
        resolved: 0,
        closed: 0,
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      },
      users: {
        total: 0,
        active: 0
      },
      performance: {
        resolutionRate: 85,
        avgResponseTime: 2.5,
        customerSatisfaction: 4.2
      }
    };
    
    // Calculate complaint stats
    if (complaintSheet) {
      const data = complaintSheet.getDataRange().getValues();
      if (data.length > 1) {
        const headers = data[0];
        const statusIdx = headers.indexOf('Status');
        const priorityIdx = headers.indexOf('Priority');
        
        stats.complaints.total = data.length - 1;
        
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          const status = (row[statusIdx] || '').toLowerCase();
          const priority = (row[priorityIdx] || '').toLowerCase();
          
          // Count by status
          if (status === 'open') stats.complaints.open++;
          else if (status === 'in-progress') stats.complaints['in-progress']++;
          else if (status === 'resolved') stats.complaints.resolved++;
          else if (status === 'closed') stats.complaints.closed++;
          
          // Count by priority
          if (priority === 'low') stats.complaints.low++;
          else if (priority === 'medium') stats.complaints.medium++;
          else if (priority === 'high') stats.complaints.high++;
          else if (priority === 'critical') stats.complaints.critical++;
        }
      }
    }
    
    // Calculate user stats
    if (userSheet) {
      const data = userSheet.getDataRange().getValues();
      if (data.length > 1) {
        const headers = data[0];
        const isActiveIdx = headers.indexOf('Is Active');
        
        stats.users.total = data.length - 1;
        
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          const isActive = row[isActiveIdx];
          
          if (isActive === true || isActive === 'TRUE' || isActive === 'true') {
            stats.users.active++;
          }
        }
      }
    }
    
    return { data: stats, success: true };
  } catch (error) {
    Logger.log('getDashboardStatsInternal error: ' + error.message);
    return { error: 'Failed to get dashboard stats: ' + error.message, success: false };
  }
}

// --- ACTIVITY FEED FUNCTION ---
function getActivityFeedInternal(params) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.ACTIVITY_SHEET);
    if (!sheet) {
      // Return empty activity feed if sheet doesn't exist
      return { data: [], success: true };
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return { data: [], success: true };
    }
    
    const headers = data[0];
    const activities = [];
    
    // Get recent activities (last 50)
    const startRow = Math.max(1, data.length - 50);
    for (let i = startRow; i < data.length; i++) {
      const row = data[i];
      let activity = {};
      for (let j = 0; j < headers.length; j++) {
        activity[headers[j]] = row[j] || '';
      }
      activities.push(activity);
    }
    
    // Sort by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));
    
    return { data: activities, success: true };
  } catch (error) {
    Logger.log('getActivityFeedInternal error: ' + error.message);
    return { error: 'Failed to get activity feed: ' + error.message, success: false };
  }
}

// --- UTILITY FUNCTION FOR ACTIVITY LOGGING ---
function logActivity(type, title, description, userId, userName, userRole, complaintId, region, metadata, isImportant) {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let activitySheet = spreadsheet.getSheetByName(CONFIG.ACTIVITY_SHEET);
    
    // Create activity log sheet if it doesn't exist
    if (!activitySheet) {
      activitySheet = spreadsheet.insertSheet(CONFIG.ACTIVITY_SHEET);
      const headers = ['ID', 'Type', 'Title', 'Description', 'User ID', 'User Name', 'User Role', 'Complaint ID', 'Region', 'Metadata', 'Is Important', 'Timestamp'];
      activitySheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    const activityData = [
      'ACT-' + Date.now(),
      type || '',
      title || '',
      description || '',
      userId || '',
      userName || '',
      userRole || '',
      complaintId || '',
      region || '',
      JSON.stringify(metadata || {}),
      isImportant || false,
      new Date().toISOString()
    ];
    
    activitySheet.appendRow(activityData);
  } catch (error) {
    Logger.log('logActivity error: ' + error.message);
  }
}