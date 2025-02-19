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
    data: data.roomId,
  };

  event.waitUntil(
    self.registration.showNotification(title, options).then(() => {
      return self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'NOTIFICATION_CLICKED', data });
        });
      });
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const roomId = event.notification.data;

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      const client = clients.find((client) =>
        client.url.includes('campingping.com/list')
      );

      if (client) {
        client.postMessage({ type: 'OPEN_CHAT_MODAL', roomId });
        client.focus();
      } else {
        self.clients.openWindow(`/list`).then((newClient) => {
          if (newClient)
            newClient.postMessage({ type: 'OPEN_CHAT_MODAL', roomId });
        });
      }
    })
  );
});
