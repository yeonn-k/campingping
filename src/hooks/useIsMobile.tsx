import { useState, useEffect } from 'react';

const mobileRegex = /iPhone|iPad|iPod|Android/i;

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>();

  const isMounting = isMobile === undefined;

  useEffect(() => {
    setIsMobile(mobileRegex.test(navigator.userAgent));
  }, []);

  return { isMobile, isMounting };
};
