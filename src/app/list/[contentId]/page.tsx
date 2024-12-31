'use client';

import { CampInfo } from '@/assets/types/Camp';
import Carousel from '@/components/Carousel/Carousel';
import DefaultImg from '@/components/DefaultImg/DefaultImg';
import { BASE_URL } from '@/config/config';
import { useGlobalStore } from '@/stores/globalState';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Facility {
  name: string;
  iconName: string;
}

const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

const ListDetail = ({ params }: { params: { contentId: string } }) => {
  const { contentId } = params;
  const [campData, setCampData] = useState<CampInfo | null>(null);
  const { mapScriptLoaded } = useGlobalStore();

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
        // });
      });
    }
  }, [campData, mapScriptLoaded]);

  useEffect(() => {
    const fetchDataAndCreateMap = async () => {
      try {
        // const response = await fetch(
        //   `${process.env.NEXT_PUBLIC_BASE_URL}lists/${contentId}`
        // );
        const response = await fetch(`${BASE_URL}/campings/lists/${contentId}`);

        if (!response.ok) {
          throw new Error('Error on fetching camp data');
        }

        const fetchData = await response.json();
        const camp = fetchData.data;

        setCampData(camp);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDataAndCreateMap();

    return () => {
      const script = document.querySelector(
        `script[src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}"]`
      );
      if (script) {
        script.remove();
      }
    };
  }, [contentId]);

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

  if (!campData) {
    return <p>Loading...</p>;
  }

  const facilities = !!campData.sbrsCl ? campData.sbrsCl.split(',') : null;

  return (
    <div className="w-[390px] p-4">
      <div className="flex flex-col grow p-2 ">
        <div className="space-y-4 mb-4">
          {campData.images ? (
            <Image
              className=" rounded-[5px] justify-items-stretch "
              src={campData.images[0]?.url}
              alt={`${campData.factDivNm} 사진`}
              width={380}
              height={320}
            />
          ) : (
            <DefaultImg type="camp" className="" width={350} height={200} />
          )}

          <h2 className="text-subTitle">{campData.factDivNm}</h2>
          <p className="text-description text-Gray">
            {campData.doNm} {campData.signguNm}
          </p>
        </div>
        <hr className="mb-4" />

        {campData.intro && (
          <div className="space-y-4 mb-4">
            <p className="text-content">캠핑장 소개</p>
            <p className="text-description text-Gray">{campData.intro}</p>
          </div>
        )}

        <div className="flex space-x-6 justify-center my-6">
          <span className="text-LightGray text-[6px]">●</span>
          <span className="text-LightGray text-[6px]">●</span>
          <span className="text-LightGray text-[6px]">●</span>
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
    </div>
  );
};

export default ListDetail;
