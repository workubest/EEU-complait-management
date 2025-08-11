# Google Sheets API Setup Guide for Customer Portal

## 🎯 Overview

The Customer Portal can integrate with Google Sheets to validate customer accounts and store complaint submissions. This guide explains how to set up the integration.

## 📋 Prerequisites

- Google account
- Google Cloud Console access
- Basic understanding of Google Sheets

## 🚀 Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `Ethiopian Electric Utility Portal`
4. Click "Create"

### Step 2: Enable Google Sheets API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on "Google Sheets API"
4. Click "Enable"

### Step 3: Create API Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. (Optional) Click "Restrict Key" to add restrictions:
   - Application restrictions: HTTP referrers
   - Add your domain (e.g., `localhost:8082/*` for development)
   - API restrictions: Select "Google Sheets API"

### Step 4: Create Google Sheets Database

1. Open [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it: `Ethiopian Electric Utility Customer Database`
4. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

### Step 5: Set Up Database Structure

1. Open Google Apps Script: [script.google.com](https://script.google.com/)
2. Create a new project
3. Replace the default code with the contents of `customer-portal-seed.gs`
4. Update the `SHEET_ID` variable with your spreadsheet ID
5. Save and run the `seedCustomerPortalData()` function
6. Authorize the script when prompted

### Step 6: Configure Environment Variables

1. Open `.env.local` in your project root
2. Uncomment and set these variables:
   ```env
   REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key_here
   REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
   ```
3. Save the file
4. Restart your development server

## 🧪 Testing the Integration

### Test Account Numbers

After running the seed script, you can test with these account numbers:

**Residential Customers (Addis Ababa):**
- `1000123456` - አበበ ተስፋዬ (Abebe Tesfaye)
- `1000234567` - ፋጢማ አህመድ (Fatima Ahmed) 
- `1000345678` - ዳንኤል ገብረማርያም (Daniel Gebremariam)
- `1000456789` - ሳራ ወልደ (Sara Wolde)
- `1000567890` - ሙሉጌታ አለሙ (Mulugeta Alemu)

**Regional Customers:**
- `2000123456` - አስተር ተፈሪ (Aster Teferi) - Bahir Dar
- `3000123456` - ገብረ ሥላሴ (Gebre Silassie) - Mekelle
- `4000123456` - ፋሲካ ወልደ (Fasika Wolde) - Hawassa
- `5000123456` - ዮሐንስ ሃይሉ (Yohannes Hailu) - Jimma
- `6000123456` - ሰላም ተክለ (Selam Tekle) - Dessie

**Business Partner Numbers:**
- `BP001234567` to `BP010123456`

### Testing Steps

1. Go to `/customer-portal`
2. Enter one of the test account numbers
3. Click "Validate Account"
4. If configured correctly, you should see customer information
5. Fill out and submit a complaint
6. Check your Google Sheets for the new complaint entry

## 🔧 Troubleshooting

### Common Issues

**1. 400 Bad Request Error**
- Check that the API key is correct
- Verify the spreadsheet ID is correct
- Ensure the Google Sheets API is enabled

**2. 403 Forbidden Error**
- Check API key restrictions
- Verify the spreadsheet is accessible
- Make sure the API key has Google Sheets API access

**3. Demo Mode Still Active**
- Verify environment variables are set correctly
- Restart the development server after changing `.env.local`
- Check that variable names start with `REACT_APP_`

**4. Spreadsheet Not Found**
- Verify the spreadsheet ID is correct
- Check that the spreadsheet is not private
- Ensure the seed script has been run

### Debug Mode

To enable debug logging, add this to your `.env.local`:
```env
REACT_APP_DEBUG_GOOGLE_SHEETS=true
```

## 📊 Database Schema

The seed script creates these sheets:

### Customer_Portal
- Customer ID, Contract Account, Business Partner Number
- Personal information (names in English/Amharic)
- Contact details (email, phone, address)
- Account information (type, connection, tariff)
- Service details (meter number, region, status)

### Billing_History
- Customer billing records for the last 6 months
- Amount, due date, payment status

### Consumption_History
- Monthly meter readings for the last 12 months
- Consumption patterns and trends

### Payment_History
- Payment transactions and methods
- Payment dates and amounts

## 🔒 Security Considerations

### API Key Security
- Never commit API keys to version control
- Use environment variables for all credentials
- Restrict API key usage to specific domains
- Regularly rotate API keys

### Data Privacy
- Ensure customer data compliance
- Implement proper access controls
- Use HTTPS in production
- Consider data encryption for sensitive information

## 🚀 Production Deployment

### Environment Variables
Set these in your production environment:
```env
REACT_APP_GOOGLE_SHEETS_API_KEY=your_production_api_key
REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID=your_production_spreadsheet_id
```

### API Key Restrictions
For production, restrict the API key to:
- Your production domain only
- Google Sheets API only
- Specific IP ranges if possible

### Monitoring
- Monitor API usage in Google Cloud Console
- Set up alerts for quota limits
- Track error rates and response times

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify all setup steps have been completed
3. Test with the provided sample account numbers
4. Check Google Cloud Console for API usage and errors

## 🎉 Success!

Once configured, your Customer Portal will:
- ✅ Validate real customer accounts from Google Sheets
- ✅ Store complaint submissions in the database
- ✅ Provide seamless integration with existing customer data
- ✅ Support both individual and business customers
- ✅ Handle multiple regions across Ethiopia

The portal will automatically switch from demo mode to live mode once the API credentials are properly configured.