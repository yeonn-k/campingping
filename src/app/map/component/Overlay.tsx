import Image from 'next/image';
import noImg from '@images/noImg.png';

const Overlay = () => {
  return (
    <div className="relative w-52 h-40 rounded-md bg-white p-2 flex justify-center items-end border border-Green">
      <div className="absolute w-5 h-5 bg-white border border-Green rotate-45 translate-y-4 " />
      <div className="absolute bg-white w-8 h-5 translate-y-2" />
      <div className="absolute top-0 left-0 w-full h-8 flex items-center bg-Green text-white rounded-t-md p-1.5 mb-2">
        캠핑장 이름이 나타나는 곳
      </div>
      <div className="flex space-evenly gap-1 mt-7 z-10 ">
        <Image
          src={noImg}
          width={100}
          height={70}
          alt="캠핑장 미리보기"
          quality={20}
        />
        <div className="text-description text-Gray">
          캠핑장 주소가 나타나는 곳
        </div>
      </div>
    </div>
  );
};

export default Overlay;
