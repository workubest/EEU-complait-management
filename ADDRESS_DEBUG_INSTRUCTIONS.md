# 🔍 Address Column Debug Instructions

## Issue Description
The address column in the complaints list is showing "N/A" instead of the actual customer addresses from the seed data.

## Changes Made

### 1. ✅ **Frontend Mapping Fixed**
- Added `serviceCenter` field to complaint type definition
- Updated `ComplaintsList.tsx` to properly map both `customer.address` and `customer.serviceCenter`
- Added service center column to the complaints table
- Enhanced data mapping with comprehensive fallbacks

### 2. ✅ **Google Apps Script Headers Verified**
- Confirmed headers are correct: `'Customer Address'`, `'Service Center'`
- Data mapping: `item['Customer Address']` → `customer.address`
- Data mapping: `item['Service Center']` → `customer.serviceCenter`

### 3. ✅ **Debug Logging Added**
Added comprehensive console logging to `ComplaintsList.tsx` to track:
- Raw data received from API
- Address field mapping process
- Final mapped data structure

## Testing Steps

### Step 1: Check Browser Console
1. Open the complaints list page (`/dashboard/complaints`)
2. Open browser developer tools (F12)
3. Go to Console tab
4. Look for debug messages:
   ```
   🔍 Raw complaint data received: {...}
   📍 Address fields: {...}
   🏢 Service Center fields: {...}
   📤 Final mapped data: {...}
   ```

### Step 2: Verify Data Source
1. Check if complaints are being loaded from:
   - ✅ Google Sheets (live data)
   - ❌ Mock data (fallback)
   - ❌ Empty/null responses

### Step 3: Check API Response
1. In Network tab, look for API calls to Google Sheets
2. Check response format and data structure
3. Verify `Customer Address` and `Service Center` fields are present

## Expected Behavior

### ✅ **Correct Display:**
```
Address Column: "Yeka Sub City, Woreda 01, Kebele 07/08"
Service Center Column: "NAAR No.6"
```

### ❌ **Current Issue:**
```
Address Column: "N/A"
Service Center Column: "N/A"
```

## Debugging Console Commands

### Run in Browser Console:
```javascript
// Check localStorage for any cached data
Object.keys(localStorage).forEach(key => {
  if (key.includes('complaint') || key.includes('user')) {
    console.log(key, localStorage.getItem(key));
  }
});

// Check if React components have data
const tables = document.querySelectorAll('table');
console.log('Found tables:', tables.length);

// Look for address text in DOM
const addressCells = document.querySelectorAll('td');
addressCells.forEach(cell => {
  if (cell.textContent.includes('Yeka') || cell.textContent.includes('N/A')) {
    console.log('Address cell:', cell.textContent, cell);
  }
});
```

## Possible Root Causes

### 1. **API Data Format Issue**
- Google Sheets API returning different field names
- Data not being fetched from sheets properly
- Headers not matching expected format

### 2. **Authentication Issue**
- Google Sheets API permissions
- Service account access
- CORS issues

### 3. **Data Processing Issue**
- Mapping function not receiving correct data
- Field names case sensitivity
- Null/undefined values in source data

## Quick Fixes to Try

### Fix 1: Check API Configuration
```typescript
// In src/lib/api.ts or similar
console.log('API endpoint:', API_ENDPOINT);
console.log('API response:', response);
```

### Fix 2: Verify Google Sheets Data
1. Open the Google Sheets directly
2. Check if data exists in columns:
   - Column E: `Customer Address`
   - Column G: `Service Center`
3. Verify data format matches expected structure

### Fix 3: Test with Mock Data
Temporarily enable mock data to verify frontend display works:
```typescript
// In ComplaintsList.tsx
const mockComplaint = {
  id: 'TEST-001',
  customer: {
    name: 'Test Customer',
    address: 'Yeka Sub City, Woreda 01, Kebele 01/02',
    serviceCenter: 'NAAR No.6'
  }
};
```

## Next Steps

1. **Run the application** and check browser console for debug logs
2. **Verify API responses** in Network tab
3. **Check Google Sheets** data directly
4. **Test with seed data** from the Google Apps Script
5. **Report findings** based on console logs

## Files Modified

- ✅ `src/pages/ComplaintsList.tsx` - Added debugging and service center column
- ✅ `src/pages/ComplaintDetail.tsx` - Added service center display
- ✅ `src/types/complaint.ts` - Added serviceCenter field
- ✅ `src/pages/ComplaintForm.tsx` - Added serviceCenter to submission
- ✅ `src/components/forms/ComplaintFormAmharic.tsx` - Added serviceCenter to submission

## Debug Output Example

When working correctly, you should see:
```
🔍 Raw complaint data received: {
  "ID": "CMP-000001",
  "Customer Name": "Yeshi Abera", 
  "Customer Address": "Yeka Sub City, Woreda 01, Kebele 07/08",
  "Service Center": "NAAR No.6",
  ...
}

📍 Address fields: {
  "Customer Address": "Yeka Sub City, Woreda 01, Kebele 07/08",
  "customerAddress": undefined,
  "customer.address": undefined,
  "Location": undefined
}

📤 Final mapped data: {
  "id": "CMP-000001",
  "customerName": "Yeshi Abera",
  "customerAddress": "Yeka Sub City, Woreda 01, Kebele 07/08",
  "serviceCenter": "NAAR No.6",
  "customerServiceCenter": "NAAR No.6"
}
```

---

**🎯 Goal:** Address column should display actual addresses like "Yeka Sub City, Woreda 01, Kebele 07/08" instead of "N/A"