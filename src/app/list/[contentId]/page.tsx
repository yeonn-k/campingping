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

import { categories } from '@/components/Category/Category';
import { getIconPath } from '@/utils/getIconPath';

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

  // useEffect(() => {
  //   const fetchMockData = async () => {
  //     try {
  //       const res = await axios.get('/data/mock.json');
  //       setCampData(res.data[parseInt(contentId) - 1]);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchMockData();
  // }, []);

  useEffect(() => {
    const fetchDataAndCreateMap = async () => {
      try {
        const response = await api.get(`/campings/lists/${contentId}`);

        const camp = response.data.data;

        if (!response) {
          throw new Error('Error on fetching camp data');
        }
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

  if (!campData) {
    return <p>Loading...</p>;
  }

  const facilities = !!campData.sbrsCl ? campData.sbrsCl.split(',') : null;

  // const handleWishlist = (event: MouseEvent): void => {
  //   useWishlist().addOrRemoveWishlist();
  // };

  return (
    <div className="w-full h-screen overflow-y-scroll pb-12" ref={scrollRef}>
      <SearchBar origin="detail" category={null} region={null} />
      {/* <div className="flex justify-center">
        <Weather />
      </div> */}
      <div className="flex flex-col grow p-5">
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

          <div className="flex justify-between">
            <div>
              <h2 className="text-subTitle mt-4">{campData.facltNm}</h2>
              <p className="text-description text-Gray ">{campData.addr1}</p>
              <p className="text-description text-Gray mt-1 ">
                {campData.lineIntro}
              </p>
            </div>
            <div>
              {campData.induty || campData.lccl ? (
                <div className="flex flex-col items-center mt-5">
                  {categories.map((category) => {
                    if (
                      campData.induty?.includes(category.name) ||
                      campData.lccl?.includes(category.name)
                    ) {
                      const iconPath = getIconPath(category.iconName, false);
                      return (
                        <div className="flex flex-wrap justify-center">
                          <Image
                            key={category.name}
                            src={iconPath}
                            alt={`${category.name} 아이콘`}
                            width={24}
                            height={24}
                            className="m-1.5"
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        <hr className="mb-4" />

        {campData.intro && (
          <>
            <div className="space-y-1 mb-2">
              <p className="text-content ">캠핑장 소개</p>
              <p className="text-description text-Gray">{campData.intro}</p>
            </div>

            <div className="flex space-x-6 justify-center my-6">
              <span className="text-LightGray text-[6px]">●</span>
              <span className="text-LightGray text-[6px]">●</span>
              <span className="text-LightGray text-[6px]">●</span>
            </div>
          </>
        )}

        {campData.bizrno || campData.manageSttus || campData.homepage ? (
          <div className="space-y-1 mb-8">
            <p className="mb-1 ">기본정보</p>
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
                  <div className="text-Gray">{campData.manageSttus}</div>
                  {campData.manageSttus !== '운영' &&
                    campData.hvofBgnde &&
                    campData.hvofEndde && (
                      <>
                        <div>휴무 기간 시작일</div>
                        <div className="text-Gray">{campData.hvofBgnde}</div>
                        <div>휴무 기간 종료일</div>
                        <div className="text-Gray">{campData.hvofEndde}</div>
                      </>
                    )}
                </>
              )}
              {campData.homepage && (
                <>
                  <div>홈페이지</div>
                  <a
                    href={
                      campData.homepage.startsWith('http://') ||
                      campData.homepage.startsWith('https://')
                        ? campData.homepage
                        : `https://${campData.homepage}`
                    }
                    target="_blank"
                    className="text-Gray"
                  >
                    {campData.homepage}
                  </a>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-1 mb-8">
            <p className="mb-1">기본정보</p>
            <p className="text-Gray">정보를 업데이트할 예정입니다.</p>
          </div>
        )}

        {facilities && (
          <div className="space-y-1 mb-8">
            <p className="mb-1">시설정보</p>
            <div className="flex flex-row flex-wrap">
              {facilities?.map((facility) => {
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
        )}

        {(campData.posblFcltyCl ||
          campData.themaEnvrnCl ||
          campData.eqpmnLendCl ||
          campData.animalCmgCl) && (
          <>
            <div className="space-y-1 mb-8">
              <p className="mb-1">추가정보</p>
              <div className="grid grid-cols-[1fr,2fr] gap-1 text-description">
                {campData.posblFcltyCl && (
                  <>
                    <div>주변 이용 가능 시설</div>
                    <div className="text-Gray">{campData.posblFcltyCl}</div>
                  </>
                )}
                {campData.themaEnvrnCl && (
                  <>
                    <div>테마 환경</div>
                    <div className="text-Gray">{campData.themaEnvrnCl}</div>
                  </>
                )}
                {campData.eqpmnLendCl && (
                  <>
                    <div>캠핑장비 대여</div>
                    <div className="text-Gray">{campData.eqpmnLendCl}</div>
                  </>
                )}
                {campData.animalCmgCl && (
                  <>
                    <div>반려동물 출입</div>
                    <div className="text-Gray">{campData.animalCmgCl}</div>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-1 mb-8">
              <p className="mb-1">캠핑장 사진</p>
              {campData.images && (
                <div className="flex flex-col  p-2">
                  <Carousel images={campData.images} />
                </div>
              )}
            </div>
          </>
        )}

        <div className="space-y-2">
          <p className="mb-1">위치</p>
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
              {!!campData.addr2 && ` ${campData.addr2}`}
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
