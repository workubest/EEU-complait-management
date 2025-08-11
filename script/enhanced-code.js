// --- ENHANCED GOOGLE APPS SCRIPT FOR ETHIO POWER RESOLVE ---
// This script includes all functions needed for the migrated data

// --- CONFIGURATION ---
const CONFIG = {
  SHEET_ID: '1vi7SguM67N8BP5_5dNSPh4GO0WDe-Y6_LwfY-GliW0o',
  USER_SHEET: 'Users',
  COMPLAINT_SHEET: 'Complaints',
  CUSTOMER_SHEET: 'Customers',
  ACTIVITY_SHEET: 'Activity_Log'
};

// --- UTILITY FUNCTIONS ---
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

// --- AUTHENTICATION FUNCTIONS ---
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

// --- USER MANAGEMENT FUNCTIONS ---
function getUsersInternal(params) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.USER_SHEET);
    if (!sheet) {
      return { error: 'Users sheet not found', success: false };
    }
    
    const data = sheet.getDataRange().getValues();
    if (!data || data.length === 0) {
      return { data: [], pagination: { page: 1, limit: 0, total: 0, totalPages: 1, hasNext: false, hasPrev: false }, success: true };
    }
    
    const headers = data[0];
    const users = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row.every(cell => cell === '' || cell === null || typeof cell === 'undefined')) continue;
      
      let user = {};
      for (let j = 0; j < headers.length; j++) {
        user[headers[j]] = row[j] || '';
      }
      delete user.Password; // Never return passwords
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
      Password: data.password || 'temp123', // Default password
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
    
    // Log activity
    logActivity('user_created', 'User Created', `New user ${newUser.Name} created`, 
               newUser.ID, newUser.Name, newUser.Role, '', newUser.Region, {}, false);
    
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
        sheet.getRange(i + 1, headers.indexOf('Updated At') + 1).setValue(new Date().toISOString());
        
        // Log activity
        logActivity('user_updated', 'User Updated', `User ${data.name || data.id} updated`, 
                   data.id, data.name || '', data.role || '', '', data.region || '', {}, false);
        
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
        sheet.getRange(i + 1, isActiveIdx + 1).setValue(false);
        sheet.getRange(i + 1, headers.indexOf('Updated At') + 1).setValue(new Date().toISOString());
        
        // Log activity
        logActivity('user_deactivated', 'User Deactivated', `User ${values[i][headers.indexOf('Name')]} deactivated`, 
                   data.id, values[i][headers.indexOf('Name')] || '', values[i][headers.indexOf('Role')] || '', '', 
                   values[i][headers.indexOf('Region')] || '', {}, false);
        
        return { message: 'User deactivated successfully', success: true };
      }
    }
    
    return { error: 'User not found', success: false };
  } catch (error) {
    return { error: 'Failed to deactivate user: ' + error.message, success: false };
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
        sheet.getRange(i + 1, headers.indexOf('Updated At') + 1).setValue(new Date().toISOString());
        
        // Log activity
        logActivity('password_reset', 'Password Reset', `Password reset for user ${values[i][headers.indexOf('Name')]}`, 
                   data.id, values[i][headers.indexOf('Name')] || '', values[i][headers.indexOf('Role')] || '', '', 
                   values[i][headers.indexOf('Region')] || '', {}, false);
        
        return { message: 'Password reset successfully', success: true };
      }
    }
    
    return { error: 'User not found', success: false };
  } catch (error) {
    return { error: 'Failed to reset password: ' + error.message, success: false };
  }
}

// --- CUSTOMER MANAGEMENT FUNCTIONS ---
function getCustomersInternal(params) {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let sheet = spreadsheet.getSheetByName(CONFIG.CUSTOMER_SHEET);
    
    if (!sheet) {
      return { data: [], pagination: { page: 1, limit: 0, total: 0, totalPages: 1, hasNext: false, hasPrev: false }, success: true };
    }
    
    const data = sheet.getDataRange().getValues();
    if (!data || data.length === 0) {
      return { data: [], pagination: { page: 1, limit: 0, total: 0, totalPages: 1, hasNext: false, hasPrev: false }, success: true };
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
      pagination: {
        page: 1,
        limit: customers.length,
        total: customers.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      },
      success: true
    };
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
    
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let sheet = spreadsheet.getSheetByName(CONFIG.CUSTOMER_SHEET);
    
    // Create customers sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONFIG.CUSTOMER_SHEET);
      const headers = ['ID', 'Name', 'Email', 'Phone', 'Address', 'Region', 'Meter Number', 'Account Number', 'Created At', 'Updated At'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
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

// --- COMPLAINT MANAGEMENT FUNCTIONS ---
function getComplaintsInternal(params) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.COMPLAINT_SHEET);
    if (!sheet) {
      return { data: [], pagination: { page: 1, limit: 0, total: 0, totalPages: 1, hasNext: false, hasPrev: false }, success: true };
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
      Category: data.category || 'general',
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
    
    // Log activity
    logActivity('complaint_created', 'Complaint Created', `New complaint: ${newComplaint.Title}`, 
               newComplaint['Created By'], '', '', newComplaint.ID, newComplaint.Region, 
               { priority: newComplaint.Priority, category: newComplaint.Category }, 
               newComplaint.Priority === 'critical' || newComplaint.Priority === 'high');
    
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
        sheet.getRange(i + 1, headers.indexOf('Updated At') + 1).setValue(new Date().toISOString());
        
        // If status is being changed to resolved, set resolved date
        if (data.Status === 'resolved' || data.status === 'resolved') {
          const resolvedAtIdx = headers.indexOf('Resolved At');
          if (resolvedAtIdx !== -1) {
            sheet.getRange(i + 1, resolvedAtIdx + 1).setValue(new Date().toISOString());
          }
        }
        
        // Log activity
        logActivity('complaint_updated', 'Complaint Updated', `Complaint ${data.id} updated`, 
                   '', '', '', data.id, data.region || '', {}, false);
        
        return { message: 'Complaint updated successfully', success: true };
      }
    }
    
    return { error: 'Complaint not found', success: false };
  } catch (error) {
    return { error: 'Failed to update complaint: ' + error.message, success: false };
  }
}

