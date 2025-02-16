self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

self.addEventListener('push', (event) => {
  const data = JSON.parse(event.data.text());

  const options = {
    title: data.title,
    body: data.body,
    icon: './images/maskable_icon_x192.png',
    data: { roomId },
  };

  event.waitUntil(
    self.registration.showNotification(options).then(() => {
      return self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'NOTIFICATION_CLICKED', roomId });
        });
      });
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
});
