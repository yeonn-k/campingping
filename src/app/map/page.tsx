'use client';
import { useEffect, useRef, useState } from 'react';
import { MapListWrap } from './component/MapListWrap';
import { useLocationStore } from '@/stores/locationState';
import { api } from '@/utils/axios';

import { CampMap } from '@/assets/types/CampMap';

const Map = () => {
  const { lat, lon, updateLocation } = useLocationStore();
  const [campList, setCampList] = useState<CampMap[]>([]);

  const mapRef = useRef<HTMLDivElement>(null);
  const [kakaoMap, setKakaoMap] = useState<unknown | null>(null);

  useEffect(() => {
    updateLocation();
  }, []);

  const getNearByCampings = async () => {
    try {
      const res = await api.get(`/campings/map?lat=${lat}&lon=${lon}`);
      setCampList(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (lat && lon) {
      getNearByCampings();
    }

    if (!mapRef.current) return;

    window.kakao?.maps.load(() => {
      const options = {
        center: new window.kakao.maps.LatLng(lat, lon),
        level: 7,
      };

      const map = new window.kakao.maps.Map(mapRef.current, options);
      map.setZoomable(false);
      map.setDraggable(false);

      setKakaoMap(map);
    });
  }, [lat, lon]);

  return (
    <div className="relative w-full h-full">
      {lat && lon ? (
        <div ref={mapRef} className="w-full h-full">
          <MapListWrap campList={campList} />
        </div>
      ) : (
        <div className="h-5/6 flex flex-col justify-center items-center">
          <p>위치를 기반으로 하는 페이지 입니다.</p>
          <p>위치 권한을 확인해주세요</p>
        </div>
      )}
    </div>
  );
};

export default Map;
