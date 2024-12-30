'use client';
import { useEffect, useRef } from 'react';
import { MapListWrap } from './component/MapListWrap';
import { useLocationStore } from '@/stores/locationState';

const Map = () => {
  const { lat, lon, updateLocation } = useLocationStore();

  useEffect(() => {
    updateLocation();
  }, []);

  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.kakao.maps.load(() => {
      const options = {
        center: new window.kakao.maps.LatLng(lat, lon),
        level: 3,
      };

      const map = new window.kakao.maps.Map(mapRef.current, options);
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
