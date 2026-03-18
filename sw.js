const CACHE_NAME = 'karate360-v1';

// Install - cache shell
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

// Fetch - network first, fallback cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// Push notification received
self.addEventListener('push', (e) => {
  let data = { title: 'Fondamenti del Karate', body: 'Nuova prenotazione ricevuta!' };
  if (e.data) {
    try { data = e.data.json(); } catch (err) { data.body = e.data.text(); }
  }
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'karate360-booking',
      renotify: true,
      data: { url: 'dashboard.html' }
    })
  );
});

// Click on notification -> open dashboard
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('dashboard') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('dashboard.html');
      }
    })
  );
});
