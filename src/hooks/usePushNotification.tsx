import { useEffect, useState } from 'react';

interface PushNotificationProps {
  setIsPwaAlarmOpen: (v: boolean, type?: string) => void;
}

export const usePushNotification = ({
  setIsPwaAlarmOpen,
}: PushNotificationProps) => {
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  const isPWA = () => window.matchMedia('(display-mode: standalone)').matches;

  const getPermission = async () => {
    await Notification.requestPermission();

    setIsPwaAlarmOpen(false);
  };

  const denyPermission = () => {
    setIsPwaAlarmOpen(false);
  };

  const askPushNotification = async () => {
    if (Notification.permission === 'default') {
      setIsPwaAlarmOpen(true);
    }
  };

  useEffect(() => {
    const visited = localStorage.getItem('isFirstVisited');
    if (isPWA() && !visited) {
      askPushNotification();
    }
  }, [isFirstVisit]);

  return { getPermission, denyPermission, askPushNotification };
};