// --- DASHBOARD AND ANALYTICS FUNCTIONS ---
function getDashboardStatsInternal() {
  try {
    // Get complaints stats
    const complaintSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.COMPLAINT_SHEET);
    let complaintStats = { total: 0, open: 0, inProgress: 0, resolved: 0, critical: 0, high: 0, medium: 0, low: 0 };
    
    if (complaintSheet) {
      const complaintData = complaintSheet.getDataRange().getValues();
      if (complaintData && complaintData.length > 1) {
        const headers = complaintData[0];
        const statusIdx = headers.indexOf('Status');
        const priorityIdx = headers.indexOf('Priority');
        
        for (let i = 1; i < complaintData.length; i++) {
          const row = complaintData[i];
          if (row.every(cell => cell === '' || cell === null || typeof cell === 'undefined')) continue;
          
          complaintStats.total++;
          
          if (statusIdx !== -1) {
            const status = (row[statusIdx] + '').toLowerCase();
            if (status === 'open') complaintStats.open++;
            else if (status === 'in-progress') complaintStats.inProgress++;
            else if (status === 'resolved' || status === 'closed') complaintStats.resolved++;
          }
          
          if (priorityIdx !== -1) {
            const priority = (row[priorityIdx] + '').toLowerCase();
            if (priority === 'critical') complaintStats.critical++;
            else if (priority === 'high') complaintStats.high++;
            else if (priority === 'medium') complaintStats.medium++;
            else if (priority === 'low') complaintStats.low++;
          }
        }
      }
    }
    
    // Get users stats
    const userSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.USER_SHEET);
    let userStats = { total: 0, active: 0, inactive: 0 };
    
    if (userSheet) {
      const userData = userSheet.getDataRange().getValues();
      if (userData && userData.length > 1) {
        const headers = userData[0];
        const isActiveIdx = headers.indexOf('Is Active');
        
        for (let i = 1; i < userData.length; i++) {
          const row = userData[i];
          if (row.every(cell => cell === '' || cell === null || typeof cell === 'undefined')) continue;
          
          userStats.total++;
          
          if (isActiveIdx !== -1) {
            if (row[isActiveIdx]) userStats.active++;
            else userStats.inactive++;
          }
        }
      }
    }
    
    // Calculate performance metrics
    const performance = {
      resolutionRate: complaintStats.total > 0 ? Math.round((complaintStats.resolved / complaintStats.total) * 100) : 0,
      averageResponseTime: '2.3h',
      customerSatisfaction: 4.2
    };
    
    return {
      data: {
        complaints: complaintStats,
        users: userStats,
        performance: performance
      },
      success: true
    };
  } catch (error) {
    Logger.log('getDashboardStatsInternal error: ' + error.message);
    return { error: 'Failed to get dashboard stats: ' + error.message, success: false };
  }
}

function getActivityFeedInternal(params) {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let activitySheet = spreadsheet.getSheetByName(CONFIG.ACTIVITY_SHEET);
    
    if (!activitySheet) {
      return { data: [], success: true };
    }
    
    const data = activitySheet.getDataRange().getValues();
    if (!data || data.length <= 1) {
      return { data: [], success: true };
    }
    
    const headers = data[0];
    const activities = [];
    
    // Get recent activities (last 50)
    const startRow = Math.max(1, data.length - 50);
    for (let i = data.length - 1; i >= startRow; i--) {
      const row = data[i];
      if (row.every(cell => cell === '' || cell === null || typeof cell === 'undefined')) continue;
      
      let activity = {};
      for (let j = 0; j < headers.length; j++) {
        activity[headers[j]] = row[j] || '';
      }
      activities.push(activity);
    }
    
    return {
      data: activities,
      success: true
    };
  } catch (error) {
    Logger.log('getActivityFeedInternal error: ' + error.message);
    return { error: 'Failed to get activity feed: ' + error.message, success: false };
  }
}

