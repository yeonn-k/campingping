'use client';

import Image from 'next/image';
import logoText from '@images/campingping_orange.svg';
import symbolImg from '@images/campingping.png';
import { useEffect, useState } from 'react';

const DesktopUi = () => {
  const [isMobile, setIsMobile] = useState(false);

  const checkDevice = () => {
    if (/Mobi/i.test(window.navigator.userAgent)) {
      setIsMobile(true);
    }
  };

  useEffect(() => {
    checkDevice();
  }, []);

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
