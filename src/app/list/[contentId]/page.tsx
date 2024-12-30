'use client';

import { CampInfo } from '@/assets/types/Camp';
import Carousel from '@/components/Carousel/Carousel';
import DefaultImg from '@/components/DefaultImg/DefaultImg';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Facility {
  name: string;
  iconName: string;
}

const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY as string;

const ListDetail = ({ params }: { params: { contentId: string } }) => {
  const { contentId } = params;
  const [campData, setCampData] = useState<CampInfo | null>(null);

  useEffect(() => {
    const fetchDataAndCreateMap = async () => {
      try {
        const response = await fetch(
          `http://kdt-react-node-1-team03.elicecoding.com:3000/campings/lists/${contentId}`
        );

        if (!response.ok) {
          throw new Error('Error on fetching camp data');
        }

        const fetchData = await response.json();
        const camp = fetchData.data;
        setCampData(camp);

        const script = document.createElement('script');
        script.text = 'text/javascript';
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}`;
        script.async = true;

        script.onload = () => {
          if (fetchData.location?.coordinates) {
            const { coordinates } = fetchData.location;

            const container = document.getElementById('map') as HTMLElement;
            const options = {
              center: new window.kakao.maps.LatLng(
                coordinates[1],
                coordinates[0]
              ),
              level: 3,
            };
            const map = new window.kakao.Map(container, options);

            const markerPosition = new window.kakao.maps.LatLng(
              coordinates[1],
              coordinates[0]
            );
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
            });
            marker.setMap(map);
          }
        };

        document.body.appendChild(script);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchDataAndCreateMap();
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
    <div className="flex flex-col grow p-2 ">
      <div className="space-y-4 mb-4">
        {campData.images ? (
          <Image
            className="rounded-[5px]"
            src={campData.images[0]?.url}
            alt={`${campData.factDivNm} 사진`}
            width={380}
            height={220}
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

      <div className="space-y-4 mb-4">
        <p>시설정보</p>
        <div className="flex">
          {facilities &&
            facilities.map((facility) => {
              const matchedFacility = facilityIcons.find(
                (icon) => icon.name === facility
              );
              return (
                <div
                  key={facility}
                  className="flex flex-col basis-1/2 items-center justify-center cursor-pointer p-2 rounded-lg transition"
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
          <div className="flex">
            <Carousel images={campData.images} />
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <p>위치</p>
        <div className="flex">
          <Image
            className="flex"
            src="/icons/location.png"
            alt="location"
            width={24}
            height={24}
          />
          <span>
            {campData.addr1}
            {!!campData.addr2 && ` / ${campData.addr2}`}
          </span>
        </div>
        <div className="flex space-x-1">
          <Image
            className="flex"
            src="/icons/phone.png"
            alt="phone"
            width={24}
            height={24}
          />
          <span>{campData.tel}</span>
        </div>

        <div>
          <div className="w-[350px] h-[200px]" id="map"></div>
        </div>
      </div>
    </div>
  );
};

export default ListDetail;
