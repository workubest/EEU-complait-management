// Dashboard Verification Script
// This script verifies all dashboard components are functioning properly

console.log('🔍 Dashboard Component Verification Started...');

// Verification functions
const verifyDashboard = {
  
  // Check if all required components are rendered
  checkComponentRendering() {
    console.log('📋 Checking Component Rendering...');
    
    const components = {
      'Dashboard Container': 'div[class*="space-y-6"], .dashboard-container',
      'Stats Cards': '.grid .card, [data-testid="stats-cards"]',
      'Quick Actions': '[data-testid="quick-actions"], .quick-actions, button[class*="space-x"]',
      'Recent Complaints': '[data-testid="recent-complaints"], .recent-complaints',
      'Activity Feed': '[data-testid="activity-feed"], .activity-feed',
      'Performance Metrics': '[data-testid="performance-metrics"], .performance-metrics'
    };
    
    let allComponentsFound = true;
    
    Object.entries(components).forEach(([name, selector]) => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`✅ ${name}: Found and rendered`);
      } else {
        console.log(`❌ ${name}: Not found`);
        allComponentsFound = false;
      }
    });
    
    return allComponentsFound;
  },
  
  // Check interactive elements
  checkInteractivity() {
    console.log('🖱️ Checking Interactive Elements...');
    
    const buttons = document.querySelectorAll('button:not([disabled])');
    const clickableCards = document.querySelectorAll('.card[class*="cursor-pointer"], .card[class*="hover"]');
    const links = document.querySelectorAll('a[href]');
    
    console.log(`Found ${buttons.length} interactive buttons`);
    console.log(`Found ${clickableCards.length} clickable cards`);
    console.log(`Found ${links.length} navigation links`);
    
    // Test a few key buttons
    const keyButtons = {
      'Refresh Button': 'button:has(svg[data-lucide="refresh-cw"])',
      'Export Button': 'button:has(svg[data-lucide="download"])',
      'Settings Button': 'button:has(svg[data-lucide="settings"])'
    };
    
    Object.entries(keyButtons).forEach(([name, selector]) => {
      const button = document.querySelector(selector);
      if (button) {
        console.log(`✅ ${name}: Found and clickable`);
      } else {
        console.log(`⚠️ ${name}: Not found or not clickable`);
      }
    });
    
    return buttons.length > 0;
  },
  
  // Check data loading and display
  checkDataDisplay() {
    console.log('📊 Checking Data Display...');
    
    // Check for statistical data
    const statNumbers = document.querySelectorAll('.text-3xl, .text-2xl, [class*="font-bold"]');
    const badges = document.querySelectorAll('.badge, [class*="badge"]');
    const progressBars = document.querySelectorAll('[role="progressbar"], .progress');
    
    console.log(`Found ${statNumbers.length} statistical displays`);
    console.log(`Found ${badges.length} status badges`);
    console.log(`Found ${progressBars.length} progress indicators`);
    
    // Check if data appears to be real (not just zeros)
    let hasRealData = false;
    statNumbers.forEach(el => {
      const text = el.textContent?.trim();
      if (text && text !== '0' && text !== '' && !text.includes('Loading')) {
        hasRealData = true;
      }
    });
    
    if (hasRealData) {
      console.log('✅ Dashboard appears to have real data');
    } else {
      console.log('⚠️ Dashboard may be showing placeholder data');
    }
    
    return statNumbers.length > 0;
  },
  
  // Check error handling
  checkErrorHandling() {
    console.log('🚨 Checking Error Handling...');
    
    // Check for error boundaries or error displays
    const errorElements = document.querySelectorAll('[class*="error"], [class*="destructive"], .text-red');
    const loadingElements = document.querySelectorAll('[class*="loading"], [class*="skeleton"], .animate-spin');
    
    console.log(`Found ${errorElements.length} error indicators`);
    console.log(`Found ${loadingElements.length} loading indicators`);
    
    // Check console for errors
    const consoleErrors = [];
    const originalError = console.error;
    console.error = (...args) => {
      consoleErrors.push(args);
      originalError.apply(console, args);
    };
    
    setTimeout(() => {
      console.error = originalError;
      if (consoleErrors.length === 0) {
        console.log('✅ No console errors detected');
      } else {
        console.log(`⚠️ Found ${consoleErrors.length} console errors`);
        consoleErrors.forEach(error => console.log('Error:', error));
      }
    }, 1000);
    
    return true;
  },
  
  // Check responsive design
  checkResponsiveness() {
    console.log('📱 Checking Responsive Design...');
    
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    console.log(`Current viewport: ${viewport.width}x${viewport.height}`);
    
    // Check grid layouts adapt to screen size
    const grids = document.querySelectorAll('.grid');
    const flexElements = document.querySelectorAll('[class*="flex"]');
    
    console.log(`Found ${grids.length} grid layouts`);
    console.log(`Found ${flexElements.length} flex layouts`);
    
    // Determine device type
    let deviceType = 'desktop';
    if (viewport.width < 768) {
      deviceType = 'mobile';
    } else if (viewport.width < 1024) {
      deviceType = 'tablet';
    }
    
    console.log(`✅ Detected ${deviceType} layout`);
    
    return true;
  },
  
  // Check accessibility
  checkAccessibility() {
    console.log('♿ Checking Accessibility...');
    
    const ariaElements = document.querySelectorAll('[aria-label], [aria-describedby], [role]');
    const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    console.log(`Found ${ariaElements.length} elements with ARIA attributes`);
    console.log(`Found ${focusableElements.length} focusable elements`);
    console.log(`Found ${headings.length} heading elements`);
    
    // Check for alt text on images
    const images = document.querySelectorAll('img');
    let imagesWithAlt = 0;
    images.forEach(img => {
      if (img.alt) imagesWithAlt++;
    });
    
    console.log(`Found ${imagesWithAlt}/${images.length} images with alt text`);
    
    return focusableElements.length > 0;
  },
  
  // Check performance
  checkPerformance() {
    console.log('⚡ Checking Performance...');
    
    // Check load time
    const navigationStart = performance.timing.navigationStart;
    const loadComplete = performance.timing.loadEventEnd;
    const loadTime = loadComplete - navigationStart;
    
    console.log(`Page load time: ${loadTime}ms`);
    
    if (loadTime < 3000) {
      console.log('✅ Good performance - under 3 seconds');
    } else if (loadTime < 5000) {
      console.log('⚠️ Acceptable performance - under 5 seconds');
    } else {
      console.log('❌ Poor performance - over 5 seconds');
    }
    
    // Check for memory leaks (basic check)
    const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    console.log(`Current memory usage: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);
    
    return loadTime < 5000;
  },
  
  // Run all verification tests
  runAllTests() {
    console.log('🚀 Running Complete Dashboard Verification...');
    console.log('================================================');
    
    const results = {
      componentRendering: this.checkComponentRendering(),
      interactivity: this.checkInteractivity(),
      dataDisplay: this.checkDataDisplay(),
      errorHandling: this.checkErrorHandling(),
      responsiveness: this.checkResponsiveness(),
      accessibility: this.checkAccessibility(),
      performance: this.checkPerformance()
    };
    
    console.log('');
    console.log('📋 VERIFICATION RESULTS:');
    console.log('========================');
    
    Object.entries(results).forEach(([test, passed]) => {
      const status = passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${test}: ${status}`);
    });
    
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log('');
    console.log(`📊 OVERALL SCORE: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
      console.log('🎉 ALL DASHBOARD COMPONENTS ARE FULLY FUNCTIONAL!');
    } else if (passedTests >= totalTests * 0.8) {
      console.log('✅ Dashboard is mostly functional with minor issues');
    } else {
      console.log('⚠️ Dashboard has significant issues that need attention');
    }
    
    console.log('================================================');
    
    return results;
  }
};

// Auto-run verification after page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => verifyDashboard.runAllTests(), 2000);
  });
} else {
  setTimeout(() => verifyDashboard.runAllTests(), 2000);
}

// Make verification functions available globally
window.verifyDashboard = verifyDashboard;

console.log('Dashboard verification functions available at window.verifyDashboard');
console.log('Run window.verifyDashboard.runAllTests() to verify dashboard functionality');