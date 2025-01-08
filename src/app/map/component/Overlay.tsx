import Image from 'next/image';
import noImg from '@images/noImg.png';
import closeBtn from '@icons/close_white.svg';

interface OverlayProps {
  onClick: React.MouseEventHandler<HTMLImageElement>;
  id: string;
  name: string;
  address: string;
}

const Overlay = ({ name, address, onClick }: OverlayProps) => {
  return (
    <div className="relative w-52 h-34 rounded-md bg-white p-2 flex justify-center items-end border border-Green">
      <div className="absolute w-5 h-5 bg-white border border-Green rotate-45 translate-y-4" />
      <div className="absolute bg-white w-8 h-5 translate-y-2" />
      <div className="absolute top-0 left-0 w-full h-8 flex items-center justify-between bg-Green text-white rounded-t-md p-2 mb-2">
        {name}
        <Image src={closeBtn} alt="닫기 버튼" width={12} onClick={onClick} />
      </div>
      <div className="flex space-between w-48 gap-1 mt-7 z-10">
        <Image src={noImg} width={100} alt="캠핑장 미리보기" quality={20} />
        <p className="w-20 h-10 text-description text-Gray overflow-hidden text-ellipsis whitespace-nowrap">
          {address}
        </p>
      </div>
    </div>
  );
};

export default Overlay;
