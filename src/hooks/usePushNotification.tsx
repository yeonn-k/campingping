import { usePwaStore } from '@/stores/pwaState';
import { userStore } from '@/stores/userState';
import { isPwa } from '@/utils/isPwa';

export const usePushNotification = () => {
  const { isVisited } = userStore();
  const { setIsPwaOpen, setClicked } = usePwaStore();
  const denyPermission = () => {
    setIsPwaOpen(false);
  };

  const askPushNotification = async () => {
    setClicked('noti');

    if (isPwa() && !isVisited) {
      setIsPwaOpen(true, 'noti-default');
    }
  };

  const checkNotificationPermission = async () => {
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
  };

  return {
    denyPermission,
    askPushNotification,
    checkNotificationPermission,
  };
};
