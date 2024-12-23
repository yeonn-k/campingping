'use client';

import { ButtonHTMLAttributes, ReactNode, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  width?: string;
  height?: string;
  bgcolor?: string;
  fontsize?: string;
  onClick: () => void;
}

const Button = ({
  children,
  width = 'w-24',
  height = 'h-10',
  bgcolor = 'Green',
  fontsize = 'content',
  onClick,
}: ButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`${width} ${height} bg-${bgcolor} text-${fontsize} text-white rounded cursor-pointer`}
      onClick={handleClick}
    >
      {isLoading ? <LoadingSpinner /> : children}
    </button>
  );
};

export default Button;
