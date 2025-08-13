// Service Worker for caching and offline support
const CACHE_NAME = 'eeu-complaint-management-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const API_CACHE = 'api-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html', // Create this file for offline fallback
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/dashboard',
  '/api/complaints',
  '/api/users',
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/') || url.hostname.includes('script.google.com')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static files
  if (STATIC_FILES.some(file => url.pathname === file || url.pathname.endsWith(file))) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Handle other requests (CSS, JS, images)
  event.respondWith(handleDynamicRequest(request));
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache for API request');
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Offline - data not available',
        offline: true
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Service Worker: Failed to serve static file', request.url);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/offline.html');
      return offlineResponse || new Response('Offline', { status: 503 });
    }
    
    return new Response('Resource not available offline', { status: 503 });
  }
}

// Handle dynamic requests with stale-while-revalidate strategy
async function handleDynamicRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Serve from cache immediately if available
    if (cachedResponse) {
      // Update cache in background
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
        })
        .catch(() => {
          // Ignore network errors for background updates
        });
      
      return cachedResponse;
    }
    
    // No cache, try network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Service Worker: Failed to serve dynamic request', request.url);
    return new Response('Resource not available', { status: 503 });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'complaint-sync') {
    event.waitUntil(syncComplaints());
  }
  
  if (event.tag === 'user-sync') {
    event.waitUntil(syncUsers());
  }
});

// Sync complaints when back online
async function syncComplaints() {
  try {
    console.log('Service Worker: Syncing complaints...');
    
    // Get pending complaints from IndexedDB or localStorage
    const pendingComplaints = await getPendingComplaints();
    
    for (const complaint of pendingComplaints) {
      try {
        const response = await fetch('/api/complaints', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(complaint)
        });
        
        if (response.ok) {
          await removePendingComplaint(complaint.id);
          console.log('Service Worker: Complaint synced successfully', complaint.id);
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync complaint', complaint.id, error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Sync users when back online
async function syncUsers() {
  try {
    console.log('Service Worker: Syncing users...');
    // Similar implementation for user sync
  } catch (error) {
    console.error('Service Worker: User sync failed', error);
  }
}

// Helper functions for offline storage
async function getPendingComplaints() {
  // Implementation would use IndexedDB or localStorage
  return [];
}

async function removePendingComplaint(id) {
  // Implementation would remove from IndexedDB or localStorage
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icon-explore.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('EEU Complaint Management', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => cache.addAll(event.data.urls))
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('Service Worker: Periodic sync triggered', event.tag);
  
  if (event.tag === 'dashboard-update') {
    event.waitUntil(updateDashboardCache());
  }
});

async function updateDashboardCache() {
  try {
    const response = await fetch('/api/dashboard');
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put('/api/dashboard', response);
      console.log('Service Worker: Dashboard cache updated');
    }
  } catch (error) {
    console.error('Service Worker: Failed to update dashboard cache', error);
  }
}