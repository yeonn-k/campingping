'use client';

import Card from '@/components/Card/Card';
import Image from 'next/image';

import chevron from '@icons/chevron_gray.svg';
import { useState } from 'react';

export const MapListWrap = () => {
  const [isOpenList, setIsOpenList] = useState(false);
  const handleList = () => {
    setIsOpenList((prev) => !prev);
  };
  return (
    <div
      className={`bg-white absolute bottom-0 w-full ${isOpenList ? 'h-full overflow-auto' : 'h-32 pt-5 rounded-t-2xl overflow-hidden'} flex flex-col items-center shadow-mapListShadow z-zMapModal `}
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

      <Card />
      <Card />
    </div>
  );
};
