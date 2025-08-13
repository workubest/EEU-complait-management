# Customer Portal Demo Guide

## Overview
The Customer Portal allows customers to search for their account information using either a Contract Account Number or Business Partner Number, then file complaints directly through the system.

## How to Access
1. Navigate to the application root URL
2. You'll see the Landing Page with two options:
   - **Customer Portal** - For customers to file complaints
   - **Staff Portal** - For EEU staff to manage complaints

## Customer Portal Workflow

### Step 1: Account Search
1. Click on "Customer Portal" from the landing page
2. You'll be redirected to `/customer-portal`
3. Choose search type:
   - **Contract Account** - Use your electricity contract account number
   - **Business Partner** - Use your business partner number
4. Enter the account number (e.g., `1234567890` for contract or `BP12345678` for business partner)
5. Click the **Search** button

### Step 2: Customer Information Display
Once a customer is found, the system displays:
- **Personal Information**: Name, phone, email, address
- **Account Details**: Contract account, business partner number, meter number
- **Service Information**: Connection type, account status, region
- **Account Status**: Active/Inactive/Suspended with color-coded badges

### Step 3: Filing a Complaint
1. After customer information is displayed, click **"File a Complaint"** button
2. The complaint form will appear with the following fields:

#### Required Fields:
- **Complaint Title**: Brief description of the issue
- **Category**: Select from predefined categories:
  - Power Outage
  - Voltage Fluctuation
  - Billing Issue
  - Meter Problem
  - Line Damage
  - Transformer Issue
  - Safety Concern
  - New Connection
  - Disconnection
  - Other
- **Description**: Detailed explanation of the problem

#### Optional Fields:
- **Urgency Level**: Low, Medium, High
- **Preferred Contact Method**: Phone, Email, SMS
- **Additional Phone**: Alternative contact number
- **Additional Email**: Alternative email address

### Step 4: Complaint Submission
1. Fill in all required fields
2. Review the information notice about complaint processing
3. Click **Submit** to file the complaint
4. You'll receive a confirmation with a reference ID for tracking

## Features

### Multi-language Support
- Available in English and Amharic
- Use the language switcher in the top-right corner
- All form fields, labels, and messages are translated

### Account Validation
- Real-time search with loading indicators
- Error handling for invalid account numbers
- Mock data provided for demonstration purposes

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Clean, professional interface matching EEU branding
- Intuitive navigation and form layout

### Customer Information Security
- Customer data is pre-populated in the complaint form
- No sensitive information is exposed unnecessarily
- Secure form submission with validation

## Demo Data

For testing purposes, you can use any contract account or business partner number. The system will generate mock customer data including:

- **Name**: Abebe Kebede (sample Ethiopian name)
- **Phone**: +251911234567
- **Email**: abebe.kebede@email.com
- **Address**: Bole Sub City, Woreda 03, House No. 123
- **Region**: Addis Ababa
- **Account Status**: Active
- **Connection Type**: Residential

## Technical Implementation

### Customer Search API
- Endpoint: `?action=searchCustomer`
- Parameters: `type` (contract/business), `value` (account number)
- Returns: Customer information with account details

### Complaint Submission API
- Endpoint: `?action=createComplaint`
- Includes customer information and complaint details
- Source marked as 'customer_portal' for tracking

### Translation Keys
All customer portal text uses translation keys:
- `customer.*` - Customer portal specific translations
- `complaint.*` - Complaint form translations
- `common.*` - Common UI elements

## Navigation Structure

```
/ (Landing Page)
├── /customer-portal (Public - Customer Portal)
├── /login (Public - Staff Login)
└── /dashboard/* (Protected - Staff Dashboard)
    ├── /dashboard/complaints
    ├── /dashboard/analytics
    └── ... (other staff features)
```

## Benefits

1. **Customer Self-Service**: Customers can file complaints 24/7 without calling
2. **Reduced Call Volume**: Less burden on customer service representatives
3. **Better Tracking**: Each complaint gets a unique reference ID
4. **Multi-language**: Accessible to both English and Amharic speakers
5. **Mobile Friendly**: Can be used on any device
6. **Integration**: Complaints filed through portal integrate with staff management system

## Next Steps

1. **Testing**: Test with various account numbers and complaint types
2. **Integration**: Connect to real customer database for account lookup
3. **Notifications**: Add SMS/Email notifications for complaint status updates
4. **Tracking**: Add complaint tracking feature for customers
5. **Analytics**: Track portal usage and customer satisfaction