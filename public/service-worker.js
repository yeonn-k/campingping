self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

self.addEventListener('push', (event) => {
  console.log('Push event received', event);
  console.log('Event data:', event.data);

  event.data.json().then((data) => {
    console.log('Parsed JSON:', data);

    const options = {
      title: data.title,
      body: data.body,
      icon: './images/maskable_icon_x192.png',
    };

    const roomId = data.roomId;

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
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
});
