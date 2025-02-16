import { usePwaStore } from '@/stores/pwaState';
import { userStore } from '@/stores/userState';
import { isPwa } from '@/utils/isPwa';

export const usePushNotification = () => {
  const { isVisited } = userStore();
  const { setIsPwaOpen } = usePwaStore();
  const denyPermission = () => {
    setIsPwaOpen(false);
  };

  const askPushNotification = async () => {
    if (isPwa() && !isVisited) {
      setIsPwaOpen(true, 'noti-default');
    }
  };

  const checkNotificationPermission = async () => {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        setIsPwaOpen(false);
      } else {
        setIsPwaOpen(false);
        setIsPwaOpen(true, 'unsupported');
      }
    } else if (Notification.permission === 'denied') {
      setIsPwaOpen(false);
      setIsPwaOpen(true, 'unsupported');
    } else {
      return;
    }
  };

  return {
    denyPermission,
    askPushNotification,
    checkNotificationPermission,
  };
};
