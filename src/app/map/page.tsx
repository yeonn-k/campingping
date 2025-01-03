'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MapListWrap } from './component/MapListWrap';
import { useLocationStore } from '@/stores/locationState';
import { api } from '@/utils/axios';

import dynamic from 'next/dynamic';

import { CampMap } from '@/types/CampMap';

import useLocation from '@/hooks/useLocation';
import Category from '@/components/Category/Category';
import Weather from '@/components/Weather/Weather';
import useCategory from '@/hooks/useCategory';

const limit = 10;
let region: string | null;

const Map = () => {
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const NoSSRCategory = dynamic(
    () => import('../../components/Category/Category'),
    { ssr: false }
  );

  const { handleCategorySelected, selectedCategory } = useCategory();

  const { userLat, userLon, updateLocation } = useLocationStore();
  const [lat, setLat] = useState<number | null>(userLat);
  const [lon, setLon] = useState<number | null>(userLon);

  const mapRef = useRef<HTMLDivElement>(null);
  const [kakaoMap, setKakaoMap] = useState<unknown | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [campList, setCampList] = useState<CampMap[]>([]);

  const location = useLocation(region);

  useEffect(() => {
    updateLocation();
    region = sessionStorage.getItem('region') ?? null;
  }, []);

  const getNearByCampings = async () => {
    try {
      const res = await api.get(
        `/campings/map?lat=${userLat}&lon=${userLon}&limit=${limit}&cursor=${offset}`
      );

      setCampList(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getCampingsByDoNm = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await api.get(
        `campings/lists?region=${region}${selectedCategory !== '전체' ? `&category=${selectedCategory}` : ''}&limit=${limit}&cursor=${offset}`
      );
      const data = res.data.data.result;

      if (data.length < limit) {
        setHasMore(false);
      }

      setCampList((prev) => [...prev, ...data]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [offset, isLoading, selectedCategory, region, hasMore]);

  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || !hasMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setOffset((prev) => prev + limit);
            getCampingsByDoNm();
          }
        },
        { threshold: 0.4 }
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoading, hasMore, getCampingsByDoNm]
  );

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
  }, [lat, lon, region, selectedCategory]);

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
        <NoSSRCategory
          selectedCategory={selectedCategory}
          onCategorySelected={handleCategorySelected}
        />
      )}

      <Weather />
      <div className="relative w-full h-full">
        {lat && lon ? (
          <div ref={mapRef} className="w-full h-full">
            <MapListWrap campList={campList} lastItemRef={lastItemRef} />
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
