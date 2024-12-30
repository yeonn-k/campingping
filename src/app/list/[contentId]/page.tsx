'use client';

import Camp, { CampImage } from '@/assets/types/Camp';
import DefaultImg from '@/components/DefaultImg/DefaultImg';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Facility {
  name: string;
  iconName: string;
}

interface CampInfo extends Camp {
  createdAt: string;
  updatedAt: string;
  deletedAt: boolean;
  images: CampImage[] | null;
}

const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY as string;

const ListDetail = ({ params }: { params: { contentId: string } }) => {
  const { contentId } = params;
  const [campData, setCampData] = useState<CampInfo | null>(null);

  useEffect(() => {
    const fetchDataAndCreateMap = async () => {
      try {
        const response = await fetch(
          `https://kdt-react-node-1-team03.elicecoding.com:3000/campings/lists/${contentId}`
        );

        if (!response.ok) {
          throw new Error('Error on fetching camp data');
        }

        const fetchData: CampInfo = await response.json();
        console.log(fetchData);
        setCampData(fetchData);

        const script = document.createElement('script');
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

            const map = new window.kakao.maps.Map(container, options);

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
    { name: '온수', iconName: 'hot water' },
    { name: '트렘폴린', iconName: 'trampoline' },
    { name: '물놀이장', iconName: 'pool' },
    { name: '놀이터', iconName: 'playground' },
    { name: '산책로', iconName: 'trail' },
    { name: '운동장', iconName: 'playfield' },
    { name: '운동시설', iconName: 'exercise facilities' },
    { name: '마트.편의점', iconName: 'market' },
    { name: '덤프스테이션', iconName: 'dump station' },
  ];

  if (!campData) {
    return <p>Loading...</p>;
  }

  const facilities = !!campData.sbrsCl ? campData.sbrsCl.split(',') : null;

  return (
    <div className="flex flex-col grow p-2">
      {campData.images ? (
        <Image
          className=""
          src={campData.images[0]?.url}
          alt={`${campData.factDivNm} 사진`}
          width={380}
          height={220}
        />
      ) : (
        <DefaultImg type="camp" className="" width={350} height={200} />
      )}

      <h2>{campData.factDivNm}</h2>
      <p>
        {campData.doNm} {campData.signguNm}
      </p>

      <hr />

      <div>
        <p>캠핑장 소개</p>
        <p>{campData.intro}</p>
      </div>

      <div>
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
                      src={`/facility/${matchedFacility.iconName}.png`}
                      alt={matchedFacility.iconName}
                      width={24}
                      height={24}
                    />
                  )}
                  <span className="text-[10px]">{matchedFacility?.name}</span>
                </div>
              );
            })}
        </div>
      </div>

      <div>
        <p>캠핑장 사진</p>
        <div>{/* Add image carousol here */}</div>
      </div>

      <div>
        <div>
          <Image src="/location.png" alt="location" width={24} height={24} />
          <span>
            {campData.addr1}
            {!!campData.addr2 && ` / ${campData.addr2}`}
          </span>
        </div>
        <div>
          <Image src="/icons/phone.png" alt="phone" width={24} height={24} />
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
