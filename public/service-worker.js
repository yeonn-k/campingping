self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(), // 푸시 알림 내용
    icon: './images/maskable_icon_x192.png', // 표시할 아이콘
    tag: 'pwa-notification',
  };

  event.waitUntil(self.registration.showNotification(options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'NOTIFICATION_CLICKED' });
      });
      return clients.openWindow('https://campingping.com');
    })
  );
});
