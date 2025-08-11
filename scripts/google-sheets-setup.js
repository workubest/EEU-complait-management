/**
 * Google Sheets Setup Script for Ethiopian Electric Utility Customer Portal
 * This script creates and seeds Google Sheets with customer data and complaint tables
 */

// Google Sheets API configuration
const GOOGLE_SHEETS_CONFIG = {
  // Replace with your Google Sheets API credentials
  apiKey: 'YOUR_GOOGLE_SHEETS_API_KEY',
  spreadsheetId: 'YOUR_SPREADSHEET_ID',
  
  // Sheet names
  sheets: {
    customers: 'Customers',
    complaints: 'Complaints',
    businessPartners: 'BusinessPartners'
  }
};

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
 * Google Sheets API Helper Functions
 */
class GoogleSheetsManager {
  constructor(config) {
    this.config = config;
    this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  }

  /**
   * Initialize Google Sheets with customer and complaint data
   */
  async initializeSheets() {
    try {
      console.log('🚀 Initializing Google Sheets for Ethiopian Electric Utility...');
      
      // Create or update Customers sheet
      await this.createOrUpdateSheet('Customers', CUSTOMER_SEED_DATA);
      console.log('✅ Customers sheet created/updated successfully');
      
      // Create or update Business Partners sheet
      await this.createOrUpdateSheet('BusinessPartners', BUSINESS_PARTNERS_SEED_DATA);
      console.log('✅ Business Partners sheet created/updated successfully');
      
      // Create or update Complaints sheet structure
      await this.createOrUpdateSheet('Complaints', COMPLAINTS_TABLE_STRUCTURE);
      console.log('✅ Complaints sheet structure created/updated successfully');
      
      console.log('🎉 All sheets initialized successfully!');
      
    } catch (error) {
      console.error('❌ Error initializing sheets:', error);
      throw error;
    }
  }

  /**
   * Create or update a sheet with data
   */
  async createOrUpdateSheet(sheetName, data) {
    const range = `${sheetName}!A1:Z${data.length}`;
    const url = `${this.baseUrl}/${this.config.spreadsheetId}/values/${range}?valueInputOption=RAW&key=${this.config.apiKey}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: data
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update ${sheetName}: ${response.statusText}`);
    }
    
    return await response.json();
  }

  /**
   * Find customer by contract account or business partner number
   */
  async findCustomer(accountNumber) {
    try {
      // Search in Customers sheet
      const customerResult = await this.searchInSheet('Customers', accountNumber, [1, 2]); // Contract Account and BP Number columns
      if (customerResult) {
        return { type: 'customer', data: customerResult };
      }
      
      // Search in Business Partners sheet
      const bpResult = await this.searchInSheet('BusinessPartners', accountNumber, [0]); // BP ID column
      if (bpResult) {
        return { type: 'business_partner', data: bpResult };
      }
      
      return null;
    } catch (error) {
      console.error('Error finding customer:', error);
      throw error;
    }
  }

  /**
   * Search for a value in specific columns of a sheet
   */
  async searchInSheet(sheetName, searchValue, columnIndices) {
    const range = `${sheetName}!A:Z`;
    const url = `${this.baseUrl}/${this.config.spreadsheetId}/values/${range}?key=${this.config.apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to search in ${sheetName}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const rows = data.values || [];
    
    // Skip header row and search in data rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      for (const colIndex of columnIndices) {
        if (row[colIndex] && row[colIndex].toString().toLowerCase() === searchValue.toLowerCase()) {
          // Return the found row with column headers
          const headers = rows[0];
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
  async addComplaint(complaintData) {
    try {
      // Get current complaints to determine next row
      const range = 'Complaints!A:Z';
      const url = `${this.baseUrl}/${this.config.spreadsheetId}/values/${range}?key=${this.config.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      const existingRows = data.values || [];
      const nextRow = existingRows.length + 1;
      
      // Generate complaint ID
      const complaintId = `CMP-${Date.now().toString().slice(-8)}`;
      
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
      const addRange = `Complaints!A${nextRow}:Z${nextRow}`;
      const addUrl = `${this.baseUrl}/${this.config.spreadsheetId}/values/${addRange}?valueInputOption=RAW&key=${this.config.apiKey}`;
      
      const addResponse = await fetch(addUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [complaintRow]
        })
      });
      
      if (!addResponse.ok) {
        throw new Error(`Failed to add complaint: ${addResponse.statusText}`);
      }
      
      return {
        success: true,
        complaintId: complaintId,
        message: 'Complaint added successfully'
      };
      
    } catch (error) {
      console.error('Error adding complaint:', error);
      throw error;
    }
  }
}

