'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MapListWrap } from './component/MapListWrap';
import { useLocationStore } from '@/stores/locationState';
import { api } from '@/utils/axios';

import dynamic from 'next/dynamic';

import { CampMap } from '@/types/CampMap';

import useLocation from '@/hooks/useLocation';

import Weather from '@/components/Weather/Weather';
import useCategory from '@/hooks/useCategory';
import markerImg from '@icons/marker.svg';

const limit = 10;
let region: string | null;

const Map = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(0);

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
      const res = await api.get(`/campings/map?lat=${userLat}&lon=${userLon}`);

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
        `campings/lists?region=${region}${selectedCategory !== '전체' ? `&category=${selectedCategory}` : ''}&limit=${limit}&cursor=${nextCursor}`
      );
      const data = res.data.data.result;

      if (res.data.data.nextCursor === null) {
        setHasMore(false);
      } else {
        setHasMore(true);
        setNextCursor(res.data.data.nextCursor);
      }

      setCampList((prev) => [...prev, ...data]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [nextCursor, isLoading, selectedCategory, region, hasMore]);

  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || !hasMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (region) {
            }
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
        const options = region
          ? {
              center: new window.kakao.maps.LatLng(lat, lon),
              level: 10,
            }
          : {
              center: new window.kakao.maps.LatLng(lat, lon),
              level: 7,
            };

        const map = new window.kakao.maps.Map(mapRef.current, options);
        if (!region) {
          map.setZoomable(false);
          map.setDraggable(false);
        }

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
    if (!kakaoMap || campList.length === 0) return;

    const positions = campList.map((camp) => ({
      title: camp.facltNm,
      latlng: new window.kakao.maps.LatLng(
        camp.location.coordinates[1],
        camp.location.coordinates[0]
      ),
    }));

    positions.forEach((position) => {
      const marker = new window.kakao.maps.Marker({
        map: kakaoMap,
        position: position.latlng,
        title: position.title,
      });

      marker.setMap(kakaoMap);
    });
  });

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
