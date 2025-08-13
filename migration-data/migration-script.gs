
/**
 * Google Apps Script Migration Functions
 * Run these functions to populate your Google Sheets with mock data
 */

const SHEET_ID = '1vi7SguM67N8BP5_5dNSPh4GO0WDe-Y6_LwfY-GliW0o'; // Update with your sheet ID

function migrateUsersData() {
  const users = [
  {
    "ID": "USR-001",
    "Name": "Abebe Kebede",
    "Email": "admin@eeu.gov.et",
    "Password": "admin123",
    "Role": "admin",
    "Region": "Addis Ababa",
    "Department": "System Administration",
    "Phone": "+251-11-123-4567",
    "Is Active": true,
    "Created At": "2025-01-01T00:00:00Z",
    "Updated At": "2025-01-01T00:00:00Z"
  },
  {
    "ID": "USR-002",
    "Name": "Tigist Haile",
    "Email": "manager@eeu.gov.et",
    "Password": "manager123",
    "Role": "manager",
    "Region": "Oromia",
    "Department": "Regional Management",
    "Phone": "+251-11-234-5678",
    "Is Active": true,
    "Created At": "2025-01-02T00:00:00Z",
    "Updated At": "2025-01-02T00:00:00Z"
  },
  {
    "ID": "USR-003",
    "Name": "Getachew Tadesse",
    "Email": "foreman@eeu.gov.et",
    "Password": "foreman123",
    "Role": "foreman",
    "Region": "Amhara",
    "Department": "Field Operations",
    "Phone": "+251-11-345-6789",
    "Is Active": true,
    "Created At": "2025-01-03T00:00:00Z",
    "Updated At": "2025-01-03T00:00:00Z"
  },
  {
    "ID": "USR-004",
    "Name": "Meron Tesfaye",
    "Email": "attendant@eeu.gov.et",
    "Password": "attendant123",
    "Role": "call-attendant",
    "Region": "Addis Ababa",
    "Department": "Control Room",
    "Phone": "+251-11-456-7890",
    "Is Active": true,
    "Created At": "2025-01-04T00:00:00Z",
    "Updated At": "2025-01-04T00:00:00Z"
  },
  {
    "ID": "USR-005",
    "Name": "Dawit Solomon",
    "Email": "tech@eeu.gov.et",
    "Password": "tech123",
    "Role": "technician",
    "Region": "Addis Ababa",
    "Department": "Field Service",
    "Phone": "+251-11-567-8901",
    "Is Active": true,
    "Created At": "2025-01-05T00:00:00Z",
    "Updated At": "2025-01-05T00:00:00Z"
  }
];
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Users');
  
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
    "ID": "CUST-001",
    "Name": "Almaz Tesfaye",
    "Email": "almaz.tesfaye@gmail.com",
    "Phone": "+251-911-123456",
    "Address": "Kirkos Sub-city, Addis Ababa",
    "Region": "Addis Ababa",
    "Meter Number": "AAM-001234",
    "Account Number": "ACC-789456",
    "Created At": "2025-01-01T00:00:00Z",
    "Updated At": "2025-01-01T00:00:00Z"
  },
  {
    "ID": "CUST-002",
    "Name": "Bereket Hailu",
    "Email": "bereket.hailu@yahoo.com",
    "Phone": "+251-912-234567",
    "Address": "Bahir Dar, Amhara Region",
    "Region": "Amhara",
    "Meter Number": "AMR-002345",
    "Account Number": "ACC-890567",
    "Created At": "2025-01-02T00:00:00Z",
    "Updated At": "2025-01-02T00:00:00Z"
  },
  {
    "ID": "CUST-003",
    "Name": "Chaltu Bekele",
    "Email": "chaltu.bekele@gmail.com",
    "Phone": "+251-913-345678",
    "Address": "Adama, Oromia Region",
    "Region": "Oromia",
    "Meter Number": "ORM-003456",
    "Account Number": "ACC-901678",
    "Created At": "2025-01-03T00:00:00Z",
    "Updated At": "2025-01-03T00:00:00Z"
  }
];
  
  // Create Customers sheet if it doesn't exist
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName('Customers');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Customers');
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
    "ID": "CMP-001",
    "Customer ID": "CUST-001",
    "Customer Name": "Almaz Tesfaye",
    "Customer Email": "almaz.tesfaye@gmail.com",
    "Customer Phone": "+251-911-123456",
    "Title": "Complete Power Outage in Kirkos Area",
    "Description": "There has been no electricity in our area for the past 6 hours. Multiple households are affected. This is causing significant inconvenience especially for our home-based business.",
    "Category": "power-outage",
    "Priority": "high",
    "Status": "open",
    "Region": "Addis Ababa",
    "Assigned To": "USR-005",
    "Assigned By": "USR-002",
    "Created By": "USR-004",
    "Created At": "2025-08-05T08:30:00Z",
    "Updated At": "2025-08-05T08:30:00Z",
    "Estimated Resolution": "2025-08-05T16:00:00Z",
    "Notes": "Initial report received from customer; Dispatched field team to investigate transformer issues"
  },
  {
    "ID": "CMP-002",
    "Customer ID": "CUST-002",
    "Customer Name": "Bereket Hailu",
    "Customer Email": "bereket.hailu@yahoo.com",
    "Customer Phone": "+251-912-234567",
    "Title": "Voltage Fluctuation Damaging Appliances",
    "Description": "Experiencing severe voltage fluctuations that have already damaged our refrigerator and television. The voltage seems to drop and spike randomly throughout the day.",
    "Category": "voltage-fluctuation",
    "Priority": "medium",
    "Status": "in-progress",
    "Region": "Amhara",
    "Assigned To": "USR-003",
    "Assigned By": "USR-002",
    "Created By": "USR-004",
    "Created At": "2025-08-04T14:20:00Z",
    "Updated At": "2025-08-05T09:15:00Z",
    "Estimated Resolution": "2025-08-06T12:00:00Z",
    "Notes": "Customer reported appliance damage; Voltage regulator inspection scheduled; Temporary stabilizer provided to customer"
  },
  {
    "ID": "CMP-003",
    "Customer ID": "CUST-003",
    "Customer Name": "Chaltu Bekele",
    "Customer Email": "chaltu.bekele@gmail.com",
    "Customer Phone": "+251-913-345678",
    "Title": "Incorrect Billing Amount",
    "Description": "My electricity bill shows consumption of 450 kWh for this month, but my average usage is only around 200 kWh. I believe there might be a meter reading error.",
    "Category": "billing-issue",
    "Priority": "low",
    "Status": "resolved",
    "Region": "Oromia",
    "Created By": "USR-004",
    "Created At": "2025-08-03T11:45:00Z",
    "Updated At": "2025-08-04T16:30:00Z",
    "Resolved At": "2025-08-04T16:30:00Z",
    "Notes": "Customer disputed billing amount; Meter reading verified on-site; Billing error confirmed and corrected; Refund processed for overcharge"
  },
  {
    "ID": "CMP-004",
    "Customer ID": "CUST-001",
    "Customer Name": "Almaz Tesfaye",
    "Customer Email": "almaz.tesfaye@gmail.com",
    "Customer Phone": "+251-911-123456",
    "Title": "Street Light Not Working",
    "Description": "The street light in front of our building has been off for two weeks. This is creating safety concerns for our neighborhood, especially for children and elderly residents.",
    "Category": "safety-concern",
    "Priority": "medium",
    "Status": "open",
    "Region": "Addis Ababa",
    "Created By": "USR-004",
    "Created At": "2025-08-02T19:00:00Z",
    "Updated At": "2025-08-02T19:00:00Z",
    "Estimated Resolution": "2025-08-07T12:00:00Z",
    "Notes": "Safety concern reported by community; Added to maintenance priority list"
  },
  {
    "ID": "CMP-005",
    "Customer ID": "CUST-002",
    "Customer Name": "Bereket Hailu",
    "Customer Email": "bereket.hailu@yahoo.com",
    "Customer Phone": "+251-912-234567",
    "Title": "Damaged Power Line After Storm",
    "Description": "Heavy winds last night brought down a power line near our compound. The line is currently on the ground creating a hazardous situation. Immediate attention required.",
    "Category": "line-damage",
    "Priority": "critical",
    "Status": "in-progress",
    "Region": "Amhara",
    "Assigned To": "USR-003",
    "Assigned By": "USR-001",
    "Created By": "USR-004",
    "Created At": "2025-08-01T06:00:00Z",
    "Updated At": "2025-08-01T07:30:00Z",
    "Estimated Resolution": "2025-08-01T14:00:00Z",
    "Notes": "Emergency response activated; Area cordoned off for safety; Emergency repair crew dispatched; Estimated 8 hours for complete restoration"
  },
  {
    "ID": "CMP-006",
    "Customer ID": "CUST-003",
    "Customer Name": "Chaltu Bekele",
    "Customer Email": "chaltu.bekele@gmail.com",
    "Customer Phone": "+251-913-345678",
    "Title": "Smart Meter Installation Request",
    "Description": "Requesting installation of smart meter for better monitoring of electricity consumption. Current analog meter is old and may not be accurate.",
    "Category": "meter-installation",
    "Priority": "low",
    "Status": "open",
    "Region": "Oromia",
    "Created By": "USR-004",
    "Created At": "2025-08-07T10:15:00Z",
    "Updated At": "2025-08-07T10:15:00Z",
    "Estimated Resolution": "2025-08-10T16:00:00Z",
    "Notes": "Customer request logged; Scheduled for technical assessment"
  },
  {
    "ID": "CMP-007",
    "Customer ID": "CUST-001",
    "Customer Name": "Almaz Tesfaye",
    "Customer Email": "almaz.tesfaye@gmail.com",
    "Customer Phone": "+251-911-123456",
    "Title": "Frequent Power Interruptions",
    "Description": "Experiencing frequent power cuts throughout the day, lasting 10-15 minutes each time. This is affecting our business operations and causing data loss.",
    "Category": "power-quality",
    "Priority": "high",
    "Status": "in-progress",
    "Region": "Addis Ababa",
    "Assigned To": "USR-005",
    "Assigned By": "USR-002",
    "Created By": "USR-004",
    "Created At": "2025-08-07T14:30:00Z",
    "Updated At": "2025-08-07T15:45:00Z",
    "Estimated Resolution": "2025-08-08T12:00:00Z",
    "Notes": "Pattern analysis initiated; Field team dispatched for grid inspection; Temporary UPS solution recommended"
  },
  {
    "ID": "CMP-008",
    "Customer ID": "CUST-002",
    "Customer Name": "Bereket Hailu",
    "Customer Email": "bereket.hailu@yahoo.com",
    "Customer Phone": "+251-912-234567",
    "Title": "Underground Cable Damage",
    "Description": "Construction work in the area has damaged underground electrical cables. Multiple buildings in the block are without power.",
    "Category": "infrastructure-damage",
    "Priority": "critical",
    "Status": "open",
    "Region": "Amhara",
    "Assigned To": "USR-003",
    "Assigned By": "USR-001",
    "Created By": "USR-004",
    "Created At": "2025-08-07T16:20:00Z",
    "Updated At": "2025-08-07T16:20:00Z",
    "Estimated Resolution": "2025-08-08T08:00:00Z",
    "Notes": "Emergency response team notified; Area secured and marked; Coordination with construction company initiated"
  }
];
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Complaints');
  
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
