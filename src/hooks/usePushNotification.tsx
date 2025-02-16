interface PushNotificationProps {
  setIsPwaAlarmOpen: (v: boolean, type?: string) => void;
}

export const usePushNotification = ({
  setIsPwaAlarmOpen,
}: PushNotificationProps) => {
  const isPWA = () => window.matchMedia('(display-mode: standalone)').matches;

  const denyPermission = () => {
    setIsPwaAlarmOpen(false);
  };

  const askPushNotification = () => {
    const visited = localStorage.getItem('isVisited');
    if (isPWA() && !visited) {
      setIsPwaAlarmOpen(true, 'default');
    }
  };

  const checkNotificationPermission = async () => {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();

      if (permission) {
        setIsPwaAlarmOpen(false);
      } else {
        setIsPwaAlarmOpen(true, 'unsupported');
      }
    }
    localStorage.setItem('isVisited', 'true');
  };

  return {
    denyPermission,
    askPushNotification,
    checkNotificationPermission,
  };
};
