// Routing Test Script
// Run this in browser console to test navigation functionality

console.log('🧪 Testing Dashboard Navigation...');

// Test function to simulate clicks and check navigation
function testNavigation() {
  console.log('📋 Testing Dashboard Component Navigation...');
  
  // Test 1: Check if we're on the dashboard
  const currentPath = window.location.pathname;
  console.log(`Current path: ${currentPath}`);
  
  if (currentPath.includes('/dashboard')) {
    console.log('✅ Currently on dashboard route');
  } else {
    console.log('❌ Not on dashboard route');
  }
  
  // Test 2: Check for navigation elements
  const statsCards = document.querySelectorAll('.card');
  const quickActionButtons = document.querySelectorAll('button');
  const sidebarLinks = document.querySelectorAll('a[href*="/dashboard"]');
  
  console.log(`Found ${statsCards.length} stat cards`);
  console.log(`Found ${quickActionButtons.length} buttons`);
  console.log(`Found ${sidebarLinks.length} sidebar links`);
  
  // Test 3: Check sidebar links
  console.log('🔗 Testing Sidebar Links...');
  sidebarLinks.forEach((link, index) => {
    const href = link.getAttribute('href');
    console.log(`Sidebar link ${index + 1}: ${href}`);
    
    if (href && href.startsWith('/dashboard')) {
      console.log(`✅ Correct path format: ${href}`);
    } else {
      console.log(`❌ Incorrect path format: ${href}`);
    }
  });
  
  // Test 4: Test programmatic navigation
  console.log('🧭 Testing Programmatic Navigation...');
  
  // Store original path
  const originalPath = window.location.pathname;
  
  // Test navigation to complaints
  if (window.history && window.history.pushState) {
    console.log('Testing navigation to /dashboard/complaints...');
    window.history.pushState({}, '', '/dashboard/complaints');
    
    setTimeout(() => {
      if (window.location.pathname === '/dashboard/complaints') {
        console.log('✅ Navigation to /dashboard/complaints successful');
      } else {
        console.log('❌ Navigation to /dashboard/complaints failed');
      }
      
      // Restore original path
      window.history.pushState({}, '', originalPath);
    }, 100);
  }
  
  // Test 5: Check for 404 errors in console
  console.log('🚨 Checking for 404 errors...');
  
  // Monitor network requests
  const originalFetch = window.fetch;
  let requestCount = 0;
  let errorCount = 0;
  
  window.fetch = function(...args) {
    requestCount++;
    return originalFetch.apply(this, args)
      .then(response => {
        if (response.status === 404) {
          errorCount++;
          console.log(`❌ 404 Error detected: ${args[0]}`);
        }
        return response;
      })
      .catch(error => {
        errorCount++;
        console.log(`❌ Network Error: ${error.message}`);
        throw error;
      });
  };
  
  // Restore fetch after 5 seconds
  setTimeout(() => {
    window.fetch = originalFetch;
    console.log(`📊 Network Summary: ${requestCount} requests, ${errorCount} errors`);
  }, 5000);
}

// Test function to simulate clicking dashboard elements
function testDashboardClicks() {
  console.log('🖱️ Testing Dashboard Click Events...');
  
  // Find clickable elements
  const clickableCards = document.querySelectorAll('.card[class*="cursor-pointer"], .card[class*="hover"]');
  const viewAllButtons = document.querySelectorAll('button:contains("View All"), button:contains("All")');
  const quickActionButtons = document.querySelectorAll('button[class*="space-x"]');
  
  console.log(`Found ${clickableCards.length} clickable cards`);
  console.log(`Found ${viewAllButtons.length} "View All" buttons`);
  console.log(`Found ${quickActionButtons.length} quick action buttons`);
  
  // Test clicking first stat card (if exists)
  if (clickableCards.length > 0) {
    console.log('Testing stat card click...');
    const firstCard = clickableCards[0];
    
    // Add click listener to monitor navigation
    const originalPushState = window.history.pushState;
    window.history.pushState = function(state, title, url) {
      console.log(`✅ Navigation triggered: ${url}`);
      return originalPushState.apply(this, arguments);
    };
    
    // Simulate click
    firstCard.click();
    
    // Restore pushState after 1 second
    setTimeout(() => {
      window.history.pushState = originalPushState;
    }, 1000);
  }
}

// Test function to check route accessibility
function testRouteAccessibility() {
  console.log('🔍 Testing Route Accessibility...');
  
  const testRoutes = [
    '/dashboard',
    '/dashboard/complaints',
    '/dashboard/complaints/new',
    '/dashboard/complaints/search',
    '/dashboard/analytics',
    '/dashboard/reports',
    '/dashboard/users',
    '/dashboard/notifications',
    '/dashboard/settings'
  ];
  
  testRoutes.forEach(route => {
    // Create a temporary link and test if it would work
    const testLink = document.createElement('a');
    testLink.href = route;
    
    if (testLink.href.includes('/dashboard')) {
      console.log(`✅ Route format correct: ${route}`);
    } else {
      console.log(`❌ Route format incorrect: ${route}`);
    }
  });
}

// Main test function
function runRoutingTests() {
  console.log('🚀 Starting Routing Tests...');
  console.log('================================');
  
  testNavigation();
  console.log('');
  
  testRouteAccessibility();
  console.log('');
  
  testDashboardClicks();
  console.log('');
  
  console.log('✅ Routing Tests Complete!');
  console.log('================================');
}

// Auto-run tests after 2 seconds
setTimeout(runRoutingTests, 2000);

// Make test functions available globally
window.routingTests = {
  runRoutingTests,
  testNavigation,
  testDashboardClicks,
  testRouteAccessibility
};

console.log('Routing test functions available at window.routingTests');
console.log('Run window.routingTests.runRoutingTests() to test routing');