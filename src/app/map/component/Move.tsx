import Image from 'next/image';
import moveIcon from '@icons/move.svg';
import { useEffect, useState } from 'react';

const Move = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(false);
    }, 3000);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`absolute top-1/2 left-1/2 -translate-y-[76%] -translate-x-1/2 flex flex-col justify-center items-center z-zMapModal transition-opacity duration-[1500ms] ease-out ${
        isFading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className=" w-14 h-14 rounded-full flex justify-center items-center bg-white shadow-shadowCustom  ">
        <Image src={moveIcon} alt="move" width={40} height={40} quality={20} />
      </div>
      <p
        className="relative w-full text-center text-DarkGray p-1 mt-1 font-semibold bg-white rounded-xl shadow-shadowCustom
"
      >
        지도를 움직여보세요
      </p>
    </div>
  );
};

export default Move;
