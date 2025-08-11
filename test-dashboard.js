// Dashboard Component Testing Script
// Run this in browser console to test all dashboard features

console.log('🧪 Starting Dashboard Component Tests...');

// Test 1: Check if all dashboard components are rendered
function testComponentRendering() {
  console.log('📋 Testing Component Rendering...');
  
  const components = [
    { name: 'StatsCards', selector: '[data-testid="stats-cards"], .grid .card' },
    { name: 'QuickActions', selector: '[data-testid="quick-actions"], .quick-actions' },
    { name: 'RecentComplaints', selector: '[data-testid="recent-complaints"], .recent-complaints' },
    { name: 'ActivityFeed', selector: '[data-testid="activity-feed"], .activity-feed' },
    { name: 'PerformanceMetrics', selector: '[data-testid="performance-metrics"], .performance-metrics' }
  ];
  
  components.forEach(component => {
    const element = document.querySelector(component.selector);
    if (element) {
      console.log(`✅ ${component.name} component found and rendered`);
    } else {
      console.log(`❌ ${component.name} component not found`);
    }
  });
}

// Test 2: Check interactive elements
function testInteractiveElements() {
  console.log('🖱️ Testing Interactive Elements...');
  
  // Test buttons
  const buttons = document.querySelectorAll('button');
  console.log(`Found ${buttons.length} interactive buttons`);
  
  // Test cards (should be clickable)
  const cards = document.querySelectorAll('.card');
  console.log(`Found ${cards.length} cards`);
  
  // Test refresh button
  const refreshBtn = document.querySelector('button[aria-label*="refresh"], button:has(svg[data-lucide="refresh-cw"])');
  if (refreshBtn) {
    console.log('✅ Refresh button found');
  }
  
  // Test export button
  const exportBtn = document.querySelector('button:has(svg[data-lucide="download"])');
  if (exportBtn) {
    console.log('✅ Export button found');
  }
}

// Test 3: Check data loading states
function testDataLoading() {
  console.log('📊 Testing Data Loading...');
  
  // Check for loading indicators
  const loadingElements = document.querySelectorAll('[data-testid*="loading"], .animate-spin, .skeleton');
  console.log(`Found ${loadingElements.length} loading indicators`);
  
  // Check for error states
  const errorElements = document.querySelectorAll('[data-testid*="error"], .text-destructive');
  console.log(`Found ${errorElements.length} error indicators`);
  
  // Check for data content
  const dataElements = document.querySelectorAll('.text-3xl, .font-bold, .badge');
  console.log(`Found ${dataElements.length} data display elements`);
}

// Test 4: Check responsive behavior
function testResponsiveness() {
  console.log('📱 Testing Responsive Behavior...');
  
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  console.log(`Current viewport: ${viewport.width}x${viewport.height}`);
  
  if (viewport.width < 768) {
    console.log('📱 Mobile view detected');
  } else if (viewport.width < 1024) {
    console.log('📱 Tablet view detected');
  } else {
    console.log('🖥️ Desktop view detected');
  }
  
  // Check grid layouts
  const grids = document.querySelectorAll('.grid');
  console.log(`Found ${grids.length} grid layouts`);
}

// Test 5: Check API integration
function testAPIIntegration() {
  console.log('🌐 Testing API Integration...');
  
  // Check if data is being fetched
  const statsElements = document.querySelectorAll('[data-testid*="stat"], .text-3xl');
  let hasData = false;
  
  statsElements.forEach(el => {
    if (el.textContent && el.textContent.trim() !== '0' && el.textContent.trim() !== '') {
      hasData = true;
    }
  });
  
  if (hasData) {
    console.log('✅ Dashboard appears to have data from API');
  } else {
    console.log('⚠️ Dashboard may be showing placeholder data');
  }
}

// Test 6: Check accessibility features
function testAccessibility() {
  console.log('♿ Testing Accessibility Features...');
  
  // Check for ARIA labels
  const ariaElements = document.querySelectorAll('[aria-label], [aria-describedby], [role]');
  console.log(`Found ${ariaElements.length} elements with accessibility attributes`);
  
  // Check for keyboard navigation
  const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
  console.log(`Found ${focusableElements.length} focusable elements`);
}

// Test 7: Check performance
function testPerformance() {
  console.log('⚡ Testing Performance...');
  
  // Check for animations
  const animatedElements = document.querySelectorAll('[class*="animate"], .transition');
  console.log(`Found ${animatedElements.length} animated elements`);
  
  // Check render time
  const navigationStart = performance.timing.navigationStart;
  const loadComplete = performance.timing.loadEventEnd;
  const loadTime = loadComplete - navigationStart;
  
  console.log(`Page load time: ${loadTime}ms`);
  
  if (loadTime < 3000) {
    console.log('✅ Good performance - under 3 seconds');
  } else {
    console.log('⚠️ Performance could be improved');
  }
}

// Run all tests
function runAllTests() {
  console.log('🚀 Running Complete Dashboard Test Suite...');
  console.log('=====================================');
  
  testComponentRendering();
  console.log('');
  
  testInteractiveElements();
  console.log('');
  
  testDataLoading();
  console.log('');
  
  testResponsiveness();
  console.log('');
  
  testAPIIntegration();
  console.log('');
  
  testAccessibility();
  console.log('');
  
  testPerformance();
  console.log('');
  
  console.log('✅ Dashboard Component Tests Complete!');
  console.log('=====================================');
}

// Auto-run tests after 2 seconds to allow components to load
setTimeout(runAllTests, 2000);

// Export functions for manual testing
window.dashboardTests = {
  runAllTests,
  testComponentRendering,
  testInteractiveElements,
  testDataLoading,
  testResponsiveness,
  testAPIIntegration,
  testAccessibility,
  testPerformance
};

console.log('Dashboard test functions available at window.dashboardTests');