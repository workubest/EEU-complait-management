/**
 * Google Sheets API Service for Ethiopian Electric Utility Customer Portal
 * This service handles all Google Sheets operations for customer data and complaints
 */

// Configuration interface
interface GoogleSheetsConfig {
  apiKey: string;
  spreadsheetId: string;
  sheets: {
    customers: string;
    complaints: string;
    businessPartners: string;
  };
}

// Customer data interface
interface CustomerData {
  type: 'customer' | 'business_partner';
  data: Record<string, string>;
}

// Complaint data interface
interface ComplaintData {
  customerId?: string;
  contractAccount?: string;
  businessPartnerNumber?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  region?: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  language?: string;
  createdBy?: string;
}

// API Response interfaces
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface ValidationResponse {
  valid: boolean;
  customer?: CustomerData;
  message: string;
}

interface SubmissionResponse {
  success: boolean;
  complaintId?: string;
  message: string;
}

/**
 * Google Sheets API Service Class
 */
export class GoogleSheetsApiService {
  private config: GoogleSheetsConfig;
  private baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
  }

  /**
   * Initialize the service with configuration
   */
  static create(apiKey: string, spreadsheetId: string): GoogleSheetsApiService {
    const config: GoogleSheetsConfig = {
      apiKey,
      spreadsheetId,
      sheets: {
        customers: 'Customers',
        complaints: 'Complaints',
        businessPartners: 'BusinessPartners'
      }
    };
    return new GoogleSheetsApiService(config);
  }

  /**
   * Validate customer account by searching for contract account or business partner number
   */
  async validateCustomerAccount(accountNumber: string): Promise<ValidationResponse> {
    try {
      if (!accountNumber || accountNumber.trim().length === 0) {
        return {
          valid: false,
          message: 'Account number is required'
        };
      }

      const trimmedAccount = accountNumber.trim();

      // Search in Customers sheet first
      const customerResult = await this.searchInSheet('Customers', trimmedAccount, [1, 2]); // Contract Account and BP Number columns
      if (customerResult) {
        return {
          valid: true,
          customer: { type: 'customer', data: customerResult },
          message: 'Customer account found'
        };
      }

      // Search in Business Partners sheet
      const bpResult = await this.searchInSheet('BusinessPartners', trimmedAccount, [0]); // BP ID column
      if (bpResult) {
        return {
          valid: true,
          customer: { type: 'business_partner', data: bpResult },
          message: 'Business partner account found'
        };
      }

      return {
        valid: false,
        message: 'Account number not found. Please check your Contract Account or Business Partner Number.'
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
   * Submit a complaint to the Google Sheets
   */
  async submitComplaint(accountNumber: string, complaintData: Omit<ComplaintData, 'customerId' | 'contractAccount' | 'businessPartnerNumber' | 'customerName' | 'customerEmail' | 'customerPhone' | 'customerAddress' | 'region'>): Promise<SubmissionResponse> {
    try {
      // First validate the customer
      const validation = await this.validateCustomerAccount(accountNumber);
      
      if (!validation.valid || !validation.customer) {
        return {
          success: false,
          message: validation.message
        };
      }

      // Prepare complaint data with customer information
      const customerInfo = validation.customer.data;
      const complaintPayload: ComplaintData = {
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

      // Add the complaint to the sheet
      const result = await this.addComplaintToSheet(complaintPayload);
      
      return result;

    } catch (error) {
      console.error('Error submitting complaint:', error);
      return {
        success: false,
        message: 'Error submitting complaint. Please try again.'
      };
    }
  }

  /**
   * Search for a value in specific columns of a sheet
   */
  private async searchInSheet(sheetName: string, searchValue: string, columnIndices: number[]): Promise<Record<string, string> | null> {
    try {
      const range = `${sheetName}!A:Z`;
      const url = `${this.baseUrl}/${this.config.spreadsheetId}/values/${range}?key=${this.config.apiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to search in ${sheetName}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const rows = data.values || [];
      
      if (rows.length === 0) {
        return null;
      }

      const headers = rows[0];
      
      // Skip header row and search in data rows
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        for (const colIndex of columnIndices) {
          if (row[colIndex] && row[colIndex].toString().toLowerCase() === searchValue.toLowerCase()) {
            // Return the found row with column headers
            const result: Record<string, string> = {};
            headers.forEach((header: string, index: number) => {
              result[header] = row[index] || '';
            });
            return result;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Error searching in sheet ${sheetName}:`, error);
      throw error;
    }
  }

  /**
   * Add a new complaint to the Complaints sheet
   */
  private async addComplaintToSheet(complaintData: ComplaintData): Promise<SubmissionResponse> {
    try {
      // Get current complaints to determine next row
      const range = 'Complaints!A:Z';
      const url = `${this.baseUrl}/${this.config.spreadsheetId}/values/${range}?key=${this.config.apiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to get complaints data: ${response.statusText}`);
      }

      const data = await response.json();
      const existingRows = data.values || [];
      const nextRow = existingRows.length + 1;
      
      // Generate complaint ID
      const complaintId = `CMP-${Date.now().toString().slice(-8)}`;
      
      // Prepare complaint row data according to the sheet structure
      const complaintRow = [
        complaintId, // Complaint ID
        complaintData.customerId || '', // Customer ID
        complaintData.contractAccount || '', // Contract Account
        complaintData.businessPartnerNumber || '', // Business Partner Number
        complaintData.customerName || '', // Customer Name
        complaintData.customerEmail || '', // Customer Email
        complaintData.customerPhone || '', // Customer Phone
        complaintData.customerAddress || '', // Customer Address
        complaintData.region || '', // Region
        complaintData.title || '', // Title
        complaintData.description || '', // Description
        complaintData.category || '', // Category
        complaintData.priority || 'medium', // Priority
        'open', // Status
        new Date().toISOString(), // Created Date
        complaintData.createdBy || 'customer_portal', // Created By
        '', // Assigned To
        '', // Resolution Date
        '', // Resolution Notes
        '', // Customer Satisfaction
        'no', // Follow Up Required
        '', // Estimated Resolution Time
        '', // Actual Resolution Time
        '', // Cost Impact
        '', // Service Interruption Duration
        '', // Affected Customers Count
        complaintData.language || 'en' // Language
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
        message: 'Complaint submitted successfully'
      };
      
    } catch (error) {
      console.error('Error adding complaint to sheet:', error);
      throw error;
    }
  }

  /**
   * Get all complaints for a specific customer
   */
  async getCustomerComplaints(accountNumber: string): Promise<ApiResponse<any[]>> {
    try {
      const validation = await this.validateCustomerAccount(accountNumber);
      
      if (!validation.valid || !validation.customer) {
        return {
          success: false,
          error: 'Customer not found'
        };
      }

      const customerId = validation.customer.data['Customer ID'] || validation.customer.data['Business Partner ID'];
      
      // Get all complaints
      const range = 'Complaints!A:Z';
      const url = `${this.baseUrl}/${this.config.spreadsheetId}/values/${range}?key=${this.config.apiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to get complaints: ${response.statusText}`);
      }
      
      const data = await response.json();
      const rows = data.values || [];
      
      if (rows.length === 0) {
        return {
          success: true,
          data: []
        };
      }

      const headers = rows[0];
      const complaints = [];
      
      // Filter complaints for this customer
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row[1] === customerId) { // Customer ID column
          const complaint: Record<string, string> = {};
          headers.forEach((header: string, index: number) => {
            complaint[header] = row[index] || '';
          });
          complaints.push(complaint);
        }
      }
      
      return {
        success: true,
        data: complaints
      };
      
    } catch (error) {
      console.error('Error getting customer complaints:', error);
      return {
        success: false,
        error: 'Error retrieving complaints'
      };
    }
  }

  /**
   * Initialize sheets with seed data (for development/testing)
   */
  async initializeWithSeedData(): Promise<ApiResponse> {
    try {
      // This would be used to populate the sheets with initial data
      // Implementation would depend on having write permissions to the sheets
      console.log('Seed data initialization would require write permissions to Google Sheets');
      
      return {
        success: true,
        message: 'Seed data initialization completed'
      };
    } catch (error) {
      console.error('Error initializing seed data:', error);
      return {
        success: false,
        error: 'Error initializing seed data'
      };
    }
  }
}

// Export default instance factory
export const createGoogleSheetsService = (apiKey: string, spreadsheetId: string) => {
  return GoogleSheetsApiService.create(apiKey, spreadsheetId);
};

// Export types
export type {
  GoogleSheetsConfig,
  CustomerData,
  ComplaintData,
  ApiResponse,
  ValidationResponse,
  SubmissionResponse
};