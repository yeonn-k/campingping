import { useEffect, useState } from 'react';

const useGeoLocationPermission = () => {
  const [isGeoLocationGranted, setIsGeoLocationGranted] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const checkLocationPermission = () => {
      const localPermission = localStorage.getItem('geoPermission');
      if (localPermission) {
        setIsGeoLocationGranted(JSON.parse(localPermission));
        return;
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => {
            setIsGeoLocationGranted(true);
            localStorage.setItem('geoPermission', 'true');
          },
          () => {
            setIsGeoLocationGranted(false);
            localStorage.setItem('geoPermission', 'false');
          }
        );
      } else {
        setIsGeoLocationGranted(false);
        localStorage.setItem('geoPermission', 'false');
      }
    };

    checkLocationPermission();
  }, []);

  return isGeoLocationGranted;
};

export default useGeoLocationPermission;
