const CACHE_NAME = 'valorantguides-v2' // Updated to clear login page cache
const urlsToCache = [
  '/',
  // '/auth/login', // Removed from cache - causes loop issues with OAuth
  '/manifest.webmanifest'
]

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event
self.addEventListener('fetch', event => {
  // Skip service worker for admin routes and API calls
  const url = new URL(event.request.url)
  
  if (url.pathname.startsWith('/admin') || 
      url.pathname.startsWith('/api') ||
      url.hostname === 'localhost' && url.port === '8000') {
    return; // Let browser handle these requests directly
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response
        }
        return fetch(event.request)
      }
    )
  )
})

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from ValorantGuides',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('ValorantGuides', options)
  )
})

// Notification click
self.addEventListener('notificationclick', event => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  } else if (event.action === 'close') {
    event.notification.close()
  } else {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Background sync
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

function doBackgroundSync() {
  // Perform background synchronization
  console.log('Background sync triggered')
  return Promise.resolve()
}