/**
 * Customer Portal Integration Functions
 */
class CustomerPortalManager {
  constructor(sheetsManager) {
    this.sheets = sheetsManager;
  }

  /**
   * Validate customer account and return customer data
   */
  async validateCustomerAccount(accountNumber) {
    try {
      if (!accountNumber || accountNumber.trim().length === 0) {
        return {
          valid: false,
          message: 'Account number is required'
        };
      }

      const customer = await this.sheets.findCustomer(accountNumber.trim());
      
      if (!customer) {
        return {
          valid: false,
          message: 'Account number not found. Please check your Contract Account or Business Partner Number.'
        };
      }

      return {
        valid: true,
        customer: customer,
        message: 'Account validated successfully'
      };
      
    } catch (error) {
      console.error('Error validating customer account:', error);
      return {
        valid: false,
        message: 'Error validating account. Please try again.'
      };
    }
  }

  /**
   * Submit complaint from customer portal
   */
  async submitComplaint(accountNumber, complaintData) {
    try {
      // First validate the customer
      const validation = await this.validateCustomerAccount(accountNumber);
      
      if (!validation.valid) {
        return {
          success: false,
          message: validation.message
        };
      }

      // Prepare complaint data with customer information
      const customerInfo = validation.customer.data;
      const complaintPayload = {
        customerId: customerInfo['Customer ID'] || customerInfo['Business Partner ID'],
        contractAccount: customerInfo['Contract Account'] || '',
        businessPartnerNumber: customerInfo['Business Partner Number'] || customerInfo['Business Partner ID'],
        customerName: customerInfo['Full Name'] || customerInfo['Company Name'],
        customerEmail: customerInfo['Email'],
        customerPhone: customerInfo['Phone'],
        customerAddress: customerInfo['Address'],
        region: customerInfo['Region'],
        title: complaintData.title,
        description: complaintData.description,
        category: complaintData.category,
        priority: complaintData.priority,
        language: customerInfo['Language Preference'] || customerInfo['Preferred Language'] || 'en',
        createdBy: 'customer_portal'
      };

      // Submit the complaint
      const result = await this.sheets.addComplaint(complaintPayload);
      
      return result;
      
    } catch (error) {
      console.error('Error submitting complaint:', error);
      return {
        success: false,
        message: 'Error submitting complaint. Please try again.'
      };
    }
  }
}

/**
 * Export functions for use in the application
 */
export {
  GoogleSheetsManager,
  CustomerPortalManager,
  GOOGLE_SHEETS_CONFIG,
  CUSTOMER_SEED_DATA,
  BUSINESS_PARTNERS_SEED_DATA,
  COMPLAINTS_TABLE_STRUCTURE
};

/**
 * Usage Example:
 * 
 * // Initialize the managers
 * const sheetsManager = new GoogleSheetsManager(GOOGLE_SHEETS_CONFIG);
 * const portalManager = new CustomerPortalManager(sheetsManager);
 * 
 * // Initialize sheets with seed data
 * await sheetsManager.initializeSheets();
 * 
 * // Validate customer account
 * const validation = await portalManager.validateCustomerAccount('1000123456');
 * 
 * // Submit complaint
 * const result = await portalManager.submitComplaint('1000123456', {
 *   title: 'Power outage in my area',
 *   description: 'No electricity since morning',
 *   category: 'no-supply-total',
 *   priority: 'high'
 * });
 */

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GoogleSheetsManager,
    CustomerPortalManager,
    GOOGLE_SHEETS_CONFIG,
    CUSTOMER_SEED_DATA,
    BUSINESS_PARTNERS_SEED_DATA,
    COMPLAINTS_TABLE_STRUCTURE
  };
}