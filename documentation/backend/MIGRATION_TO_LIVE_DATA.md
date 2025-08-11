# Migration to Live Data - Complete Guide

This document provides a comprehensive guide for migrating all mock and fallback data to Google Sheets and configuring the application to use live data from the Google Sheets database.

## Overview

The migration process involves:
1. **Data Migration**: Moving all mock data to Google Sheets
2. **Backend Enhancement**: Updating Google Apps Script with comprehensive functions
3. **Frontend Configuration**: Disabling demo mode and enabling live data
4. **Testing**: Verifying all functionality works with live data

## Step 1: Data Migration to Google Sheets

### 1.1 Run the Migration Script

The migration script has been generated and is ready to use:

```bash
node migrate-mock-to-sheets.js
```

This creates:
- `migration-data/Users.csv`
- `migration-data/Customers.csv` 
- `migration-data/Complaints.csv`
- `migration-data/migration-script.gs`

### 1.2 Update Google Apps Script

1. **Open Google Apps Script**: https://script.google.com
2. **Open your project** (Sheet ID: `1vi7SguM67N8BP5_5dNSPh4GO0WDe-Y6_LwfY-GliW0o`)
3. **Replace the existing code** with the enhanced version from `script/enhanced-code.js`
4. **Save the project**
5. **Deploy the script** as a web app

### 1.3 Populate Google Sheets with Data

In Google Apps Script, run these functions in order:

```javascript
// Run these functions one by one in the Google Apps Script editor
migrateUsersData();      // Populates Users sheet
migrateCustomersData();  // Creates and populates Customers sheet  
migrateComplaintsData(); // Populates Complaints sheet
```

Or run all at once:
```javascript
migrateAllData(); // Runs all migration functions
```

## Step 2: Verify Google Sheets Structure

After migration, your Google Sheets should have these sheets:

### Users Sheet
| ID | Name | Email | Password | Role | Region | Department | Phone | Is Active | Created At | Updated At |
|---|---|---|---|---|---|---|---|---|---|---|

### Customers Sheet (New)
| ID | Name | Email | Phone | Address | Region | Meter Number | Account Number | Created At | Updated At |
|---|---|---|---|---|---|---|---|---|---|

### Complaints Sheet
| ID | Customer ID | Customer Name | Customer Email | Customer Phone | Title | Description | Category | Priority | Status | Region | Assigned To | Assigned By | Created By | Created At | Updated At | Estimated Resolution | Resolved At | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

### Activity_Log Sheet (Auto-created)
| ID | Type | Title | Description | User ID | User Name | User Role | Complaint ID | Region | Metadata | Is Important | Timestamp |
|---|---|---|---|---|---|---|---|---|---|---|---|

## Step 3: Frontend Configuration

### 3.1 Environment Variables

The environment has been updated to use live data:

**`.env.development`**:
```env
VITE_FORCE_DEMO_MODE=false
VITE_FORCE_REAL_BACKEND=true
```

### 3.2 API Service Updates

The API service has been updated to:
- Use live backend by default
- Only use demo mode when explicitly forced
- Include comprehensive data transformation
- Support all CRUD operations

## Step 4: Enhanced Backend Features

The enhanced Google Apps Script includes:

### 4.1 Authentication
- ✅ Secure user login with null-safe property access
- ✅ Activity logging for all login attempts
- ✅ Proper error handling

### 4.2 User Management
- ✅ Get all users (excluding passwords)
- ✅ Create new users
- ✅ Update user information
- ✅ Deactivate users (soft delete)
- ✅ Reset user passwords
- ✅ Activity logging for all user operations

### 4.3 Customer Management
- ✅ Get all customers
- ✅ Create new customers
- ✅ Auto-create Customers sheet if missing

### 4.4 Complaint Management
- ✅ Get all complaints with full customer data
- ✅ Create new complaints
- ✅ Update complaint status and details
- ✅ Auto-set resolved date when status changes
- ✅ Activity logging for all complaint operations

### 4.5 Dashboard & Analytics
- ✅ Real-time dashboard statistics
- ✅ Activity feed from logged activities
- ✅ Performance metrics calculation
- ✅ Health check endpoint

### 4.6 Activity Logging
- ✅ Comprehensive activity logging
- ✅ Auto-create Activity_Log sheet
- ✅ Track user actions, complaint changes, system events

