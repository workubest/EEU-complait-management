/**
 * Google Apps Script for Ethiopian Electric Utility Customer Portal
 * This script creates and seeds Google Sheets with customer data and complaint tables
 */

const SHEET_ID = '1vi7SguM67N8BP5_5dNSPh4GO0WDe-Y6_LwfY-GliW0o'; // Update with your sheet ID

// Customer seed data for Ethiopian Electric Utility
const CUSTOMER_SEED_DATA = [
  // Header row
  [
    'Customer ID', 'Contract Account', 'Business Partner Number', 'Full Name', 
    'Email', 'Phone', 'Address', 'Region', 'Sub City', 'Woreda', 
    'Account Type', 'Connection Type', 'Meter Number', 'Tariff Category', 
    'Connection Date', 'Status', 'Outstanding Balance', 'Last Payment Date',
    'Service Address', 'Billing Address', 'Emergency Contact', 'Language Preference'
  ],
  
  // Sample customer data
  ['CUST001', '1000123456', 'BP001234567', 'አበበ ተስፋዬ (Abebe Tesfaye)', 'abebe.tesfaye@email.com', '+251911234567', 'ቦሌ ክ/ከተማ ወረዳ 03', 'አዲስ አበባ', 'ቦሌ', '03', 'Residential', 'Single Phase', 'MTR001234', 'Domestic', '2020-01-15', 'Active', '0', '2024-01-15', 'ቦሌ ክ/ከተማ ወረዳ 03 ቤት ቁጥር 123', 'ቦሌ ክ/ከተማ ወረዳ 03 ቤት ቁጥር 123', '+251911234568', 'am'],
  
  ['CUST002', '1000234567', 'BP002345678', 'ፋጢማ አህመድ (Fatima Ahmed)', 'fatima.ahmed@email.com', '+251922345678', 'መርካቶ አካባቢ', 'አዲስ አበባ', 'አዳ', '05', 'Commercial', 'Three Phase', 'MTR002345', 'Commercial', '2019-03-20', 'Active', '2500.50', '2023-12-20', 'መርካቶ አካባቢ ሱቅ ቁጥር 45', 'መርካቶ አካባቢ ሱቅ ቁጥር 45', '+251922345679', 'am'],
  
  ['CUST003', '1000345678', 'BP003456789', 'ዳንኤል ገብረማርያም (Daniel Gebremariam)', 'daniel.gebre@email.com', '+251933456789', 'ካዛንቺስ አካባቢ', 'አዲስ አበባ', 'ቦሌ', '07', 'Residential', 'Single Phase', 'MTR003456', 'Domestic', '2021-06-10', 'Active', '150.00', '2024-01-10', 'ካዛንቺስ አካባቢ ቤት ቁጥር 67', 'ካዛንቺስ አካባቢ ቤት ቁጥር 67', '+251933456790', 'en'],
  
  ['CUST004', '1000456789', 'BP004567890', 'ሳራ ወልደ (Sara Wolde)', 'sara.wolde@email.com', '+251944567890', 'ፒያሳ አካባቢ', 'አዲስ አበባ', 'ኪርኮስ', '02', 'Residential', 'Single Phase', 'MTR004567', 'Domestic', '2018-11-25', 'Active', '0', '2024-01-12', 'ፒያሳ አካባቢ ቤት ቁጥር 89', 'ፒያሳ አካባቢ ቤት ቁጥር 89', '+251944567891', 'am'],
  
  ['CUST005', '1000567890', 'BP005678901', 'ሙሉጌታ አለሙ (Mulugeta Alemu)', 'mulugeta.alemu@email.com', '+251955678901', 'ሰሚት አካባቢ', 'አዲስ አበባ', 'ጉለሌ', '08', 'Commercial', 'Three Phase', 'MTR005678', 'Commercial', '2020-08-30', 'Active', '5000.75', '2023-11-30', 'ሰሚት አካባቢ ሱቅ ቁጥር 12', 'ሰሚት አካባቢ ሱቅ ቁጥር 12', '+251955678902', 'am'],
  
  ['CUST006', '1000678901', 'BP006789012', 'ሄለን ታደሰ (Helen Tadesse)', 'helen.tadesse@email.com', '+251966789012', 'ሜክሲኮ አካባቢ', 'አዲስ አበባ', 'ቦሌ', '04', 'Residential', 'Single Phase', 'MTR006789', 'Domestic', '2022-02-14', 'Active', '300.25', '2023-12-25', 'ሜክሲኮ አካባቢ ቤት ቁጥር 34', 'ሜክሲኮ አካባቢ ቤት ቁጥር 34', '+251966789013', 'en'],
  
  ['CUST007', '1000789012', 'BP007890123', 'ተክለ ሃይማኖት (Tekle Haimanot)', 'tekle.haimanot@email.com', '+251977890123', 'ጀሞ አካባቢ', 'ኦሮሚያ', 'ጀሞ', '01', 'Industrial', 'Three Phase', 'MTR007890', 'Industrial', '2017-05-18', 'Active', '15000.00', '2023-10-15', 'ጀሞ አካባቢ ፋብሪካ ቁጥር 1', 'ጀሞ አካባቢ ፋብሪካ ቁጥር 1', '+251977890124', 'am'],
  
  ['CUST008', '1000890123', 'BP008901234', 'ሮዛ ገብሬ (Rosa Gebre)', 'rosa.gebre@email.com', '+251988901234', 'ሃያ ሁለት አካባቢ', 'አዲስ አበባ', 'ኪርኮስ', '06', 'Residential', 'Single Phase', 'MTR008901', 'Domestic', '2021-09-12', 'Active', '0', '2024-01-08', 'ሃያ ሁለት አካባቢ ቤት ቁጥር 56', 'ሃያ ሁለት አካባቢ ቤት ቁጥር 56', '+251988901235', 'am'],
  
  ['CUST009', '1000901234', 'BP009012345', 'ሳሙኤል ወርቁ (Samuel Worku)', 'samuel.worku@email.com', '+251999012345', 'ሰላሴ አካባቢ', 'አዲስ አበባ', 'አራዳ', '09', 'Commercial', 'Three Phase', 'MTR009012', 'Commercial', '2019-12-03', 'Active', '1200.00', '2023-12-03', 'ሰላሴ አካባቢ ሱቅ ቁጥር 78', 'ሰላሴ አካባቢ ሱቅ ቁጥር 78', '+251999012346', 'en'],
  
  ['CUST010', '1001012345', 'BP010123456', 'ብርሃኔ መስፍን (Birhane Mesfin)', 'birhane.mesfin@email.com', '+251910123456', 'ቱሉ ዲምቱ አካባቢ', 'ኦሮሚያ', 'ቱሉ ዲምቱ', '02', 'Residential', 'Single Phase', 'MTR010123', 'Domestic', '2020-07-22', 'Active', '450.80', '2023-11-22', 'ቱሉ ዲምቱ አካባቢ ቤት ቁጥር 90', 'ቱሉ ዲምቱ አካባቢ ቤት ቁጥር 90', '+251910123457', 'am'],
  
  // Additional customers for different regions
  ['CUST011', '1001123456', 'BP011234567', 'አስተር ተፈሪ (Aster Teferi)', 'aster.teferi@email.com', '+251921234567', 'ባህር ዳር ከተማ', 'አማራ', 'ባህር ዳር', '01', 'Residential', 'Single Phase', 'MTR011234', 'Domestic', '2021-01-30', 'Active', '0', '2024-01-05', 'ባህር ዳር ከተማ ቤት ቁጥር 12', 'ባህር ዳር ከተማ ቤት ቁጥር 12', '+251921234568', 'am'],
  
  ['CUST012', '1001234567', 'BP012345678', 'ገብረ ሥላሴ (Gebre Silassie)', 'gebre.silassie@email.com', '+251932345678', 'መቀሌ ከተማ', 'ትግራይ', 'መቀሌ', '03', 'Commercial', 'Three Phase', 'MTR012345', 'Commercial', '2018-04-15', 'Active', '3500.00', '2023-10-15', 'መቀሌ ከተማ ሱቅ ቁጥር 25', 'መቀሌ ከተማ ሱቅ ቁጥር 25', '+251932345679', 'am'],
  
  ['CUST013', '1001345678', 'BP013456789', 'ፋሲካ ወልደ (Fasika Wolde)', 'fasika.wolde@email.com', '+251943456789', 'ሐዋሳ ከተማ', 'ደቡብ', 'ሐዋሳ', '02', 'Residential', 'Single Phase', 'MTR013456', 'Domestic', '2022-06-20', 'Active', '200.00', '2023-12-20', 'ሐዋሳ ከተማ ቤት ቁጥር 45', 'ሐዋሳ ከተማ ቤት ቁጥር 45', '+251943456790', 'am'],
  
  ['CUST014', '1001456789', 'BP014567890', 'ዮሐንስ ሃይሉ (Yohannes Hailu)', 'yohannes.hailu@email.com', '+251954567890', 'ጅማ ከተማ', 'ኦሮሚያ', 'ጅማ', '04', 'Industrial', 'Three Phase', 'MTR014567', 'Industrial', '2017-09-10', 'Active', '25000.00', '2023-09-10', 'ጅማ ከተማ ፋብሪካ ቁጥር 3', 'ጅማ ከተማ ፋብሪካ ቁጥር 3', '+251954567891', 'am'],
  
  ['CUST015', '1001567890', 'BP015678901', 'ሰላም ተክለ (Selam Tekle)', 'selam.tekle@email.com', '+251965678901', 'ደሴ ከተማ', 'አማራ', 'ደሴ', '05', 'Residential', 'Single Phase', 'MTR015678', 'Domestic', '2020-11-08', 'Active', '0', '2024-01-03', 'ደሴ ከተማ ቤት ቁጥር 67', 'ደሴ ከተማ ቤት ቁጥር 67', '+251965678902', 'am']
];

