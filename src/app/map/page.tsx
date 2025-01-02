'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MapListWrap } from './component/MapListWrap';
import { useLocationStore } from '@/stores/locationState';
import { api } from '@/utils/axios';

import { CampMap } from '@/types/CampMap';

import useLocation from '@/hooks/useLocation';
import Category from '@/components/Category/Category';
import Weather from '@/components/Weather/Weather';
import useCategory from '@/hooks/useCategory';

const Map = () => {
  const limit = 10;
  const [offset, setOffset] = useState(0);

  const { handleCategorySelected, selectedCategory } = useCategory();

  const { userLat, userLon, updateLocation } = useLocationStore();
  const [lat, setLat] = useState<number | null>(userLat);
  const [lon, setLon] = useState<number | null>(userLon);

  const mapRef = useRef<HTMLDivElement>(null);
  const [kakaoMap, setKakaoMap] = useState<unknown | null>(null);

  const [campList, setCampList] = useState<CampMap[]>([]);

  const region =
    typeof window !== 'undefined' ? sessionStorage.getItem('region') : null;
  const location = useLocation(region);

  useEffect(() => {
    updateLocation();
  }, []);

  const getNearByCampings = async () => {
    try {
      const res = await api.get(
        `/campings/map?lat=${userLat}&lon=${userLon}&category=${selectedCategory}&limit=${limit}&offset=${offset}`
      );
      // setCampList((prev) => [...prev, ...res.data.data]);
      setCampList(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getCampingsByDoNm = async () => {
    try {
      const res = await api.get(
        `campings/lists?region=${region}&category=${selectedCategory}&limit=${limit}&cursor=${offset}`
      );
      // setCampList((prev) => [...prev, ...res.data.data.result]);
      setCampList(res.data.data.result);

      // sessionStorage.clear();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    if (lat !== null && lon !== null) {
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

      if (region) {
        getCampingsByDoNm();
      } else {
        getNearByCampings();
      }
    }
  }, [lat, lon, region, offset, selectedCategory]);

  useEffect(() => {
    if (region && location) {
      setLat(location.regionLat);
      setLon(location.regionLon);
    } else if (userLat && userLon) {
      setLat(userLat);
      setLon(userLon);
    }
  }, [region, location, userLat, userLon]);

  return (
    <>
      {region && (
        <Category
          selectedCategory={selectedCategory}
          onCategorySelected={handleCategorySelected}
        />
      )}

      <Weather />
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
    </>
  );
};

export default Map;
