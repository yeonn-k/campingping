import { useEffect, useState } from 'react';

const useGeoLocationPermission = () => {
  const [isGeoLocationGranted, setIsGeoLocationGranted] = useState(true);

  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      setIsGeoLocationGranted(result.state === 'granted');
    });
  }, []);

  return isGeoLocationGranted;
};

export default useGeoLocationPermission;
