// Utility to initialize Google Sheets backend with seed data
import { apiService } from '@/lib/api';
import { seedData } from '@/data/seedData';

export async function initializeBackend(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🚀 Initializing Google Sheets backend...');
    
    // Call the initialization endpoint
    const result = await apiService.initializeSheets();
    
    if (result.success) {
      console.log('✅ Backend initialization successful');
      return {
        success: true,
        message: 'Google Sheets backend initialized successfully with seed data'
      };
    } else {
      console.error('❌ Backend initialization failed:', result.error);
      return {
        success: false,
        message: result.error || 'Failed to initialize backend'
      };
    }
  } catch (error) {
    console.error('❌ Backend initialization error:', error);
    return {
      success: false,
      message: 'Network error during backend initialization'
    };
  }
}

// Function to check if backend is properly initialized
export async function checkBackendHealth(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🔍 Checking backend health...');
    
    const result = await apiService.healthCheck();
    
    if (result.success) {
      console.log('✅ Backend health check passed');
      return {
        success: true,
        message: 'Backend is healthy and ready'
      };
    } else {
      console.error('❌ Backend health check failed:', result.error);
      return {
        success: false,
        message: result.error || 'Backend health check failed'
      };
    }
  } catch (error) {
    console.error('❌ Backend health check error:', error);
    return {
      success: false,
      message: 'Network error during health check'
    };
  }
}

// Function to verify all required sheets exist and have data
export async function verifyBackendSetup(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    console.log('🔍 Verifying backend setup...');
    
    // Check multiple endpoints to ensure all sheets are working
    const checks = await Promise.allSettled([
      apiService.getUsers(),
      apiService.getComplaints(),
      apiService.getDashboardStats(),
      apiService.getActivityFeed(),
      apiService.getPerformanceMetrics(),
      apiService.getSettings()
    ]);
    
    const results = checks.map((check, index) => {
      const endpoints = ['users', 'complaints', 'dashboard', 'activity', 'performance', 'settings'];
      return {
        endpoint: endpoints[index],
        success: check.status === 'fulfilled' && check.value.success,
        error: check.status === 'rejected' ? check.reason : 
               (check.status === 'fulfilled' && !check.value.success ? check.value.error : null)
      };
    });
    
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    console.log(`✅ Backend verification: ${successCount}/${totalCount} endpoints working`);
    
    if (successCount === totalCount) {
      return {
        success: true,
        message: 'All backend endpoints are working correctly',
        details: results
      };
    } else {
      return {
        success: false,
        message: `${totalCount - successCount} endpoints are not working properly`,
        details: results
      };
    }
  } catch (error) {
    console.error('❌ Backend verification error:', error);
    return {
      success: false,
      message: 'Error during backend verification'
    };
  }
}

// Function to populate backend with seed data
export async function populateWithSeedData(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🌱 Populating backend with seed data...');
    
    let successCount = 0;
    let totalOperations = 0;
    
    // Create users
    console.log('Creating users...');
    for (const user of seedData.users) {
      try {
        totalOperations++;
        const result = await apiService.createUser(user);
        if (result.success) {
          successCount++;
          console.log(`✅ Created user: ${user.name}`);
        } else {
          console.log(`⚠️ Failed to create user ${user.name}: ${result.error}`);
        }
      } catch (error) {
        console.log(`❌ Error creating user ${user.name}:`, error);
      }
    }
    
    // Create complaints
    console.log('Creating complaints...');
    for (const complaint of seedData.complaints) {
      try {
        totalOperations++;
        const result = await apiService.createComplaint(complaint);
        if (result.success) {
          successCount++;
          console.log(`✅ Created complaint: ${complaint.id}`);
        } else {
          console.log(`⚠️ Failed to create complaint ${complaint.id}: ${result.error}`);
        }
      } catch (error) {
        console.log(`❌ Error creating complaint ${complaint.id}:`, error);
      }
    }
    
    // Create notifications
    console.log('Creating notifications...');
    for (const notification of seedData.notifications) {
      try {
        totalOperations++;
        const result = await apiService.createNotification(notification);
        if (result.success) {
          successCount++;
          console.log(`✅ Created notification: ${notification.id}`);
        } else {
          console.log(`⚠️ Failed to create notification ${notification.id}: ${result.error}`);
        }
      } catch (error) {
        console.log(`❌ Error creating notification ${notification.id}:`, error);
      }
    }
    
    console.log(`📊 Seed data population completed: ${successCount}/${totalOperations} operations successful`);
    
    if (successCount === totalOperations) {
      return {
        success: true,
        message: `All seed data populated successfully (${successCount} items)`
      };
    } else if (successCount > 0) {
      return {
        success: true,
        message: `Seed data partially populated: ${successCount}/${totalOperations} items created`
      };
    } else {
      return {
        success: false,
        message: 'Failed to populate any seed data'
      };
    }
  } catch (error) {
    console.error('❌ Seed data population error:', error);
    return {
      success: false,
      message: 'Error during seed data population'
    };
  }
}

// Complete setup function that initializes and verifies
export async function setupBackend(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🚀 Starting complete backend setup...');
    
    // Step 1: Check current health
    const healthCheck = await checkBackendHealth();
    console.log('Health check result:', healthCheck);
    
    // Step 2: Initialize sheets (this is safe to call multiple times)
    const initResult = await initializeBackend();
    console.log('Initialization result:', initResult);
    
    // Step 3: Populate with seed data
    const seedResult = await populateWithSeedData();
    console.log('Seed data result:', seedResult);
    
    // Step 4: Verify setup
    const verifyResult = await verifyBackendSetup();
    console.log('Verification result:', verifyResult);
    
    if (verifyResult.success) {
      return {
        success: true,
        message: 'Backend setup completed successfully. All systems are operational with seed data.'
      };
    } else {
      return {
        success: false,
        message: `Backend setup completed with issues: ${verifyResult.message}`
      };
    }
  } catch (error) {
    console.error('❌ Complete backend setup error:', error);
    return {
      success: false,
      message: 'Failed to complete backend setup'
    };
  }
}