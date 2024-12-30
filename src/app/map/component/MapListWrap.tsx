'use client';

import Card from '@/components/Card/Card';
import Image from 'next/image';

import chevron from '@icons/chevron_gray.svg';

export const MapListWrap = () => {
  return (
    <div className="bg-slate-200 fixed bottom-0 w-full h-32 bg-red-1 flex flex-col items-center pt-5 rounded-t-2xl shadow-mapListShadow">
      <Image
        src={chevron}
        alt="화살표 아이콘"
        width={16}
        height={10}
        quality={10}
        className="pb-4"
      />
      <Card />
    </div>
  );
};
