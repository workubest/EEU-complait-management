// --- CONFIGURATION ---
const CONFIG = {
  SHEET_ID: '1vi7SguM67N8BP5_5dNSPh4GO0WDe-Y6_LwfY-GliW0o',
  USER_SHEET: 'Users',
  COMPLAINT_SHEET: 'Complaints'
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
            user[headers[j]] = row[j];
          }
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

// --- HEALTH CHECK ENDPOINT ---
function healthCheck() {
  try {
    const complaintSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.COMPLAINT_SHEET);
    const userSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.USER_SHEET);
    const complaintRows = complaintSheet.getLastRow();
    const userRows = userSheet.getLastRow();
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
    Logger.log('doPost called:');
    Logger.log('  e.parameter: ' + JSON.stringify(e && e.parameter));
    Logger.log('  e.postData: ' + JSON.stringify(e && e.postData));
    Logger.log('  e.postData.contents: ' + (e && e.postData && e.postData.contents));
    Logger.log('  Parsed data: ' + JSON.stringify(data));
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
    Logger.log('handleAllRequests called:');
    Logger.log('  action: ' + action);
    Logger.log('  params: ' + JSON.stringify(params));
    Logger.log('  data: ' + JSON.stringify(data));
    Logger.log('  typeof data: ' + typeof data);
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(function(key) {
        Logger.log('    data[' + key + ']: ' + JSON.stringify(data[key]));
      });
    }
    let result = { error: 'No action specified', success: false };
    if (action) {
      switch (action) {
        case 'getComplaints':
          result = getComplaintsInternal(params);
          break;
        case 'getUsers':
          result = getUsersInternal(params);
          break;
        case 'getDashboardStats':
          result = getDashboardStatsInternal();
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
        case 'createComplaint':
          result = createComplaintInternal(data);
          break;
        case 'login':
          result = loginInternal(data);
          break;
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
        user[headers[j]] = row[j];
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
          if (h !== 'ID' && data[h] !== undefined) {
            sheet.getRange(i + 1, j + 1).setValue(data[h]);
          }
        });
        sheet.getRange(i + 1, headers.indexOf('Updated At') + 1).setValue(new Date().toISOString());
        return { message: 'User updated', success: true };
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
        return { message: 'User deactivated', success: true };
      }
    }
    return { error: 'User not found', success: false };
  } catch (error) {
    return { error: 'Failed to deactivate user: ' + error.message, success: false };
  }
}

