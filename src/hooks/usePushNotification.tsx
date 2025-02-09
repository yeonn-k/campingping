import { useEffect } from 'react';

interface PushNotificationProps {
  setIsPwaAlarmOpen: (v: boolean) => void;
}

export const usePushNotification = ({
  setIsPwaAlarmOpen,
}: PushNotificationProps) => {
  const isPWA = () => window.matchMedia('(display-mode: standalone)').matches;

  const getPermission = async () => {
    await Notification.requestPermission();

    setIsPwaAlarmOpen(false);
  };

  const denyPermission = () => {
    setIsPwaAlarmOpen(false);
  };

  const askPushNotification = () => {
    const askNotificationPermission = async () => {
      if (!isPWA()) {
        return;
      }

      if (Notification.permission === 'default') {
        setIsPwaAlarmOpen(true);
      }
    };

    askNotificationPermission();
  };

  useEffect(() => {
    askPushNotification();
  }, []);

  return { getPermission, denyPermission, askPushNotification };
};
