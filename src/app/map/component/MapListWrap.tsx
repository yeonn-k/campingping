'use client';

import Card from '@/components/Card/Card';
import Image from 'next/image';

import chevron from '@icons/chevron_gray.svg';
import { useState } from 'react';
import { CampMap } from '@/assets/types/CampMap';

interface MapProps {
  campList: CampMap[];
}

export const MapListWrap = ({ campList }: MapProps) => {
  const [isOpenList, setIsOpenList] = useState(false);
  const handleList = () => {
    setIsOpenList((prev) => !prev);
  };

  return (
    <div
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

      {campList.map((camp) => {
        return (
          <div className="flex justify-center">
            <Card key={camp.id} name={camp.factDivNm} />
          </div>
        );
      })}
    </div>
  );
};