// Business Partners seed data (for corporate customers)
const BUSINESS_PARTNERS_SEED_DATA = [
  // Header row
  [
    'Business Partner ID', 'Company Name', 'Company Name Amharic', 'Registration Number', 
    'Tax ID', 'Contact Person', 'Email', 'Phone', 'Address', 'Region', 
    'Business Type', 'Industry Sector', 'Registration Date', 'Status', 
    'Credit Limit', 'Payment Terms', 'Preferred Language'
  ],
  
  // Sample business partner data
  ['BP001234567', 'Ethiopian Airlines', 'የኢትዮጵያ አየር መንገድ', 'REG001234', 'TAX001234567', 'Mehari Redae', 'mehari.redae@ethiopianairlines.com', '+251115517000', 'Bole International Airport', 'አዲስ አበባ', 'Aviation', 'Transportation', '1995-01-01', 'Active', '1000000.00', '30 Days', 'en'],
  
  ['BP002345678', 'Commercial Bank of Ethiopia', 'የኢትዮጵያ ንግድ ባንክ', 'REG002345', 'TAX002345678', 'Bekele Zeleke', 'bekele.zeleke@combanketh.et', '+251115518000', 'Ras Abebe Aregay Street', 'አዲስ አበባ', 'Banking', 'Financial Services', '1963-01-01', 'Active', '2000000.00', '15 Days', 'am'],
  
  ['BP003456789', 'Ethio Telecom', 'ኢትዮ ቴሌኮም', 'REG003456', 'TAX003456789', 'Frehiwot Tamru', 'frehiwot.tamru@ethiotelecom.et', '+251115519000', 'Churchill Avenue', 'አዲስ አበባ', 'Telecommunications', 'Technology', '2010-12-01', 'Active', '5000000.00', '30 Days', 'am'],
  
  ['BP004567890', 'Habesha Breweries', 'ሐበሻ ቢራ ፋብሪካ', 'REG004567', 'TAX004567890', 'Alemayehu Atomsa', 'alemayehu.atomsa@habeshabreweries.com', '+251115520000', 'Debre Zeit Road', 'ኦሮሚያ', 'Manufacturing', 'Food & Beverage', '1999-05-15', 'Active', '500000.00', '45 Days', 'am'],
  
  ['BP005678901', 'Awash International Bank', 'አዋሽ ኢንተርናሽናል ባንክ', 'REG005678', 'TAX005678901', 'Tsehay Shiferaw', 'tsehay.shiferaw@awashbank.com', '+251115521000', 'Ras Desta Damtew Avenue', 'አዲስ አበባ', 'Banking', 'Financial Services', '1994-06-01', 'Active', '1500000.00', '30 Days', 'am']
];

