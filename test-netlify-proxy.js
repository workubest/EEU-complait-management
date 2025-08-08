#!/usr/bin/env node

/**
 * Test script to verify Netlify Function proxy setup
 * This script tests the proxy function locally and in production
 */

const fetch = require('node-fetch');

// Test configuration
const TEST_CONFIG = {
  // Local Netlify Dev server (if running)
  local: 'http://localhost:8888/.netlify/functions/proxy',
  // Production Netlify site (update with your actual URL)
  production: 'https://your-site.netlify.app/.netlify/functions/proxy',
  // Test function endpoint
  testFunction: '/.netlify/functions/test'
};

// Test data
const TEST_LOGIN = {
  action: 'login',
  email: 'admin@eeu.gov.et',
  password: 'admin123'
};

const TEST_DASHBOARD = {
  action: 'getDashboardData',
  role: 'admin',
  region: 'Addis Ababa'
};

/**
 * Test a single endpoint
 */
async function testEndpoint(url, data, description) {
  console.log(`\n🧪 Testing: ${description}`);
  console.log(`📡 URL: ${url}`);
  console.log(`📦 Data:`, JSON.stringify(data, null, 2));
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log(`📋 Headers:`, Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Response:`, JSON.stringify(result, null, 2));
      return { success: true, data: result };
    } else {
      const errorText = await response.text();
      console.log(`❌ Error Response:`, errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.log(`❌ Network Error:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test CORS preflight request
 */
async function testCORS(url) {
  console.log(`\n🔒 Testing CORS preflight for: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });

    console.log(`📊 CORS Status: ${response.status}`);
    console.log(`📋 CORS Headers:`, Object.fromEntries(response.headers.entries()));

    const corsHeaders = {
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
      'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
      'access-control-allow-headers': response.headers.get('access-control-allow-headers')
    };

    if (corsHeaders['access-control-allow-origin']) {
      console.log(`✅ CORS properly configured`);
      return true;
    } else {
      console.log(`❌ CORS headers missing`);
      return false;
    }
  } catch (error) {
    console.log(`❌ CORS Test Error:`, error.message);
    return false;
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🚀 Netlify Function Proxy Test Suite');
  console.log('=====================================');

  const results = {
    cors: false,
    testFunction: false,
    login: false,
    dashboard: false
  };

  // Determine which URL to test
  const testUrl = process.argv[2] || TEST_CONFIG.local;
  console.log(`\n🎯 Testing URL: ${testUrl}`);

  // Test 1: CORS preflight
  results.cors = await testCORS(testUrl);

  // Test 2: Test function (if available)
  if (testUrl.includes('localhost') || testUrl.includes('netlify.app')) {
    const testFunctionUrl = testUrl.replace('/.netlify/functions/proxy', TEST_CONFIG.testFunction);
    const testResult = await testEndpoint(testFunctionUrl, {}, 'Test Function');
    results.testFunction = testResult.success;
  }

  // Test 3: Login endpoint
  const loginResult = await testEndpoint(testUrl, TEST_LOGIN, 'Login Request');
  results.login = loginResult.success;

  // Test 4: Dashboard endpoint
  const dashboardResult = await testEndpoint(testUrl, TEST_DASHBOARD, 'Dashboard Request');
  results.dashboard = dashboardResult.success;

  // Summary
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  console.log(`🔒 CORS: ${results.cors ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🧪 Test Function: ${results.testFunction ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🔐 Login: ${results.login ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📊 Dashboard: ${results.dashboard ? '✅ PASS' : '❌ FAIL'}`);

  const passCount = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passCount}/${totalTests} tests passed`);

  if (passCount === totalTests) {
    console.log('🎉 All tests passed! Netlify proxy is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the configuration and try again.');
  }

  return results;
}

/**
 * Usage instructions
 */
function showUsage() {
  console.log(`
Usage: node test-netlify-proxy.js [URL]

Examples:
  node test-netlify-proxy.js                                    # Test local dev server
  node test-netlify-proxy.js http://localhost:8888/.netlify/functions/proxy
  node test-netlify-proxy.js https://your-site.netlify.app/.netlify/functions/proxy

Available URLs:
  Local:      ${TEST_CONFIG.local}
  Production: ${TEST_CONFIG.production}
`);
}

// Run tests if called directly
if (require.main === module) {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showUsage();
    process.exit(0);
  }

  runTests().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = { runTests, testEndpoint, testCORS };