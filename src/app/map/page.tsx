'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

import { createRoot } from 'react-dom/client';
import { useCallback, useEffect, useRef, useState } from 'react';

import SearchBar from '@/components/SearchBar/SearchBar';

import { MapListWrap } from './component/MapListWrap';
import Overlay from './component/Overlay';

import { CampMap } from '@/types/Camp';
import { useLocationStore } from '@/stores/locationState';

import useLocation from '@/hooks/useLocation';
import useCategory from '@/hooks/useCategory';
import useGeoLocationPermission from '@/hooks/useGeoLocation';
import { api } from '@/utils/axios';
import { createApiUrl } from '@/utils/createApiUrl';
import WeatherWithLatLon from '@/components/Weather/WeatherWithLatLon';
import LoadingSpinner from '@/components/Button/LoadingSpinner';
import Move from './component/Move';

const NoSSRCategory = dynamic(
  () => import('../../components/Category/Category'),
  { ssr: false }
);

const Map = () => {
  const searchParams = useSearchParams();

  const [regionQuery, setRegionQuery] = useState<string | null>(null);
  const [cityQuery, setCityQuery] = useState<string | null>(null);

  const isGeoLocationGranted = useGeoLocationPermission();

  const { selectedCategoryValue, selectedCategory, handleCategorySelected } =
    useCategory();

  const { userLat, userLon } = useLocationStore();
  const [lat, setLat] = useState<number | null>(userLat);
  const [lon, setLon] = useState<number | null>(userLon);

  const mapRef = useRef<HTMLDivElement>(null);
  const [kakaoMap, setKakaoMap] = useState<kakao.maps.Map | null>(null);
  const [, setKakaoMarker] = useState<kakao.maps.Marker | null>(null);

  const [campList, setCampList] = useState<CampMap[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      setRegionQuery(searchParams.get('region'));
      setCityQuery(searchParams.get('city'));
    }
  }, []);

  const location = useLocation(regionQuery, cityQuery);

  useEffect(() => {
    const currentRegionQuery = searchParams.get('region');
    const currentCityQuery = searchParams.get('city');
    setRegionQuery(currentRegionQuery);
    setCityQuery(currentCityQuery);
  }, [searchParams]);

  useEffect(() => {
    if (regionQuery && location) {
      setLat(location.lat);
      setLon(location.lon);
    } else if (!regionQuery && userLat && userLon) {
      setLat(userLat);
      setLon(userLon);
    }
  }, [regionQuery, location, userLat, userLon]);

  useEffect(() => {
    if (!kakaoMap) return;
    if (!regionQuery) {
      const onMapCenterChanged = () => {
        const center = kakaoMap.getCenter();
        const updatedLat = center.getLat();
        const updatedLon = center.getLng();

        setLat(updatedLat);
        setLon(updatedLon);

        getNearByCampings(updatedLat, updatedLon);
      };

      kakaoMap.addListener('mouseup', onMapCenterChanged);

      // 컴포넌트 언마운트 시 리스너 제거
      return () => {
        kakaoMap.removeListener('mouseup', onMapCenterChanged);
      };
    }
  }, [kakaoMap]);

  const getNearByCampings = async (updatedLat: number, updatedLon: number) => {
    try {
      const apiUrl = createApiUrl('/campings/map', [
        { name: 'lat', value: updatedLat },
        { name: 'lon', value: updatedLon },
      ]);

      const res = await api.get(apiUrl);

      setCampList(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getCampingsByDoNm = useCallback(async () => {
    if (!regionQuery) return;

    try {
      const apiUrl = createApiUrl('/campings/lists', [
        { name: 'category', value: selectedCategoryValue },
        { name: 'region', value: regionQuery },
        { name: 'city', value: cityQuery },
      ]);

      const res = await api.get(apiUrl);
      const data = res.data.data.result || [];

      setCampList(data);
    } catch (error) {
      console.error('Error fetching campings:', error);
    } finally {
    }
  }, [selectedCategoryValue, regionQuery]);

  useEffect(() => {
    if (regionQuery === null) {
      if (typeof lat === 'number' && typeof lon === 'number')
        getNearByCampings(lat, lon);
    } else {
      getCampingsByDoNm();
    }
  }, [lat, lon]);

  useEffect(() => {
    setCampList([]);
  }, [selectedCategoryValue, regionQuery]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (lat !== null && lon !== null) {
      window.kakao?.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(lat, lon),
          level: cityQuery ? 8 : regionQuery ? 10 : 7,
          disableDoubleClick: true,
        };

        const map = new window.kakao.maps.Map(mapRef.current, options);

        regionQuery ? map.setZoomable(true) : map.setZoomable(false);

        setKakaoMap(map);

        if (kakaoMap) {
          return;
        }

        if (!regionQuery) {
          if (typeof lat === 'number' && typeof lon === 'number')
            getNearByCampings(lat, lon);
        }

        getCampingsByDoNm();
      });
    }
  }, [lat, lon, regionQuery, , cityQuery, selectedCategoryValue]);

  useEffect(() => {
    if (!kakaoMap || campList?.length === 0) return;

    const positions = campList?.map((camp) => ({
      id: camp.contentId,
      title: camp.facltNm,
      latlng: new window.kakao.maps.LatLng(
        camp.location.coordinates[1],
        camp.location.coordinates[0]
      ),
      address: camp.addr1,
      imgSrc: camp.firstImageUrl,
    }));

    const markers = positions.map(function (position) {
      return new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(
          position.latlng[1],
          position.latlng[0]
        ),
      });
    });

    const clusterer = new window.kakao.maps.MarkerClusterer({
      map: kakaoMap,
      averageCenter: true,
      minLevel: 9,
      markers: markers,
    });

    markers.forEach((marker) => marker.setMap(null));

    clusterer.clear();
    setTimeout(() => clusterer.redraw(), 100);

    positions?.forEach((position) => {
      const marker = new window.kakao.maps.Marker({
        map: kakaoMap,
        position: position.latlng,
        title: position.title,
        address: position.address,
        contentId: position.id,
      });

      clusterer.addMarker(marker);
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
            imgSrc={position.imgSrc}
            address={position.address}
            onClick={closeHandler}
          />
        );

        return overlayContent;
      };

      const closeOverlay = (e: React.MouseEvent<HTMLImageElement>) => {
        e.stopPropagation();
        overlay.setMap(null);
      };

      const overlay = new window.kakao.maps.CustomOverlay({
        content: createContent(closeOverlay),
        position: marker.getPosition(),
        yAnchor: 1.25,
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        const markerPosition = marker.getPosition();
        const adjustedPosition = new window.kakao.maps.LatLng(
          markerPosition.getLat(),
          markerPosition.getLng()
        );

        overlay.setPosition(adjustedPosition);
        overlay.setMap(kakaoMap);
      });

      setKakaoMarker(marker);
    });
  }, [campList, kakaoMap]);

  return (
    <>
      <SearchBar
        origin="map"
        category={selectedCategoryValue}
        region={regionQuery}
        city={cityQuery}
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
          <div ref={mapRef} className="relative w-full h-full rounded-md">
            <Move />
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
