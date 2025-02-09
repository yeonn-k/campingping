self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const { title, body } = data;

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: '/icon.png',
      badge: '/badge.png',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  const url = '/chat'; // 알림 클릭 시 이동할 URL
  event.waitUntil(clients.openWindow(url));
  event.notification.close();
});