// --- COMPLAINTS & DASHBOARD (SAME PATTERN AS USERS) ---
function getComplaintsInternal(params) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.COMPLAINT_SHEET);
    if (!sheet) {
      Logger.log('getComplaintsInternal error: Complaints sheet not found');
      return { error: 'Complaints sheet not found', success: false };
    }
    const data = sheet.getDataRange().getValues();
    if (!data || data.length === 0) {
      Logger.log('getComplaintsInternal error: No data in Complaints sheet');
      return { data: [], pagination: { page: 1, limit: 0, total: 0, totalPages: 1, hasNext: false, hasPrev: false }, success: true };
    }
    const headers = data[0];
    if (!headers || headers.length === 0) {
      Logger.log('getComplaintsInternal error: No headers in Complaints sheet');
      return { error: 'No headers in Complaints sheet', success: false };
    }
    const complaints = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row.every(cell => cell === '' || cell === null || typeof cell === 'undefined')) continue;
      let complaint = {};
      for (let j = 0; j < headers.length; j++) {
        complaint[headers[j]] = row[j];
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
    if (!data.title || !data.description || !data.customerName) {
      return { error: 'Missing required fields: title, description, customerName', success: false };
    }
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.COMPLAINT_SHEET);
    if (!sheet) {
      return { error: 'Complaints sheet not found', success: false };
    }
    const headers = sheet.getDataRange().getValues()[0];
    const newComplaint = {
      ID: 'CMP-' + Date.now(),
      Title: data.title,
      Description: data.description,
      Status: data.status || 'open',
      Priority: data.priority || 'medium',
      Category: data.category || 'general',
      'Customer Name': data.customerName,
      'Customer Email': data.customerEmail || '',
      'Customer Phone': data.customerPhone || '',
      'Customer Address': data.customerAddress || '',
      Region: data.region || data.location || '',
      Location: data.location || data.region || '',
      'Meter Number': data.meterNumber || '',
      'Account Number': data.accountNumber || '',
      'Assigned To': data.assignedTo || '',
      'Assigned By': data.assignedBy || '',
      'Created By': data.createdBy || '',
      'Created At': data.createdAt || new Date().toISOString(),
      'Updated At': data.updatedAt || new Date().toISOString(),
      'Resolved At': data.resolvedAt || '',
      'Estimated Resolution': data.estimatedResolution || '',
      Notes: data.notes || '',
      Attachments: data.attachments || ''
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

function getDashboardStatsInternal() {
  try {
    // Complaints stats
    const complaintSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.COMPLAINT_SHEET);
    if (!complaintSheet) {
      Logger.log('getDashboardStatsInternal error: Complaints sheet not found');
      return { error: 'Complaints sheet not found', success: false };
    }
    const complaintData = complaintSheet.getDataRange().getValues();
    if (!complaintData || complaintData.length === 0) {
      Logger.log('getDashboardStatsInternal error: No data in Complaints sheet');
      return { error: 'No data in Complaints sheet', success: false };
    }
    const complaintHeaders = complaintData[0];
    if (!complaintHeaders || complaintHeaders.length === 0) {
      Logger.log('getDashboardStatsInternal error: No headers in Complaints sheet');
      return { error: 'No headers in Complaints sheet', success: false };
    }
    const validComplaints = [];
    let open = 0, resolved = 0, inProgress = 0, critical = 0, high = 0, medium = 0, low = 0;
    for (let i = 1; i < complaintData.length; i++) {
      const row = complaintData[i];
      if (row.every(cell => cell === '' || cell === null || typeof cell === 'undefined')) continue;
      validComplaints.push(row);
      const statusIdx = complaintHeaders.indexOf('Status');
      const priorityIdx = complaintHeaders.indexOf('Priority');
      
      // Count by status
      if (statusIdx !== -1) {
        const status = (row[statusIdx] || '').toString().toLowerCase();
        if (status === 'open') open++;
        if (status === 'closed' || status === 'resolved') resolved++;
        if (status === 'in-progress' || status === 'in progress') inProgress++;
      }
      
      // Count by priority
      if (priorityIdx !== -1) {
        const priority = (row[priorityIdx] || '').toString().toLowerCase();
        if (priority === 'critical') critical++;
        if (priority === 'high') high++;
        if (priority === 'medium') medium++;
        if (priority === 'low') low++;
      }
    }
    let totalComplaints = validComplaints.length;
    // Users stats
    const userSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.USER_SHEET);
    if (!userSheet) {
      Logger.log('getDashboardStatsInternal error: Users sheet not found');
      return { error: 'Users sheet not found', success: false };
    }
    const userData = userSheet.getDataRange().getValues();
    if (!userData || userData.length === 0) {
      Logger.log('getDashboardStatsInternal error: No data in Users sheet');
      return { error: 'No data in Users sheet', success: false };
    }
    const userHeaders = userData[0];
    if (!userHeaders || userHeaders.length === 0) {
      Logger.log('getDashboardStatsInternal error: No headers in Users sheet');
      return { error: 'No headers in Users sheet', success: false };
    }
    let totalUsers = userData.length - 1;
    let active = 0, inactive = 0;
    const isActiveIdx = userHeaders.indexOf('Is Active');
    for (let i = 1; i < userData.length; i++) {
      const row = userData[i];
      if (isActiveIdx !== -1 && row[isActiveIdx]) active++;
      else inactive++;
    }
    // Performance (placeholder)
    const performance = {
      resolutionRate: resolved > 0 ? Math.round((resolved / totalComplaints) * 100) : 0,
      averageResponseTime: '2.5 hours',
      customerSatisfaction: 4.2
    };
    return {
      data: {
        complaints: {
          total: totalComplaints,
          open,
          inProgress,
          resolved,
          critical,
          high,
          medium,
          low,
          active: totalComplaints - resolved, // Active complaints (not resolved)
          inactive: resolved // Inactive complaints (resolved)
        },
        users: {
          total: totalUsers,
          active,
          inactive
        },
        performance
      },
      success: true
    };
  } catch (error) {
    Logger.log('getDashboardStatsInternal error: ' + error.message);
    return { error: 'Failed to get dashboard stats: ' + error.message, success: false };
  }
}

function loginInternal(data) {
  try {
    if (!data.email || !data.password) {
      return { error: 'Missing email or password', success: false };
    }
    return authenticateUser(data.email, data.password);
  } catch (error) {
    return { error: 'Login failed: ' + error.message, success: false };
  }
}