// Complaints table structure (to be integrated with existing complaints)
const COMPLAINTS_TABLE_STRUCTURE = [
  // Header row
  [
    'Complaint ID', 'Customer ID', 'Contract Account', 'Business Partner Number', 
    'Customer Name', 'Customer Email', 'Customer Phone', 'Customer Address', 
    'Region', 'Title', 'Description', 'Category', 'Priority', 'Status', 
    'Created Date', 'Created By', 'Assigned To', 'Resolution Date', 
    'Resolution Notes', 'Customer Satisfaction', 'Follow Up Required', 
    'Estimated Resolution Time', 'Actual Resolution Time', 'Cost Impact',
    'Service Interruption Duration', 'Affected Customers Count', 'Language'
  ]
];

/**
 * Google Apps Script Helper Functions
 */

/**
 * Initialize Google Sheets with customer and complaint data
 */
function initializeSheets() {
  try {
    Logger.log('🚀 Initializing Google Sheets for Ethiopian Electric Utility...');
    
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    // Create or update Customers sheet
    createOrUpdateSheet(spreadsheet, 'Customers', CUSTOMER_SEED_DATA);
    Logger.log('✅ Customers sheet created/updated successfully');
    
    // Create or update Business Partners sheet
    createOrUpdateSheet(spreadsheet, 'BusinessPartners', BUSINESS_PARTNERS_SEED_DATA);
    Logger.log('✅ Business Partners sheet created/updated successfully');
    
    // Create or update Complaints sheet structure
    createOrUpdateSheet(spreadsheet, 'Complaints', COMPLAINTS_TABLE_STRUCTURE);
    Logger.log('✅ Complaints sheet structure created/updated successfully');
    
    Logger.log('🎉 All sheets initialized successfully!');
    
    return { success: true, message: 'All sheets initialized successfully' };
    
  } catch (error) {
    Logger.log('❌ Error initializing sheets: ' + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Create or update a sheet with data
 */
function createOrUpdateSheet(spreadsheet, sheetName, data) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  
  // Clear existing data
  sheet.clear();
  
  // Add data
  if (data.length > 0) {
    sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, data[0].length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, data[0].length);
  }
}

/**
 * Find customer by contract account or business partner number
 */
function findCustomer(accountNumber) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    // Search in Customers sheet
    const customerResult = searchInSheet(spreadsheet, 'Customers', accountNumber, [1, 2]); // Contract Account and BP Number columns
    if (customerResult) {
      return { type: 'customer', data: customerResult };
    }
    
    // Search in Business Partners sheet
    const bpResult = searchInSheet(spreadsheet, 'BusinessPartners', accountNumber, [0]); // BP ID column
    if (bpResult) {
      return { type: 'business_partner', data: bpResult };
    }
    
    return null;
  } catch (error) {
    Logger.log('Error finding customer: ' + error.message);
    return null;
  }
}

