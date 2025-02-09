'use client';

import Image from 'next/image';

import closeBtn from '@icons/close_white.svg';
import Link from 'next/link';
import DefaultImg from '@/components/DefaultImg/DefaultImg';

interface OverlayProps {
  onClick: React.MouseEventHandler<HTMLImageElement>;
  id: string;
  name: string;
  imgSrc: string | null;
  address: string;
}

const Overlay = ({ id, name, imgSrc, address, onClick }: OverlayProps) => {
  const handleCloseClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onClick(e);
  };

  return (
    <Link href={`/list/${id}`}>
      <div className="relative w-52 h-34 rounded-md bg-white p-2 flex justify-center items-end border border-Green">
        <div className="absolute w-5 h-5 bg-white border border-Green rotate-45 translate-y-4" />
        <div className="absolute bg-white w-8 h-5 translate-y-2" />
        <div className="absolute top-0 left-0 w-full h-8 flex items-center justify-between bg-Green text-white rounded-t-md p-2 mb-2">
          <p className="w-5/6 overflow-hidden truncate">{name}</p>

          <Image
            src={closeBtn}
            alt="닫기 버튼"
            width={12}
            height={12}
            onClick={handleCloseClick}
            className="absolute right-2"
          />
        </div>
        <div className="flex space-between w-48 gap-1 mt-7 z-10">
          {imgSrc ? (
            <Image
              src={imgSrc}
              width={100}
              height={70}
              alt="캠핑장 미리보기"
              quality={5}
            />
          ) : (
            <DefaultImg width="w-[70%]" height="h-[70%]" />
          )}
          <p className="w-20 h-10 text-description text-Gray overflow-hidden text-ellipsis whitespace-nowrap">
            {address}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Overlay;
