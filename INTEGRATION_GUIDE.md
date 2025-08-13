# Customer Portal Complaint Form Integration Guide

This guide will help you integrate the customer portal complaint form with your Google Apps Script backend.

## 🎯 Overview

The integration connects your React-based complaint form with a Google Apps Script backend that stores data in Google Sheets. The system handles:

- ✅ Customer complaint submission
- ✅ Real-time data storage in Google Sheets
- ✅ User authentication and authorization
- ✅ Dashboard analytics and reporting
- ✅ Activity logging and audit trails

## 📋 Prerequisites

1. **Google Account** with access to Google Sheets and Google Apps Script
2. **Google Sheets Document** with the required structure
3. **Google Apps Script Project** deployed as a web app
4. **React Application** (already set up in this project)

## 🚀 Step-by-Step Integration

### Step 1: Set Up Google Sheets Database

1. Create a new Google Sheets document
2. Create the following sheets with these exact names and headers:

#### Users Sheet
```
ID | Name | Email | Password | Role | Region | Department | Phone | Is Active | Created At | Updated At
```

#### Complaints Sheet
```
ID | Customer ID | Customer Name | Customer Email | Customer Phone | Customer Address | Region | Title | Description | Category | Priority | Status | Assigned To | Assigned By | Created By | Created At | Updated At | Estimated Resolution | Resolved At | Resolution Notes | Customer Satisfaction | Follow Up Required | Cost Impact | Service Interruption Duration | Affected Customers Count | Language | Attachments | Internal Notes
```

#### Customers Sheet
```
ID | Name | Email | Phone | Address | Region | Meter Number | Account Number | Created At | Updated At
```

#### Activity_Log Sheet
```
ID | Type | Description | User ID | User Name | Timestamp | Related ID | Related Type
```

3. Copy your Google Sheets ID from the URL (the long string between `/d/` and `/edit`)

### Step 2: Deploy Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Replace the default `Code.gs` content with the code from `complete-backend.gs`
4. Update the `SHEET_ID` in the CONFIG object:
   ```javascript
   const CONFIG = {
     SHEET_ID: 'YOUR_GOOGLE_SHEETS_ID_HERE', // Replace with your actual Sheet ID
     USER_SHEET: 'Users',
     COMPLAINT_SHEET: 'Complaints',
     CUSTOMER_SHEET: 'Customers',
     ACTIVITY_SHEET: 'Activity_Log'
   };
   ```

5. Save the project (Ctrl+S)
6. Deploy as a web app:
   - Click **Deploy** → **New deployment**
   - Choose **Web app** as type
   - Set **Execute as**: Me (your email)
   - Set **Who has access**: Anyone
   - Click **Deploy**
   - Copy the web app URL

### Step 3: Update Frontend Configuration

1. Update the Google Apps Script URL in `src/config/environment.ts`:
   ```typescript
   const GOOGLE_APPS_SCRIPT_URL = 'YOUR_DEPLOYED_WEB_APP_URL_HERE';
   ```

2. Ensure the environment is configured for real backend:
   ```typescript
   export const environment: EnvironmentConfig = {
     // ... other config
     apiBaseUrl: isProduction ? '/.netlify/functions/proxy' : GOOGLE_APPS_SCRIPT_URL,
     forceRealBackend: true,
     forceDemoMode: false
   };
   ```

### Step 4: Seed Initial Data (Optional)

1. In Google Apps Script, run the `initializeSheets()` function to create sheet headers
2. Add some test users to the Users sheet:
   ```
   USR-001 | Admin User | admin@eeu.gov.et | admin123 | admin | Addis Ababa | IT | +251-11-123-4567 | TRUE | 2025-01-01T00:00:00Z | 2025-01-01T00:00:00Z
   ```

### Step 5: Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the complaint form
3. Fill out and submit a test complaint
4. Check your Google Sheets to verify the data was saved

## 🔧 API Endpoints

The backend supports these actions:

### Authentication
- `login` - User authentication

### Complaint Management
- `createComplaint` - Create new complaint
- `getComplaints` - Retrieve complaints
- `updateComplaint` - Update existing complaint

### User Management
- `getUsers` - Retrieve users
- `createUser` - Create new user
- `updateUser` - Update user
- `deleteUser` - Deactivate user

### Dashboard & Analytics
- `getDashboardStats` - Get system statistics
- `getActivityFeed` - Get recent activities

### System
- `healthCheck` - System status check

## 📝 Request/Response Format

### Request Format (POST)
```javascript
{
  "action": "createComplaint",
  "customer": {
    "name": "Customer Name",
    "email": "customer@email.com",
    "phone": "+251-911-123456",
    "address": "Customer Address",
    "region": "Addis Ababa"
  },
  "title": "Complaint Title",
  "description": "Detailed description",
  "category": "power-outage",
  "priority": "medium",
  "createdBy": "user-id"
}
```

### Response Format
```javascript
{
  "success": true,
  "data": {
    "id": "CMP-1234567890",
    // ... complaint data
  },
  "message": "Complaint created successfully"
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **"Users sheet not found"**
   - Verify sheet names match exactly (case-sensitive)
   - Ensure the SHEET_ID is correct

2. **"Permission denied"**
   - Check web app deployment permissions
   - Ensure "Anyone" has access to execute

3. **CORS errors**
   - Google Apps Script handles CORS automatically
   - Ensure you're using the correct deployment URL

4. **Data not saving**
   - Check Google Apps Script execution logs
   - Verify sheet headers match the expected format

### Debugging Steps

1. **Check Google Apps Script Logs**:
   - Go to Google Apps Script editor
   - Click **View** → **Logs**
   - Look for error messages

2. **Test Individual Functions**:
   - In Google Apps Script, run functions manually
   - Use `testBackend()` function to verify setup

3. **Verify Network Requests**:
   - Open browser developer tools
   - Check Network tab for API requests
   - Verify request/response data

## 🔒 Security Considerations

- Passwords are stored in plain text (for demo purposes)
- In production, implement proper password hashing
- Consider using Google's OAuth for authentication
- Regularly review access permissions
- Monitor Google Apps Script execution quotas

## 📊 Data Flow

1. **User submits complaint** → React form
2. **Form data sent** → API service
3. **API request made** → Google Apps Script
4. **Data processed** → Backend functions
5. **Data stored** → Google Sheets
6. **Response returned** → Frontend
7. **User notified** → Toast message

## 🎉 Success Indicators

When everything is working correctly, you should see:

- ✅ Health check returns `status: 'ok'`
- ✅ Login works with test credentials
- ✅ Complaints are saved to Google Sheets
- ✅ Dashboard shows real-time statistics
- ✅ Activity log records user actions

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all configuration steps
3. Test with the provided test script
4. Check Google Apps Script execution logs
5. Ensure all required sheets exist with correct headers

The integration should now be complete and functional!