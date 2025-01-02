'use client';
import { useEffect, useRef, useState } from 'react';
import { MapListWrap } from './component/MapListWrap';
import { useLocationStore } from '@/stores/locationState';

const Map = () => {
  const { lat, lon, updateLocation } = useLocationStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const [kakaoMap, setKakaoMap] = useState<unknown | null>(null);

  useEffect(() => {
    updateLocation();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    window.kakao?.maps.load(() => {
      const options = {
        center: new window.kakao.maps.LatLng(lat, lon),
        level: 3,
      };

      setKakaoMap(new window.kakao.maps.Map(mapRef.current, options));
    });
  }, [lat, lon]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full">
        <MapListWrap />
      </div>
    </div>
  );
};

export default Map;