/**
 * Search for a value in specific columns of a sheet
 */
function searchInSheet(spreadsheet, sheetName, searchValue, columnIndices) {
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    return null;
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Skip header row and search in data rows
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    for (const colIndex of columnIndices) {
      if (row[colIndex] && row[colIndex].toString().toLowerCase() === searchValue.toLowerCase()) {
        // Return the found row with column headers
        const result = {};
        headers.forEach((header, index) => {
          result[header] = row[index] || '';
        });
        return result;
      }
    }
  }
  
  return null;
}

/**
 * Add a new complaint to the Complaints sheet
 */
function addComplaint(complaintData) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName('Complaints');
    
    if (!sheet) {
      Logger.log('Complaints sheet not found');
      return { success: false, error: 'Complaints sheet not found' };
    }
    
    // Get current complaints to determine next row
    const lastRow = sheet.getLastRow();
    const nextRow = lastRow + 1;
    
    // Generate complaint ID
    const complaintId = 'CMP-' + Date.now().toString().slice(-8);
    
    // Prepare complaint row data
    const complaintRow = [
      complaintId,
      complaintData.customerId || '',
      complaintData.contractAccount || '',
      complaintData.businessPartnerNumber || '',
      complaintData.customerName || '',
      complaintData.customerEmail || '',
      complaintData.customerPhone || '',
      complaintData.customerAddress || '',
      complaintData.region || '',
      complaintData.title || '',
      complaintData.description || '',
      complaintData.category || '',
      complaintData.priority || 'medium',
      'open',
      new Date().toISOString(),
      complaintData.createdBy || 'customer_portal',
      '',
      '',
      '',
      '',
      'no',
      '',
      '',
      '',
      '',
      '',
      complaintData.language || 'en'
    ];
    
    // Add the complaint to the sheet
    sheet.getRange(nextRow, 1, 1, complaintRow.length).setValues([complaintRow]);
    
    Logger.log('Complaint added successfully: ' + complaintId);
    return { 
      success: true, 
      complaintId: complaintId,
      message: 'Complaint created successfully'
    };
    
  } catch (error) {
    Logger.log('Error adding complaint: ' + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get all complaints from the sheet
 */
function getAllComplaints() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName('Complaints');
    
    if (!sheet) {
      return { success: false, error: 'Complaints sheet not found' };
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return { success: true, data: [] };
    }
    
    const headers = data[0];
    const complaints = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const complaint = {};
      headers.forEach((header, index) => {
        complaint[header] = row[index] || '';
      });
      complaints.push(complaint);
    }
    
    return { success: true, data: complaints };
    
  } catch (error) {
    Logger.log('Error getting complaints: ' + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Update complaint status
 */
function updateComplaintStatus(complaintId, status, notes) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName('Complaints');
    
    if (!sheet) {
      return { success: false, error: 'Complaints sheet not found' };
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Find the complaint row
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === complaintId) { // Assuming first column is Complaint ID
        // Update status
        const statusColIndex = headers.indexOf('Status');
        if (statusColIndex !== -1) {
          sheet.getRange(i + 1, statusColIndex + 1).setValue(status);
        }
        
        // Update notes if provided
        if (notes) {
          const notesColIndex = headers.indexOf('Resolution Notes');
          if (notesColIndex !== -1) {
            sheet.getRange(i + 1, notesColIndex + 1).setValue(notes);
          }
        }
        
        // Update resolution date if status is resolved
        if (status === 'resolved') {
          const resolutionDateColIndex = headers.indexOf('Resolution Date');
          if (resolutionDateColIndex !== -1) {
            sheet.getRange(i + 1, resolutionDateColIndex + 1).setValue(new Date().toISOString());
          }
        }
        
        Logger.log('Complaint status updated: ' + complaintId + ' -> ' + status);
        return { success: true, message: 'Complaint status updated successfully' };
      }
    }
    
    return { success: false, error: 'Complaint not found' };
    
  } catch (error) {
    Logger.log('Error updating complaint status: ' + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get customer information by account number
 */
function getCustomerInfo(accountNumber) {
  try {
    const customer = findCustomer(accountNumber);
    if (customer) {
      return { success: true, data: customer };
    } else {
      return { success: false, error: 'Customer not found' };
    }
  } catch (error) {
    Logger.log('Error getting customer info: ' + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test function to verify setup
 */
function testSetup() {
  Logger.log('Testing Google Sheets setup...');
  
  // Test initialization
  const initResult = initializeSheets();
  Logger.log('Initialization result: ' + JSON.stringify(initResult));
  
  // Test customer search
  const customerResult = findCustomer('1000123456');
  Logger.log('Customer search result: ' + JSON.stringify(customerResult));
  
  // Test complaint creation
  const testComplaint = {
    customerName: 'Test Customer',
    customerEmail: 'test@example.com',
    customerPhone: '+251-911-000000',
    customerAddress: 'Test Address',
    region: 'Test Region',
    title: 'Test Complaint',
    description: 'This is a test complaint',
    category: 'power-outage',
    priority: 'medium',
    createdBy: 'test_user'
  };
  
  const complaintResult = addComplaint(testComplaint);
  Logger.log('Complaint creation result: ' + JSON.stringify(complaintResult));
  
  Logger.log('Setup test completed!');
}