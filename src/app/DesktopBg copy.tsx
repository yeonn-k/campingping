'use client';

import Image from 'next/image';
import logoText from '@images/campingping_orange.svg';
import symbolImg from '@images/campingping.png';
import React from 'react';

const DesktopUi = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-wrap justify-center items-center">
      <div className="hidden md:block flex items-center justify-center min-w-[220px]">
        <Image src={symbolImg} alt="symbol" width={120} height={100} />
        <Image src={logoText} alt="logo" width={220} height={100} />
      </div>
      <div className="min-w-[450px] min-h-screen flex justify-center">
        {children}
      </div>
    </div>
  );
};

export default DesktopUi;
