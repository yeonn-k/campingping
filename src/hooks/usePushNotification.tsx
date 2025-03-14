import { usePwaStore } from '@/stores/pwaState';
import { userStore } from '@/stores/userState';
import { isPwa } from '@/utils/isPwa';
import { useCallback } from 'react';

export const usePushNotification = () => {
  const { isVisited } = userStore();
  const { setIsPwaOpen, setClicked } = usePwaStore();
  const denyPermission = () => {
    setIsPwaOpen(false);
  };

  const askPushNotification = useCallback(async () => {
    setClicked('noti');

    if (isPwa() && !isVisited) {
      setIsPwaOpen(true, 'noti-default');
    }
  }, [isVisited]);

  const checkNotificationPermission = useCallback(async () => {
    setClicked('noti');

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        setIsPwaOpen(false);
      }
    } else {
      setIsPwaOpen(false);
      setIsPwaOpen(true, 'noti-unsupported');
    }
  }, [isVisited]);

  return {
    denyPermission,
    askPushNotification,
    checkNotificationPermission,
  };
};
