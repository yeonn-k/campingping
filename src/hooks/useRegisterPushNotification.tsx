import { useEffect } from 'react';
import { api } from '@utils/axios';
import { userStore } from '@/stores/userState';

const useRegisterPushNotification = async () => {
  const { userState } = userStore();
  if (!userState) return;

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

      const existingSubscription =
        await registration.pushManager.getSubscription();
      if (existingSubscription) return;

      try {
        const res = await api.post('/user/subscribe', {
          endpoint: pushSubscription.endpoint,
          expirationTime: pushSubscription.expirationTime,
          keys: {
            p256dh: arrayBufferToBase64(pushSubscription.getKey('p256dh')),
            auth: arrayBufferToBase64(pushSubscription.getKey('auth')),
          },
        });
        if (res.status === 201) {
          console.log(
            'subscriptionData 전송 성공!',
            'subscriptionData: ',
            'endpoint: ',
            pushSubscription.endpoint,
            'expirationTime:',
            pushSubscription.expirationTime,
            'keys:',
            {
              p256dh: arrayBufferToBase64(pushSubscription.getKey('p256dh')),
              auth: arrayBufferToBase64(pushSubscription.getKey('auth')),
            }
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};

const arrayBufferToBase64 = (buffer: ArrayBuffer | null): string => {
  if (!buffer) {
    throw new Error('ArrayBuffer is null or undefined');
  }
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

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

export default useRegisterPushNotification;
