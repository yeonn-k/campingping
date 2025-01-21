'use client';

import dynamic from 'next/dynamic';

import { createRoot } from 'react-dom/client';
import { useCallback, useEffect, useRef, useState } from 'react';

import SearchBar from '@/components/SearchBar/SearchBar';

import { MapListWrap } from './component/MapListWrap';
import Overlay from './component/Overlay';

import { CampMap } from '@/types/Camp';
import { useLocationStore } from '@/stores/locationState';

import { api } from '@/utils/axios';
import useLocation from '@/hooks/useLocation';
import useCategory from '@/hooks/useCategory';
import { createApiUrl } from '@/utils/createApiUrl';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/Button/LoadingSpinner';
import useGeoLocationPermission from '@/hooks/useGeoLocation';
import WeatherWithLatLon from '@/components/Weather/WeatherWithLatLon';

const LIMIT = 10;

const Map = () => {
  const searchParams = useSearchParams();

  const [regionQuery, setRegionQuery] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(0);

  const isGeoLocationGranted = useGeoLocationPermission();

  const NoSSRCategory = dynamic(
    () => import('../../components/Category/Category'),
    { ssr: false }
  );

  const { selectedCategoryValue, selectedCategory, handleCategorySelected } =
    useCategory();

  const { userLat, userLon } = useLocationStore();
  const [lat, setLat] = useState<number | null>(userLat);
  const [lon, setLon] = useState<number | null>(userLon);

  const mapRef = useRef<HTMLDivElement>(null);
  const [kakaoMap, setKakaoMap] = useState<unknown | null>(null);
  const [, setKakaoMarker] = useState<unknown | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const [campList, setCampList] = useState<CampMap[]>([]);

  useEffect(() => {
    setRegionQuery(new URLSearchParams(window.location.search).get('region'));
  }, []);

  const location = useLocation(regionQuery);

  useEffect(() => {
    const currentRegionQuery = searchParams.get('region');
    setRegionQuery(currentRegionQuery);
  }, [searchParams]);

  useEffect(() => {
    if (regionQuery && location) {
      setLat(location.regionLat);
      setLon(location.regionLon);
    } else if (!regionQuery && userLat && userLon) {
      setLat(userLat);
      setLon(userLon);
    }
  }, [regionQuery, location, userLat, userLon]);

  const getNearByCampings = async () => {
    if (regionQuery) return;

    try {
      const apiUrl = createApiUrl('/campings/map', [
        { name: 'lat', value: userLat },
        { name: 'lon', value: userLon },
      ]);

      const res = await api.get(apiUrl);

      setCampList(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getCampingsByDoNm = useCallback(async () => {
    if (isLoading || !regionQuery) return;

    setIsLoading(true);
    try {
      const apiUrl = createApiUrl('/campings/lists', [
        { name: 'limit', value: LIMIT },
        { name: 'cursor', value: nextCursor },
        { name: 'category', value: selectedCategoryValue },
        { name: 'region', value: regionQuery },
      ]);

      const res = await api.get(apiUrl);
      const data = res.data.data.result || [];

      setHasMore(res.data.data.nextCursor !== null);
      setNextCursor(res.data.data.nextCursor || null);

      setCampList((prev) => {
        const existingIds = new Set(prev.map((camp) => camp.contentId));
        const newData = data.filter(
          (camp: { contentId: string }) => !existingIds.has(camp.contentId)
        );

        return [...prev, ...newData];
      });
    } catch (error) {
      console.error('Error fetching campings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [nextCursor, isLoading, selectedCategoryValue, regionQuery]);

  useEffect(() => {
    if (regionQuery === null) {
      getNearByCampings();
    } else {
      getCampingsByDoNm();
    }
  }, [regionQuery]);

  useEffect(() => {
    setCampList([]);
    setNextCursor(0);
    setHasMore(true);
  }, [selectedCategoryValue, regionQuery]);

  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || !hasMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (regionQuery) {
            }
            getCampingsByDoNm();
          } else getNearByCampings();
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
          level: regionQuery ? 10 : 7,
          disableDoubleClick: true,
        };

        const map = new window.kakao.maps.Map(mapRef.current, options);
        map.setZoomable(false);

        if (!regionQuery) {
          map.setDraggable(false);
          getNearByCampings();
        }

        getCampingsByDoNm();
        setKakaoMap(map);
      });
    }
  }, [lat, lon, regionQuery, selectedCategoryValue]);

  useEffect(() => {
    if (!kakaoMap || campList.length === 0) return;
    const positions = campList.map((camp) => ({
      id: camp.contentId,
      title: camp.facltNm,
      latlng: new window.kakao.maps.LatLng(
        camp.location.coordinates[1],
        camp.location.coordinates[0]
      ),
      address: camp.addr1,
    }));

    positions.forEach((position) => {
      const marker = new window.kakao.maps.Marker({
        map: kakaoMap,
        position: position.latlng,
        title: position.title,
        address: position.address,
        contentId: position.id,
      });

      marker.setMap(kakaoMap);

      const createContent = (
        closeHandler: React.MouseEventHandler<HTMLImageElement>
      ) => {
        const overlayContent = document.createElement('div');
        const root = createRoot(overlayContent);
        root.render(
          <Overlay
            id={position.id}
            name={position.title}
            address={position.address}
            onClick={closeHandler}
          />
        );

        return overlayContent;
      };

      const closeOverlay = () => {
        overlay.setMap(null);
      };

      const overlay = new window.kakao.maps.CustomOverlay({
        content: createContent(closeOverlay),
        position: marker.getPosition(),
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        const markerPosition = marker.getPosition();
        const adjustedPosition = new window.kakao.maps.LatLng(
          markerPosition.getLat() + 0.1,
          markerPosition.getLng()
        );

        overlay.setPosition(adjustedPosition);
        overlay.setMap(kakaoMap);
      });

      setKakaoMarker(marker);
    });
  }, [campList]);

  return (
    <>
      <SearchBar
        origin="map"
        category={selectedCategoryValue}
        region={regionQuery}
      />

      {regionQuery && (
        <NoSSRCategory
          selectedCategory={selectedCategory}
          onCategorySelected={handleCategorySelected}
        />
      )}

      <div className="relative w-full h-full flex justify-center">
        <WeatherWithLatLon lat={lat} lon={lon} />

        {isGeoLocationGranted && !lat && !lon ? (
          <div className="w-full h-full flex justify-center items-center">
            <div className="flex flex-wrap justify-center pb-28">
              <LoadingSpinner />
              <p className="w-full text-Gray text-center mt-2">
                지도를 불러오는 중 입니다
              </p>
            </div>
          </div>
        ) : lat && lon ? (
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
