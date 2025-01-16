'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

import Card from '@/components/Card/Card';
import chevron from '@icons/chevron_gray.svg';
import { CampMap } from '@/types/CampMap';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';

interface MapProps {
  campList: CampMap[];
  lastItemRef: (node: HTMLDivElement) => void;
}

export const MapListWrap = ({ campList, lastItemRef }: MapProps) => {
  const [isOpenList, setIsOpenList] = useState(false);
  const handleList = () => {
    setIsOpenList((prev) => !prev);
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className={`bg-white absolute bottom-0 w-full ${isOpenList ? 'h-full overflow-auto' : 'h-32 pt-5 rounded-t-2xl overflow-hidden'} flex flex-col items-center shadow-mapListShadow z-zMapModal transition-all duration-500 ease-in-out`}
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
      {campList.length > 0 ? (
        campList.map((camp, idx) => {
          return (
            <div
              className="w-full flex justify-center"
              key={camp.id}
              ref={idx === campList.length - 1 ? lastItemRef : null}
            >
              <Card
                key={camp.contentId}
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
      {isOpenList && <ScrollToTop scrollRef={scrollRef} />}
    </div>
  );
};
