# 🌱 Complaint Seed Data Generator

This directory contains scripts to generate realistic seed data for the Ethiopian Electric Utility complaint management system.

## 📁 Generated Files

- **`seed-complaints.json`** - 100 complaints in JSON format for API import
- **`seed-complaints.csv`** - 100 complaints in CSV format for spreadsheet import
- **`seed-complaints.js`** - The generator script
- **`import-seed-data.js`** - Helper script for importing data
- **`run-seed.ps1`** - PowerShell script to run the generator

## 🎯 Data Specifications

All generated complaints have the following characteristics:

### Location Details
- **Region**: North Addis Ababa Region
- **Service Center**: NAAR No.6
- **Areas**: Yeka Sub City (Woreda 01, 02, 03)
  - Yeka Sub City, Woreda 01, Kebele 01/02 through 09/10
  - Yeka Sub City, Woreda 02, Kebele 01/02 through 09/10
  - Yeka Sub City, Woreda 03, Kebele 01/02 through 09/10

### Time Distribution
- **Date Range**: Last 30 days
- **Trend Analysis**: Complaints distributed across different days to show trends
- **Status Progression**: Realistic status changes based on complaint age

### Data Categories
- **21 Complaint Categories**: Including pole-fall, meter issues, power outages, etc.
- **4 Priority Levels**: Low, Medium, High, Critical (distributed based on category severity)
- **5 Status Types**: Open, In-Progress, Resolved, Escalated, Closed

### Customer Data
- **Ethiopian Names**: 30 realistic Ethiopian customer names
- **Phone Numbers**: Ethiopian mobile number format (+251-09X-XXXXXXX)
- **Email Addresses**: Generated based on customer names
- **Account Numbers**: 9-digit account numbers
- **Meter Numbers**: 8-digit meter numbers

## 🚀 How to Use

### Method 1: Generate New Data
```bash
# Run the generator script
node seed-complaints.js

# Or use PowerShell script
./run-seed.ps1
```

### Method 2: Import Existing Data

#### For Spreadsheet Applications (Excel, Google Sheets)
1. Open `seed-complaints.csv`
2. Import into your spreadsheet application
3. Use the data for analysis and reporting

#### For API/Database Import
1. Use `seed-complaints.json` for programmatic import
2. Modify `import-seed-data.js` to work with your API
3. Run the import script

#### For Manual Entry
1. Open either CSV or JSON file
2. Copy complaint data manually into your system
3. Use the realistic data for testing

## 📊 Data Statistics

The generated dataset includes:
- **100 Total Complaints**
- **Distributed Categories**: All 21 complaint types represented
- **Priority Distribution**: 
  - Critical: ~16% (urgent issues like pole falls, safety concerns)
  - High: ~19% (power outages, voltage issues)
  - Medium: ~41% (meter problems, billing issues)
  - Low: ~24% (routine requests, minor issues)
- **Status Distribution**:
  - Open: ~8% (recent complaints)
  - In-Progress: ~6% (being worked on)
  - Resolved: ~34% (fixed but not closed)
  - Escalated: ~7% (complex issues)
  - Closed: ~45% (completed complaints)

## 🔧 Customization

### Modify Complaint Count
```javascript
const complaints = generateComplaintData(200); // Generate 200 complaints instead of 100
```

### Change Date Range
```javascript
// Modify getRandomDate() function to change the date range
const thirtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000)); // 60 days instead of 30
```

### Add More Areas
```javascript
// Add more areas to yekaAreas array
const yekaAreas = [
  'Yeka Sub City, Woreda 01, Kebele 01/02',
  'Your New Area Here',
  // ... more areas
];
```

### Change Service Center
```javascript
// Modify the service center in generateComplaintData()
serviceCenter: 'NAAR No.7', // Change to different service center
```

## 📈 Analytics and Reporting

The seed data is designed to support various analytics:

1. **Trend Analysis**: Complaints distributed over 30 days
2. **Category Analysis**: All complaint types represented
3. **Priority Analysis**: Realistic priority distribution
4. **Status Tracking**: Complete complaint lifecycle
5. **Geographic Analysis**: Focused on Yeka Sub City areas
6. **Performance Metrics**: Resolution times and status progression

## 🛠️ Technical Details

### File Formats

#### JSON Structure
```json
{
  "id": "CMP-000001",
  "customer": {
    "id": "CUST-000001",
    "name": "Abebe Kebede",
    "email": "abebe.kebede@gmail.com",
    "phone": "+251091234567",
    "address": "Yeka Sub City, Woreda 01, Kebele 01/02",
    "region": "North Addis Ababa Region",
    "serviceCenter": "NAAR No.6",
    "accountNumber": "123456789",
    "meterNumber": "12345678"
  },
  "title": "Electric pole fell down blocking the road",
  "description": "Detailed description...",
  "category": "pole-fall",
  "priority": "critical",
  "status": "open",
  "createdAt": "2024-07-15T08:30:00.000Z",
  "updatedAt": "2024-07-15T08:30:00.000Z"
}
```

#### CSV Headers
```
ID, Customer Name, Customer Email, Customer Phone, Customer Address,
Region, Service Center, Account Number, Meter Number,
Title, Description, Category, Priority, Status,
Created At, Updated At, Created By, Assigned To, Assigned By
```

## 🎯 Use Cases

1. **System Testing**: Test complaint management functionality
2. **Performance Testing**: Load test with realistic data volume
3. **Analytics Development**: Build dashboards and reports
4. **Training**: Train staff with realistic complaint scenarios
5. **Demo Purposes**: Demonstrate system capabilities
6. **Trend Analysis**: Analyze complaint patterns and trends

## 📞 Support

If you need to modify the seed data or have questions about the generated data:

1. Review the generator script (`seed-complaints.js`)
2. Modify the data arrays and generation logic as needed
3. Re-run the generator to create new seed data
4. Test with your complaint management system

## ⚠️ Important Notes

- This is **test data only** - not real customer information
- Phone numbers and emails are generated and not functional
- Account and meter numbers are random and not linked to real accounts
- Use this data only for testing, training, and development purposes
- Do not use this data in production systems with real customer data