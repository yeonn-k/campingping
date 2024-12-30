'use client';
import { useEffect, useRef } from 'react';
import { MapListWrap } from './component/MapListWrap';

const Map = () => {
  let latitude = 33.450701;
  let longitude = 126.570667;

  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.kakao.maps.load(() => {
      const options = {
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: 3,
      };

      const map = new window.kakao.maps.Map(mapRef.current, options);
    });
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full">
        <MapListWrap />
      </div>
    </div>
  );
};

export default Map;
