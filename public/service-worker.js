self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

self.addEventListener('push', (event) => {
  const data = JSON.parse(event.data.text());

  const title = data.title;
  const options = {
    body: data.body,
    icon: './images/maskable_icon_x192.png',
    badge: 'images/maskable_icon_x128.png',
    data: { roomId: data.roomId },
  };

  event.waitUntil(
    self.registration.showNotification(title, options).then(() => {
      return self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'NOTIFICATION_RECEIVED', data: data });
        });
      });
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const roomId = event.notification.data.roomId;

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'NOTIFICATION_CLICKED', roomId: roomId });
      });
    })
  );
});
