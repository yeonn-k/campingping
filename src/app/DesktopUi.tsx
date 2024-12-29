'use client';

import Image from 'next/image';
import logoText from '@images/campingping_orange.svg';
import symbolImg from '@images/campingping.png';

import { useIsMobile } from '@/hooks/useIsMobile';

const DesktopUi = () => {
  const { isMobile, isMounting } = useIsMobile();

  if (isMounting) return null;
  if (isMobile) return null;
  else
    return (
      <div className="flex flex-col justify-center items-center w-[400px]">
        <Image src={symbolImg} alt="symbol" width={120} height={100} />
        <Image src={logoText} alt="logo" width={220} height={100} />
      </div>
    );
};

export default DesktopUi;
