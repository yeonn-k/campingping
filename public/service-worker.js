self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

self.addEventListener('push', (event) => {
  const options = {
    title: event.data.title,
    body: event.data.body,
    icon: './images/maskable_icon_x192.png',
  };

  const roomId = event.data.roomId;

  event.waitUntil(
    self.registration.showNotification(options).then(() => {
      event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: 'NOTIFICATION_CLICKED', roomId });
          });
        })
      );
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
});
