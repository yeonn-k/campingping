'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

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
    <div
      className={`bg-white fixed bottom-0 md:top-12 md:left-0 md:h-full w-full ${isOpenList ? 'h-[90vh] md:w-[450px] overflow-auto pt-20' : 'h-32 md:w-12 overflow-hidden'} rounded-t-2xl md:rounded-none pt-5 pb-20 md:pb-0 flex flex-col items-center shadow-mapListShadow z-zMapModal transition-all duration-500 ease-in-out`}
    >
      <div className="absolute top-10 md:hidden">
        <Image
          src={chevron}
          alt="화살표 아이콘"
          width={16}
          quality={10}
          className={isOpenList ? 'pb-2 mb-4 origin-center rotate-180' : 'pb-4'}
          onClick={handleList}
        />
      </div>
      <div className="absolute right-4 top-10 hidden md:block">
        <Image
          src={chevron90}
          alt="화살표 아이콘"
          width={16}
          quality={10}
          className={isOpenList ? '' : 'origin-center scale-x-[-1]'}
          onClick={handleList}
        />
      </div>
      <div
        className={
          isOpenList
            ? `overflow-x-hidden overflow-y-auto mx-10 md:mr-16 h-full w-full`
            : 'hidden h-full'
        }
        ref={scrollRef}
      >
        {localCampList?.length > 0 ? (
          localCampList.map((camp) => (
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
          ))
        ) : (
          <div className="h-5/6 flex flex-col justify-center items-center">
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};
