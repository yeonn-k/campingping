'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import Card from '@/components/Card/Card';
import chevron from '@icons/chevron_gray.svg';
import chevron90 from '@icons/chevron90.svg';

import { CampMap } from '@/types/Camp';

interface MapProps {
  campList: CampMap[];
  scrollRef: React.RefObject<HTMLDivElement>;
}

export const MapListWrap = ({ campList, scrollRef }: MapProps) => {
  const [isOpenList, setIsOpenList] = useState(false);
  const [localCampList, setLocalCampList] = useState<CampMap[]>(campList);

  useEffect(() => {
    setLocalCampList(campList);
  }, [campList]);

  const handleList = () => {
    setIsOpenList((prev) => !prev);
  };

  return (
    <>
      <div
        ref={scrollRef}
        className={`md:hidden bg-white fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full ${isOpenList ? 'h-full sm:h-[90vh] overflow-auto' : 'h-32 overflow-hidden'} rounded-t-2xl  pt-5 pb-20 flex flex-col items-center shadow-mapListShadow z-zMapModal transition-all duration-500 ease-in-out`}
      >
        {isOpenList ? (
          <Image
            src={chevron}
            alt="화살표 아이콘"
            width={16}
            quality={10}
            className="pb-2 mb-4 origin-center rotate-180"
            onClick={handleList}
          />
        ) : (
          <Image
            src={chevron}
            alt="화살표 아이콘"
            width={16}
            quality={10}
            className="pb-4"
            onClick={handleList}
          />
        )}
        {localCampList?.length > 0 ? (
          localCampList.map((camp) => {
            return (
              <div className="w-full flex justify-center" key={camp.contentId}>
                <Card
                  contentId={camp.contentId}
                  name={camp.facltNm}
                  liked={camp.favorite}
                  imgSrc={camp.firstImageUrl}
                  address={camp.addr1}
                  description={camp.lineIntro}
                />
              </div>
            );
          })
        ) : (
          <div className="h-5/6 flex flex-col justify-center items-center">
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
      </div>

      <div
        className={`relative bg-white fixed top-0 left-0 ${isOpenList ? 'w-[22vh]' : 'w-12'} h-full flex flex-col shadow-mapListShadow z-zMapModal transition-all duration-500 ease-in-out 
hidden md:flex`}
      >
        <div className="absolute right-4 top-10 ">
          {isOpenList ? (
            <Image
              src={chevron90}
              alt="화살표 아이콘"
              width={16}
              quality={10}
              onClick={handleList}
            />
          ) : (
            <Image
              src={chevron90}
              alt="화살표 아이콘"
              width={16}
              quality={10}
              className="origin-center scale-x-[-1]"
              onClick={handleList}
            />
          )}
        </div>

        <div
          className=" overflow-x-hidden overflow-y-auto m-10 h-screen "
          ref={scrollRef}
        >
          {localCampList?.length > 0 ? (
            localCampList.map((camp) => {
              return (
                <div
                  className="w-full flex justify-center"
                  key={camp.contentId}
                >
                  <Card
                    contentId={camp.contentId}
                    name={camp.facltNm}
                    liked={camp.favorite}
                    imgSrc={camp.firstImageUrl}
                    address={camp.addr1}
                    description={camp.lineIntro}
                  />
                </div>
              );
            })
          ) : (
            <div className="h-5/6 flex flex-col justify-center items-center">
              <p>검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
