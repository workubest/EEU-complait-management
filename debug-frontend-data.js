/**
 * Debug script to check what data is being received by the frontend
 * This script can be run in the browser console to debug data issues
 */

// Function to debug complaint data in browser console
function debugComplaintData() {
  console.log('🔍 Debugging Complaint Data...');
  
  // Check if we're on the complaints page
  if (!window.location.pathname.includes('complaints')) {
    console.log('⚠️ Please navigate to the complaints page first');
    return;
  }
  
  // Try to access React component state (this might not work in production)
  const reactRoot = document.querySelector('#root');
  if (reactRoot && reactRoot._reactInternalFiber) {
    console.log('🔍 Found React root, attempting to access component state...');
  }
  
  // Check for any complaint data in localStorage
  const localStorageKeys = Object.keys(localStorage);
  console.log('📦 LocalStorage keys:', localStorageKeys);
  
  localStorageKeys.forEach(key => {
    if (key.includes('complaint') || key.includes('user') || key.includes('auth')) {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        console.log(`📋 ${key}:`, data);
      } catch (e) {
        console.log(`📋 ${key}:`, localStorage.getItem(key));
      }
    }
  });
  
  // Check for any complaint data in sessionStorage
  const sessionStorageKeys = Object.keys(sessionStorage);
  console.log('🗂️ SessionStorage keys:', sessionStorageKeys);
  
  sessionStorageKeys.forEach(key => {
    if (key.includes('complaint') || key.includes('user') || key.includes('auth')) {
      try {
        const data = JSON.parse(sessionStorage.getItem(key));
        console.log(`📋 ${key}:`, data);
      } catch (e) {
        console.log(`📋 ${key}:`, sessionStorage.getItem(key));
      }
    }
  });
  
  // Check for complaint elements in the DOM
  const complaintElements = document.querySelectorAll('[data-complaint-id], .complaint-item, .complaint-card');
  console.log(`🎯 Found ${complaintElements.length} complaint elements in DOM`);
  
  complaintElements.forEach((element, index) => {
    console.log(`📱 Complaint Element ${index + 1}:`, element);
    
    // Look for address and service center text
    const addressElements = element.querySelectorAll('*');
    addressElements.forEach(el => {
      if (el.textContent && (
        el.textContent.includes('Yeka') || 
        el.textContent.includes('NAAR') || 
        el.textContent.includes('N/A') ||
        el.textContent.includes('Not provided')
      )) {
        console.log(`  📍 Found relevant text: "${el.textContent.trim()}" in element:`, el);
      }
    });
  });
  
  // Check for any API calls in network tab (if available)
  if (window.performance && window.performance.getEntriesByType) {
    const networkEntries = window.performance.getEntriesByType('resource');
    const apiCalls = networkEntries.filter(entry => 
      entry.name.includes('api') || 
      entry.name.includes('sheets') || 
      entry.name.includes('script.google')
    );
    
    console.log(`🌐 Found ${apiCalls.length} API-related network calls:`);
    apiCalls.forEach(call => {
      console.log(`  📡 ${call.name} - ${call.responseEnd - call.requestStart}ms`);
    });
  }
  
  console.log('✅ Debug completed. Check the logs above for any issues.');
}

// Function to test the mapping with sample data
function testMappingInBrowser() {
  console.log('🧪 Testing data mapping in browser...');
  
  const sampleData = {
    'ID': 'CMP-TEST-001',
    'Customer Name': 'Test Customer',
    'Customer Address': 'Yeka Sub City, Woreda 01, Kebele 01/02',
    'Service Center': 'NAAR No.6',
    'Region': 'North Addis Ababa Region'
  };
  
  console.log('📥 Sample input:', sampleData);
  
  // Simulate the mapping function
  const mapped = {
    id: sampleData['ID'],
    customer: {
      name: sampleData['Customer Name'],
      address: sampleData['Customer Address'],
      serviceCenter: sampleData['Service Center'],
      region: sampleData['Region']
    },
    region: sampleData['Region'],
    serviceCenter: sampleData['Service Center']
  };
  
  console.log('📤 Mapped output:', mapped);
  
  // Test display logic
  const displayAddress = mapped.customer.address || 'Not provided';
  const displayServiceCenter = mapped.customer.serviceCenter || mapped.serviceCenter || 'Not provided';
  
  console.log('🖥️ Display values:');
  console.log(`  Address: ${displayAddress}`);
  console.log(`  Service Center: ${displayServiceCenter}`);
  
  if (displayAddress === 'Not provided') {
    console.log('❌ Address would show as "Not provided"');
  } else {
    console.log('✅ Address would display correctly');
  }
  
  if (displayServiceCenter === 'Not provided') {
    console.log('❌ Service Center would show as "Not provided"');
  } else {
    console.log('✅ Service Center would display correctly');
  }
}

// Function to check API response format
function checkAPIResponse() {
  console.log('🔍 Checking API response format...');
  
  // This would need to be run when an API call is made
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    return originalFetch.apply(this, args).then(response => {
      if (args[0] && args[0].includes('complaints')) {
        console.log('📡 Intercepted complaints API call:', args[0]);
        
        response.clone().json().then(data => {
          console.log('📥 API Response:', data);
          
          if (data && data.data && Array.isArray(data.data)) {
            console.log(`📊 Found ${data.data.length} complaints in response`);
            
            if (data.data.length > 0) {
              const firstComplaint = data.data[0];
              console.log('📋 First complaint structure:', firstComplaint);
              
              // Check for address and service center fields
              const hasCustomerAddress = firstComplaint['Customer Address'] || firstComplaint.customerAddress;
              const hasServiceCenter = firstComplaint['Service Center'] || firstComplaint.serviceCenter;
              
              console.log('🔍 Field check:');
              console.log(`  Customer Address: ${hasCustomerAddress ? '✅ Present' : '❌ Missing'}`);
              console.log(`  Service Center: ${hasServiceCenter ? '✅ Present' : '❌ Missing'}`);
              
              if (hasCustomerAddress) {
                console.log(`  Address value: "${hasCustomerAddress}"`);
              }
              if (hasServiceCenter) {
                console.log(`  Service Center value: "${hasServiceCenter}"`);
              }
            }
          }
        }).catch(err => {
          console.log('❌ Error parsing API response:', err);
        });
      }
      
      return response;
    });
  };
  
  console.log('✅ API interceptor installed. Make a request to see the data.');
}

// Export functions for browser console use
window.debugComplaintData = debugComplaintData;
window.testMappingInBrowser = testMappingInBrowser;
window.checkAPIResponse = checkAPIResponse;

console.log('🛠️ Debug functions loaded. Available functions:');
console.log('  - debugComplaintData() - Debug current page data');
console.log('  - testMappingInBrowser() - Test data mapping');
console.log('  - checkAPIResponse() - Intercept and check API responses');
console.log('');
console.log('💡 Usage: Open browser console and call any of these functions');

// Auto-run basic debug if we're on complaints page
if (typeof window !== 'undefined' && window.location && window.location.pathname.includes('complaints')) {
  setTimeout(() => {
    console.log('🚀 Auto-running debug on complaints page...');
    debugComplaintData();
  }, 2000);
}