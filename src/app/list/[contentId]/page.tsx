// list> [contentId] > page.tsx
'use client';

import { CampDetail } from '@/types/Camp';
import Carousel from '@/components/Carousel/Carousel';

import { useGlobalStore } from '@/stores/globalState';
import { api } from '@/utils/axios';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import myWishIcon from '@icons/liked.svg';
import notMyWishIcon from '@icons/not-liked.svg';

import Weather from '@/components/Weather/Weather';
import DefaultImg from '@/components/DefaultImg/DefaultImg';
import axios from 'axios';
import SearchBar from '@/components/SearchBar/SearchBar';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';

interface Facility {
  name: string;
  iconName: string;
}

const facilityIcons: Facility[] = [
  { name: '전기', iconName: 'electricity' },
  { name: '무선인터넷', iconName: 'wifi' },
  { name: '장작판매', iconName: 'firewood' },
  { name: '온수', iconName: 'hot-water' },
  { name: '트렘폴린', iconName: 'trampoline' },
  { name: '물놀이장', iconName: 'pool' },
  { name: '놀이터', iconName: 'playground' },
  { name: '산책로', iconName: 'trail' },
  { name: '운동장', iconName: 'playfield' },
  { name: '운동시설', iconName: 'exercise-facilities' },
  { name: '마트.편의점', iconName: 'market' },
  { name: '덤프스테이션', iconName: 'dump-station' },
];
const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

const ListDetail = ({ params }: { params: { contentId: string } }) => {
  const { contentId } = params;
  const [campData, setCampData] = useState<CampDetail | null>(null);
  const { mapScriptLoaded } = useGlobalStore();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapScriptLoaded && campData) {
      window.kakao.maps.load(() => {
        if (campData.location) {
          const { coordinates } = campData.location;

          if (coordinates) {
            const container = document.getElementById('map') as HTMLElement;
            const options = {
              center: new window.kakao.maps.LatLng(
                coordinates[1],
                coordinates[0]
              ),
              level: 3,
            };

            const map = new window.kakao.maps.Map(container, options);

            const markerPosition = new window.kakao.maps.LatLng(
              coordinates[1],
              coordinates[0]
            );
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
            });
            marker.setMap(map);
          } else {
            console.error('');
          }
        } else {
          console.error('No location data available for this camp');
        }
      });
    }
  }, [campData, mapScriptLoaded]);

  console.log(campData);

  useEffect(() => {
    const fetchMockData = async () => {
      try {
        const res = await axios.get('/data/mock.json');
        setCampData(res.data[contentId]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMockData();
  }, []);

  useEffect(() => {
    // const fetchDataAndCreateMap = async () => {
    //   try {
    //     const response = await api.get(`/campings/lists/${contentId}`);

    //     const camp = response.data.data;

    //     if (!response) {
    //       throw new Error('Error on fetching camp data');
    //     }
    //     setCampData(camp);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

    // fetchDataAndCreateMap();

    return () => {
      const script = document.querySelector(
        `script[src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}"]`
      );
      if (script) {
        script.remove();
      }
    };
  }, [contentId]);

  if (!campData) {
    return <p>Loading...</p>;
  }

  const facilities = !!campData.sbrsCl ? campData.sbrsCl.split(',') : null;

  // const handleWishlist = (event: MouseEvent): void => {
  //   useWishlist().addOrRemoveWishlist();
  // };

  return (
    <div className="w-full h-screen overflow-y-scroll" ref={scrollRef}>
      <SearchBar origin="detail" category={null} region={null} />
      <div className="flex justify-center">{/* <Weather /> */}</div>
      <div className="flex flex-col grow p-5 ">
        <div className="relative mb-4">
          {campData.firstImageUrl ? (
            <Image
              className=" rounded-[5px] justify-items-stretch "
              src={campData.firstImageUrl}
              alt={`${campData.facltNm} 사진`}
              width={380}
              height={320}
            />
          ) : (
            <DefaultImg />
          )}

          <Image
            src={campData.favorite ? myWishIcon : notMyWishIcon}
            alt="위시리스트"
            width={20}
            height={19}
            className="absolute top-2.5 right-2.5"
            style={{ margin: '0px' }}
            // onClick={handleWishlist}
          />

          <h2 className="text-subTitle mt-4">{campData.facltNm}</h2>
          <p className="text-description text-Gray mt-1 ">{campData.addr1}</p>
        </div>
        <hr className="mb-4" />

        {campData.intro && (
          <>
            <div className="space-y-4 mb-4">
              <p className="text-content">캠핑장 소개</p>
              <p className="text-description text-Gray">{campData.intro}</p>
            </div>

            <div className="flex space-x-6 justify-center my-6">
              <span className="text-LightGray text-[6px]">●</span>
              <span className="text-LightGray text-[6px]">●</span>
              <span className="text-LightGray text-[6px]">●</span>
            </div>
          </>
        )}

        <div className="space-y-1 mb-4">
          <p className="mb-2">기본정보</p>
          <div className="grid grid-cols-[1fr,2fr] gap-1 text-description">
            {campData.bizrno && (
              <>
                <div>사업자 정보</div>
                <div className="text-Gray">{campData.bizrno}</div>
              </>
            )}
            {campData.manageSttus && (
              <>
                <div>운영 상태</div>
                <div className="text-Gray">{campData.bizrno}</div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4 mb-4">
          <p>시설정보</p>
          <div className="flex flex-row flex-wrap">
            {facilities &&
              facilities.map((facility) => {
                const matchedFacility = facilityIcons.find(
                  (icon) => icon.name === facility
                );
                return (
                  <div
                    key={facility}
                    className="flex flex-col basis-1/4 items-center justify-center cursor-pointer p-2 rounded-lg transition"
                  >
                    {matchedFacility && (
                      <Image
                        src={`/icons/facility/${matchedFacility.iconName}.png`}
                        alt={matchedFacility.iconName}
                        width={24}
                        height={24}
                      />
                    )}
                    <span className="text-[10px] text-Gray">
                      {matchedFacility?.name}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="space-y-4 mb-4">
          <p>캠핑장 사진</p>
          {campData.images && (
            <div className="flex flex-col  p-2">
              <Carousel images={campData.images} />
            </div>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <p className="flex">위치</p>
          <div className="flex">
            <Image
              className="flex"
              src="/icons/location.png"
              alt="location"
              width={24}
              height={24}
            />
            <span className="text-Gray text-description align-middle">
              {campData.addr1}
              {!!campData.addr2 && ` / ${campData.addr2}`}
            </span>
          </div>
          <div className="flex space-x-1 ">
            <Image
              className="flex"
              src="/icons/phone.png"
              alt="phone"
              width={24}
              height={24}
            />
            <span className="text-Gray text-description align-middle">
              {campData.tel}
            </span>
          </div>

          <div className="flex jsutify-center mb-24">
            <div className="w-[350px] h-[250px]" id="map"></div>
          </div>
        </div>
      </div>
      <ScrollToTop scrollRef={scrollRef} />
    </div>
  );
};

export default ListDetail;
