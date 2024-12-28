'use client';

import { ButtonHTMLAttributes, ReactNode, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  width?: string;
  height?: string;
  bgcolor?: string;
  fontsize?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => Promise<void>;
}

const Button = ({
  children,
  width = 'w-24',
  height = 'h-10',
  bgcolor = 'bg-Green',
  fontsize = 'content',
  isLoading,
  disabled,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`${width} ${height} ${bgcolor} text-${fontsize} text-white rounded cursor-pointer disabled:cursor-not-allowed`}
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? <LoadingSpinner /> : children}
    </button>
  );
};

export default Button;
