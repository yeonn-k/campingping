import { useEffect } from 'react';
import { api } from '@utils/axios';

export default function usePushNotification() {
  useEffect(() => {
    const registerPushNotification = async () => {
      if ('Notification' in window && 'serviceWorker' in navigator) {
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
          const registration = await navigator.serviceWorker.ready;
          const pushSubscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(
              process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
            ),
          });

          try {
            const res = await api.post('/user/subscribe', { pushSubscription });
          } catch (error) {
            console.error(error);
          }
        }
      }
    };

    registerPushNotification();
  }, []);
}

const urlB64ToUint8Array = (base64String: string | undefined): Uint8Array => {
  if (!base64String) {
    throw new Error('Base64 string is required');
  }

  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};
