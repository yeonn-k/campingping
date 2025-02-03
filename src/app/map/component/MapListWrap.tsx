'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import Card from '@/components/Card/Card';
import chevron from '@icons/chevron_gray.svg';

import { CampMap } from '@/types/Camp';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';

interface MapProps {
  campList: CampMap[];
}

export const MapListWrap = ({ campList }: MapProps) => {
  const [isOpenList, setIsOpenList] = useState(false);
  const [localCampList, setLocalCampList] = useState<CampMap[]>(campList);

  useEffect(() => {
    setLocalCampList(campList);
  }, [campList]);

  const handleList = () => {
    setIsOpenList((prev) => !prev);
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className={`bg-white absolute bottom-0 w-full ${isOpenList ? 'h-full overflow-auto' : 'h-32 pt-5 rounded-t-2xl overflow-hidden'} pb-20 flex flex-col items-center shadow-mapListShadow z-zMapModal transition-all duration-500 ease-in-out`}
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
                itemId={camp.contentId}
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
      <ScrollToTop scrollRef={scrollRef} />
    </div>
  );
};
