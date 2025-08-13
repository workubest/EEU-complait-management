// Service Worker registration and management utilities

interface ServiceWorkerConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private isUpdateAvailable = false;

  async register(config: ServiceWorkerConfig = {}): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('Service Worker registration skipped in development');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      this.registration = registration;

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New update available
              this.isUpdateAvailable = true;
              config.onUpdate?.(registration);
              this.showUpdateNotification();
            } else {
              // First time installation
              config.onSuccess?.(registration);
              console.log('Service Worker installed successfully');
            }
          }
        });
      });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      config.onError?.(error as Error);
    }
  }

  private showUpdateNotification(): void {
    // Create update notification
    const notification = document.createElement('div');
    notification.id = 'sw-update-notification';
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1f2937;
        color: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 300px;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="margin-bottom: 12px; font-weight: 600;">
          🔄 Update Available
        </div>
        <div style="margin-bottom: 12px; font-size: 14px; opacity: 0.9;">
          A new version of the app is available. Refresh to get the latest features.
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="sw-update-btn" style="
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          ">
            Update Now
          </button>
          <button id="sw-dismiss-btn" style="
            background: transparent;
            color: #9ca3af;
            border: 1px solid #374151;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          ">
            Later
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Handle update button click
    document.getElementById('sw-update-btn')?.addEventListener('click', () => {
      this.skipWaiting();
      notification.remove();
    });

    // Handle dismiss button click
    document.getElementById('sw-dismiss-btn')?.addEventListener('click', () => {
      notification.remove();
    });

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (document.getElementById('sw-update-notification')) {
        notification.remove();
      }
    }, 10000);
  }

  skipWaiting(): void {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  async unregister(): Promise<boolean> {
    if (this.registration) {
      return await this.registration.unregister();
    }
    return false;
  }

  // Cache management
  async clearCaches(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
    }
  }

  // Background sync registration
  async registerBackgroundSync(tag: string): Promise<void> {
    if (this.registration && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        await this.registration.sync.register(tag);
        console.log(`Background sync registered: ${tag}`);
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
  }

  // Push notification subscription
  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!this.registration || !('PushManager' in window)) {
      console.log('Push notifications not supported');
      return null;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Push notification permission denied');
        return null;
      }

      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.VITE_VAPID_PUBLIC_KEY || ''
        )
      });

      console.log('Push notification subscription created');
      return subscription;
    } catch (error) {
      console.error('Push notification subscription failed:', error);
      return null;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Periodic background sync (if supported)
  async registerPeriodicSync(tag: string, minInterval: number): Promise<void> {
    if (this.registration && 'periodicSync' in this.registration) {
      try {
        await (this.registration as any).periodicSync.register(tag, {
          minInterval
        });
        console.log(`Periodic sync registered: ${tag}`);
      } catch (error) {
        console.error('Periodic sync registration failed:', error);
      }
    }
  }

  // Get registration status
  getStatus(): {
    isRegistered: boolean;
    isUpdateAvailable: boolean;
    isControlling: boolean;
  } {
    return {
      isRegistered: !!this.registration,
      isUpdateAvailable: this.isUpdateAvailable,
      isControlling: !!navigator.serviceWorker.controller
    };
  }

  // Send message to service worker
  sendMessage(message: any): void {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(message);
    }
  }

  // Preload critical resources
  preloadResources(urls: string[]): void {
    this.sendMessage({
      type: 'CACHE_URLS',
      urls
    });
  }
}

// Singleton instance
export const serviceWorkerManager = new ServiceWorkerManager();

// React hook for service worker
export function useServiceWorker(config: ServiceWorkerConfig = {}) {
  const [status, setStatus] = useState(serviceWorkerManager.getStatus());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Register service worker
    serviceWorkerManager.register({
      ...config,
      onUpdate: (registration) => {
        setStatus(serviceWorkerManager.getStatus());
        config.onUpdate?.(registration);
      },
      onSuccess: (registration) => {
        setStatus(serviceWorkerManager.getStatus());
        config.onSuccess?.(registration);
      }
    });

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    ...status,
    isOnline,
    skipWaiting: serviceWorkerManager.skipWaiting.bind(serviceWorkerManager),
    unregister: serviceWorkerManager.unregister.bind(serviceWorkerManager),
    clearCaches: serviceWorkerManager.clearCaches.bind(serviceWorkerManager),
    registerBackgroundSync: serviceWorkerManager.registerBackgroundSync.bind(serviceWorkerManager),
    subscribeToPushNotifications: serviceWorkerManager.subscribeToPushNotifications.bind(serviceWorkerManager),
    sendMessage: serviceWorkerManager.sendMessage.bind(serviceWorkerManager),
    preloadResources: serviceWorkerManager.preloadResources.bind(serviceWorkerManager)
  };
}

// Import React hooks
import { useState, useEffect } from 'react';