## Step 5: Testing the Migration

### 5.1 Test User Authentication

Login with these migrated credentials:
- **Admin**: `admin@eeu.gov.et` / `admin123`
- **Manager**: `manager@eeu.gov.et` / `manager123`
- **Foreman**: `foreman@eeu.gov.et` / `foreman123`
- **Call Attendant**: `attendant@eeu.gov.et` / `attendant123`
- **Technician**: `tech@eeu.gov.et` / `tech123`

### 5.2 Test Data Operations

1. **View Users**: Check user management page
2. **View Complaints**: Verify complaints are loaded from sheets
3. **Create Complaint**: Test complaint creation
4. **Update Complaint**: Test status changes
5. **Dashboard**: Verify real-time statistics
6. **Activity Feed**: Check logged activities

### 5.3 Health Check

Test the health check endpoint:
```
GET https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=healthCheck
```

Expected response:
```json
{
  "status": "ok",
  "complaintsSheet": "available",
  "usersSheet": "available",
  "timestamp": "2025-01-XX...",
  "success": true
}
```

## Step 6: Development Workflow

### 6.1 Adding New Data

To add new users, customers, or complaints:
1. Use the application UI (recommended)
2. Or add directly to Google Sheets
3. Data will be immediately available in the application

### 6.2 Backup and Recovery

- Google Sheets automatically saves all changes
- Version history is available in Google Sheets
- Export data as CSV for additional backups

### 6.3 Monitoring

- Check Google Apps Script logs for errors
- Monitor Activity_Log sheet for user actions
- Use health check endpoint for system status

## Step 7: Production Deployment

### 7.1 Environment Configuration

For production deployment:

**`.env.production`**:
```env
VITE_FORCE_DEMO_MODE=false
VITE_FORCE_REAL_BACKEND=true
```

### 7.2 Google Apps Script Deployment

1. **Deploy as Web App**:
   - Execute as: Me
   - Who has access: Anyone
2. **Copy the deployment URL**
3. **Update environment variables** with the new URL

### 7.3 Security Considerations

- ✅ Passwords are never returned in API responses
- ✅ User authentication is required for all operations
- ✅ Activity logging tracks all user actions
- ✅ Soft delete for users (deactivation instead of deletion)

## Troubleshooting

### Common Issues

1. **"Users sheet not found"**
   - Ensure the sheet name is exactly "Users"
   - Run `migrateUsersData()` function

2. **"Login failed"**
   - Check if user data was migrated correctly
   - Verify email and password in Google Sheets
   - Check Google Apps Script logs

3. **"No data returned"**
   - Verify Google Apps Script deployment
   - Check CORS settings
   - Ensure correct API URL in environment

4. **"Demo mode still active"**
   - Verify `.env.development` settings
   - Restart development server
   - Clear browser cache

### Debug Steps

1. **Check Google Apps Script Logs**:
   - Open Google Apps Script
   - View > Logs
   - Look for error messages

2. **Test API Directly**:
   ```
   GET https://your-script-url/exec?action=healthCheck
   ```

3. **Browser Console**:
   - Check for API errors
   - Verify environment variables
   - Look for CORS issues

## Success Criteria

✅ **Data Migration Complete**:
- All mock users migrated to Google Sheets
- All mock customers migrated to Google Sheets  
- All mock complaints migrated to Google Sheets

✅ **Backend Enhanced**:
- Google Apps Script updated with comprehensive functions
- All CRUD operations working
- Activity logging implemented

✅ **Frontend Updated**:
- Demo mode disabled
- Live backend enabled
- All API endpoints working

✅ **Testing Passed**:
- User authentication working
- Data operations functional
- Dashboard showing live data
- Activity feed populated

## Next Steps

After successful migration:

1. **Monitor Performance**: Check response times and error rates
2. **User Training**: Train users on the live system
3. **Data Maintenance**: Regular cleanup and optimization
4. **Feature Enhancement**: Add new features using live data
5. **Backup Strategy**: Implement regular data backups

## Support

For issues or questions:
1. Check Google Apps Script logs
2. Review this migration guide
3. Test with health check endpoint
4. Verify Google Sheets data integrity

---

**Migration Status**: ✅ Complete
**Last Updated**: January 2025
**Version**: 1.0