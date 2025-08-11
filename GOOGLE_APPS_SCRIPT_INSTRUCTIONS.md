# 🌱 Google Apps Script - Complaint Seed Data Generator

This Google Apps Script (.gs) generates realistic complaint seed data directly in Google Sheets for the Ethiopian Electric Utility complaint management system.

## 🚀 Quick Setup & Usage

### Step 1: Open Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the contents of `seed-complaints.gs`

### Step 2: Run the Script
1. Save the project (Ctrl+S) and give it a name like "Complaint Seed Generator"
2. Click the "Run" button (▶️) or select `runCompleteSeeding` function
3. Grant necessary permissions when prompted
4. Wait for the script to complete (should take 10-30 seconds)

### Step 3: View Results
The script will create a new Google Sheets spreadsheet with:
- **Complaint_Seed_Data** sheet: 100 realistic complaints
- **Summary_Statistics** sheet: Overview and instructions

## 📊 Generated Data Specifications

### 🎯 **Location Details**
- **Region**: North Addis Ababa Region
- **Service Center**: NAAR No.6
- **Areas**: Yeka Sub City (Woreda 01, 02, 03)
  - 15 different kebele addresses across the 3 woredas

### 📅 **Time Distribution**
- **Date Range**: Last 30 days from current date
- **Trend Analysis**: Complaints distributed across different days
- **Status Progression**: Realistic status changes based on complaint age

### 📋 **Data Categories**
- **21 Complaint Types**: pole-fall, meter issues, power outages, billing, etc.
- **4 Priority Levels**: Low, Medium, High, Critical
- **5 Status Types**: Open, In-Progress, Resolved, Escalated, Closed

### 👥 **Customer Data**
- **30 Ethiopian Names**: Authentic Ethiopian customer names
- **Phone Numbers**: Ethiopian format (+251-09X-XXXXXXX)
- **Email Addresses**: Generated based on customer names
- **Account Numbers**: 9-digit realistic account numbers
- **Meter Numbers**: 8-digit realistic meter numbers

## 🔧 Available Functions

### Main Functions:
- **`runCompleteSeeding()`** - Runs the complete process (recommended)
- **`generateComplaintSeedData()`** - Generates complaint data only
- **`createSummarySheet()`** - Creates summary statistics sheet

### Customization Functions:
- **`generateComplaints(count)`** - Change the number of complaints (default: 100)
- **`getRandomComplaintCategory()`** - Modify available categories
- **`getRandomYekaAddress()`** - Add more addresses or change locations

## 📈 Data Distribution

### Priority Distribution:
- **Critical**: ~16% (pole-fall, safety-concern, transformer-issue)
- **High**: ~19% (power outages, voltage issues)
- **Medium**: ~41% (meter problems, billing issues)
- **Low**: ~24% (routine requests, minor issues)

### Status Distribution:
- **Open**: ~8% (recent complaints)
- **In-Progress**: ~6% (being worked on)
- **Resolved**: ~34% (fixed but not closed)
- **Escalated**: ~7% (complex issues)
- **Closed**: ~45% (completed complaints)

## 🛠️ Customization Options

### Change Number of Complaints:
```javascript
// In the generateComplaintSeedData() function, modify:
const complaints = generateComplaints(200); // Generate 200 instead of 100
```

### Change Date Range:
```javascript
// In the getRandomDate() function, modify:
const thirtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000)); // 60 days instead of 30
```

### Add More Areas:
```javascript
// In the getRandomYekaAddress() function, add more addresses:
const addresses = [
  'Yeka Sub City, Woreda 01, Kebele 01/02',
  'Your New Area Here',
  // ... add more addresses
];
```

### Change Service Center:
```javascript
// In the generateComplaints() function, modify:
serviceCenter: 'NAAR No.7', // Change to different service center
```

## 📊 Using the Generated Data

### For Analysis:
1. **Pivot Tables**: Create pivot tables to analyze trends by category, priority, status
2. **Charts**: Generate charts showing complaint distribution over time
3. **Filtering**: Use filters to focus on specific categories or time periods

### For Export:
1. **CSV Export**: File → Download → Comma-separated values (.csv)
2. **Excel Export**: File → Download → Microsoft Excel (.xlsx)
3. **PDF Export**: File → Download → PDF Document (.pdf)

### For API Import:
1. Use Google Sheets API to read the data programmatically
2. Export as CSV and import into your complaint management system
3. Copy data manually for testing purposes

## 🔍 Data Validation

The script generates realistic data with:
- ✅ **Consistent Formatting**: All dates, phone numbers, emails properly formatted
- ✅ **Logical Relationships**: Status progression based on complaint age
- ✅ **Priority Mapping**: Priority levels match complaint severity
- ✅ **Geographic Consistency**: All addresses within Yeka Sub City
- ✅ **Service Center Alignment**: All complaints assigned to NAAR No.6

## 🚨 Troubleshooting

### Common Issues:

**Permission Errors:**
- Grant all requested permissions when prompted
- Make sure you're signed into the correct Google account

**Script Timeout:**
- If generating large datasets (>500 complaints), split into smaller batches
- Increase timeout in script settings if needed

**Sheet Not Created:**
- Check if you have permission to create new spreadsheets
- Try running `generateComplaintSeedData()` function individually

**Data Not Appearing:**
- Check the execution log (View → Logs) for error messages
- Verify the sheet names match the script expectations

## 📞 Support

### Modifying the Script:
1. **Add New Categories**: Modify the `getRandomComplaintCategory()` function
2. **Change Customer Names**: Update the names array in `getRandomCustomerName()`
3. **Adjust Descriptions**: Modify the descriptions object in `generateDescription()`
4. **Update Addresses**: Change the addresses array in `getRandomYekaAddress()`

### Best Practices:
- Test with small datasets first (10-20 complaints)
- Save your customizations before running
- Keep backups of working versions
- Document any changes you make

## 🎯 Use Cases

1. **Dashboard Testing**: Populate complaint management dashboards
2. **Trend Analysis**: Analyze complaint patterns and trends
3. **Performance Metrics**: Test resolution time calculations
4. **Training Data**: Train staff with realistic complaint scenarios
5. **System Demo**: Demonstrate application capabilities
6. **Load Testing**: Test system performance with realistic data volume

## ⚠️ Important Notes

- **Test Data Only**: This is simulated data for testing purposes
- **Not Real Customers**: Names, phone numbers, and emails are generated
- **Development Use**: Only use for development, testing, and training
- **Privacy Compliant**: No real customer information is used
- **Customizable**: Modify the script to match your specific needs

---

**🎉 Ready to Generate Seed Data!**

Run `runCompleteSeeding()` in Google Apps Script to create your complaint seed data spreadsheet with 100 realistic complaints for North Addis Ababa Region, NAAR No.6 service center, distributed across Yeka Sub City areas over the last 30 days!