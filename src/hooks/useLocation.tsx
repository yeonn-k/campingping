import { useEffect, useState } from 'react';

import { Location } from '@/types/Location';
import { regionCoordinates, CityCoordinates } from 'public/data/region';

const useLocation = (region: string | null, city?: string | null) => {
  const [location, setLocation] = useState<Location>();

  useEffect(() => {
    if (region && city && CityCoordinates[region][city]) {
      setLocation(CityCoordinates[region][city]);
    } else if (region && regionCoordinates[region]) {
      setLocation(regionCoordinates[region]);
    }
  }, [region, city]);

  return location;
};

export default useLocation;
