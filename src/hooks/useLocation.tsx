import { use, useEffect, useState } from 'react';

interface Location {
  regionLat: number;
  regionLon: number;
}

const regionCoordinates: { [key: string]: Location } = {
  서울시: { regionLat: 37.5665, regionLon: 126.978 },
  부산시: { regionLat: 35.1796, regionLon: 129.0756 },
  대구시: { regionLat: 35.8714, regionLon: 128.6014 },
  인천시: { regionLat: 37.4563, regionLon: 126.7052 },
  광주시: { regionLat: 35.1595, regionLon: 126.8526 },
  대전시: { regionLat: 36.3504, regionLon: 127.3845 },
  울산시: { regionLat: 35.5384, regionLon: 129.3114 },
  세종시: { regionLat: 36.48, regionLon: 127.289 },
  경기도: { regionLat: 37.4138, regionLon: 127.5183 },
  강원도: { regionLat: 37.8228, regionLon: 128.1555 },
  충청북도: { regionLat: 36.6357, regionLon: 127.4917 },
  충청남도: { regionLat: 36.5184, regionLon: 126.8 },
  전라북도: { regionLat: 35.82, regionLon: 127.1088 },
  전라남도: { regionLat: 34.8679, regionLon: 126.991 },
  경상북도: { regionLat: 36.4919, regionLon: 128.8889 },
  경상남도: { regionLat: 35.4606, regionLon: 128.2132 },
  제주도: { regionLat: 33.4996, regionLon: 126.5312 },
};
const useLocation = (region: string | null) => {
  const [location, setLocation] = useState<Location>();

  useEffect(() => {
    if (region && regionCoordinates[region]) {
      setLocation(regionCoordinates[region]);
    }
  }, [region]);

  return location;
};

export default useLocation;
