# Google Apps Script Backend Setup Guide

This guide provides step-by-step instructions for setting up the Google Apps Script backend for the Ethio Power Resolve system.

## Overview

The backend handles:
- **Authentication System**: Secure login with email/password
- **User Management**: CRUD operations for system users
- **Complaint Management**: Full complaint lifecycle management
- **Customer Management**: Customer data handling
- **Dashboard Analytics**: Real-time statistics and metrics
- **Activity Logging**: Comprehensive audit trail
- **Health Monitoring**: System status checks

## Step 1: Create Google Sheets Database

First, create a new Google Sheets document with the following sheets:

### Users Sheet
Headers: `ID | Name | Email | Password | Role | Region | Department | Phone | Is Active | Created At | Updated At`

### Complaints Sheet  
Headers: `ID | Customer ID | Customer Name | Customer Email | Customer Phone | Title | Description | Category | Priority | Status | Region | Assigned To | Assigned By | Created By | Created At | Updated At | Estimated Resolution | Resolved At | Notes`

### Customers Sheet
Headers: `ID | Name | Email | Phone | Address | Region | Meter Number | Account Number | Created At | Updated At`

### Activity_Log Sheet (Auto-created)
Headers: `ID | Type | Title | Description | User ID | User Name | User Role | Complaint ID | Region | Metadata | Is Important | Timestamp`

## Step 2: Deploy Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Replace the default `Code.gs` content with the content from `backend-code.gs`
4. Update the `SHEET_ID` in the CONFIG object with your Google Sheets ID
5. Save the project
6. Deploy as a web app:
   - Click "Deploy" > "New deployment"
   - Choose "Web app" as type
   - Set execute permissions to "Anyone"
   - Click "Deploy"
   - Copy the web app URL for your frontend configuration

## Step 3: Configuration

Update the `CONFIG` object in your Google Apps Script with your Google Sheets ID:

```javascript
const CONFIG = {
  SHEET_ID: 'YOUR_GOOGLE_SHEETS_ID_HERE',
  USER_SHEET: 'Users',
  COMPLAINT_SHEET: 'Complaints', 
  CUSTOMER_SHEET: 'Customers',
  ACTIVITY_SHEET: 'Activity_Log'
};
```

## Step 4: Populate with Mock Data

Run the migration script to populate your sheets with test data:

1. In Google Apps Script, go to the migration script file
2. Run the `migrateAllData()` function
3. This will populate all sheets with sample data

## API Endpoints

The deployed web app supports the following actions via POST requests:

### Authentication
- `login` - User authentication

### User Management
- `getUsers` - Retrieve all users
- `createUser` - Create new user
- `updateUser` - Update existing user
- `deleteUser` - Deactivate user
- `resetUserPassword` - Reset user password

### Customer Management
- `getCustomers` - Retrieve all customers
- `createCustomer` - Create new customer

### Complaint Management
- `getComplaints` - Retrieve all complaints
- `createComplaint` - Create new complaint
- `updateComplaint` - Update existing complaint

### Dashboard & Analytics
- `getDashboardStats` - Get system statistics
- `getActivityFeed` - Get recent activities

### System
- `healthCheck` - System status check

## Request Format

Send POST requests to your deployed web app URL with JSON payload:

```javascript
{
  "action": "login",
  "email": "user@example.com", 
  "password": "password123"
}
```

## Response Format

All responses follow this structure:

```javascript
{
  "success": true/false,
  "data": {...}, // Response data
  "error": "Error message", // If success is false
  "message": "Success message" // If applicable
}
```

## Test User Credentials

After running the migration, you can log in with these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@eeu.gov.et | admin123 |
| Manager | manager@eeu.gov.et | manager123 |
| Foreman | foreman@eeu.gov.et | foreman123 |
| Call Attendant | attendant@eeu.gov.et | attendant123 |
| Technician | tech@eeu.gov.et | tech123 |

## Frontend Configuration

Update your React frontend to use the deployed web app URL:

```javascript
// In your API configuration
const API_BASE_URL = 'YOUR_DEPLOYED_WEB_APP_URL_HERE';
```

## Troubleshooting

### Common Issues:

1. **"Users sheet not found"**: Make sure your Google Sheets has a sheet named "Users" with the correct headers
2. **"Permission denied"**: Ensure the web app is deployed with "Anyone" execute permissions
3. **"Invalid credentials"**: Check that user data exists in the Users sheet
4. **CORS errors**: Google Apps Script automatically handles CORS for web apps

### Debugging:

1. Check the Google Apps Script logs (View > Logs)
2. Test individual functions in the script editor
3. Verify sheet names and headers match exactly
4. Ensure the SHEET_ID is correct

## Security Notes

- Passwords are stored in plain text in Google Sheets (for demo purposes)
- In production, implement proper password hashing
- Consider using Google's built-in authentication for enhanced security
- Regularly review and rotate access permissions