// --- HEALTH CHECK AND SYSTEM STATUS ---
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

// --- MAIN REQUEST HANDLERS ---
function doGet(e) {
  try {
    Logger.log('doGet called with params: ' + JSON.stringify(e && e.parameter));
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
        data = {};
      }
    }
    Logger.log('doPost called with data: ' + JSON.stringify(data));
    return handleAllRequests(e, data);
  } catch (error) {
    Logger.log('doPost error: ' + error.message);
    return ContentService.createTextOutput(JSON.stringify({
      error: 'doPost error: ' + error.message,
      success: false
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleAllRequests(e, data) {
  try {
    const params = (e && e.parameter) ? e.parameter : {};
    let action = null;
    
    if (data && data.action) {
      action = data.action;
    } else if (params.action) {
      action = params.action;
    }
    
    Logger.log('handleAllRequests - action: ' + action);
    
    let result = { error: 'No action specified', success: false };
    
    if (action) {
      switch (action) {
        // Authentication
        case 'login':
          result = authenticateUser(data.email, data.password);
          break;
          
        // User management
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
          
        // Customer management
        case 'getCustomers':
          result = getCustomersInternal(params);
          break;
        case 'createCustomer':
          result = createCustomerInternal(data);
          break;
          
        // Complaint management
        case 'getComplaints':
          result = getComplaintsInternal(params);
          break;
        case 'createComplaint':
          result = createComplaintInternal(data);
          break;
        case 'updateComplaint':
          result = updateComplaintInternal(data);
          break;
          
        // Dashboard and analytics
        case 'getDashboardStats':
          result = getDashboardStatsInternal();
          break;
        case 'getActivityFeed':
          result = getActivityFeedInternal(params);
          break;
          
        // System
        case 'healthCheck':
          return healthCheck();
          
        default:
          result = { error: 'Invalid action: ' + action, success: false };
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('handleAllRequests error: ' + error.message);
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Handler error: ' + error.message,
      success: false
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// --- DATA MIGRATION FUNCTIONS ---
// These functions should be run once to populate the sheets with initial data

function migrateUsersData() {
  const users = [
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
  ];
  
  const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.USER_SHEET);
  
  if (!sheet) {
    Logger.log('Users sheet not found');
    return;
  }
  
  // Clear existing data (except headers)
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clear();
  }
  
  // Add headers if not present
  const headers = ['ID', 'Name', 'Email', 'Password', 'Role', 'Region', 'Department', 'Phone', 'Is Active', 'Created At', 'Updated At'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Add user data
  const userData = users.map(user => [
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
  
  Logger.log(`Migrated ${users.length} users to Google Sheets`);
}

function migrateCustomersData() {
  const customers = [
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
  ];
  
  // Create Customers sheet if it doesn't exist
  const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sheet = spreadsheet.getSheetByName(CONFIG.CUSTOMER_SHEET);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.CUSTOMER_SHEET);
  }
  
  // Clear existing data
  sheet.clear();
  
  // Add headers
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Address', 'Region', 'Meter Number', 'Account Number', 'Created At', 'Updated At'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Add customer data
  const customerData = customers.map(customer => [
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
  
  Logger.log(`Migrated ${customers.length} customers to Google Sheets`);
}

function migrateComplaintsData() {
  const complaints = [
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
      'Resolved At': '',
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
      'Resolved At': '',
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
      'Assigned To': '',
      'Assigned By': '',
      'Created By': 'USR-004',
      'Created At': '2025-08-03T11:45:00Z',
      'Updated At': '2025-08-04T16:30:00Z',
      'Estimated Resolution': '',
      'Resolved At': '2025-08-04T16:30:00Z',
      Notes: 'Customer disputed billing amount; Meter reading verified on-site; Billing error confirmed and corrected; Refund processed for overcharge'
    }
  ];
  
  const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.COMPLAINT_SHEET);
  
  if (!sheet) {
    Logger.log('Complaints sheet not found');
    return;
  }
  
  // Clear existing data (except headers)
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clear();
  }
  
  // Add headers if not present
  const headers = ['ID', 'Customer ID', 'Customer Name', 'Customer Email', 'Customer Phone', 'Title', 'Description', 'Category', 'Priority', 'Status', 'Region', 'Assigned To', 'Assigned By', 'Created By', 'Created At', 'Updated At', 'Estimated Resolution', 'Resolved At', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Add complaint data
  const complaintData = complaints.map(complaint => [
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
  
  Logger.log(`Migrated ${complaints.length} complaints to Google Sheets`);
}

function migrateAllData() {
  migrateUsersData();
  migrateCustomersData();
  migrateComplaintsData();
  Logger.log('All data migration completed!');
}