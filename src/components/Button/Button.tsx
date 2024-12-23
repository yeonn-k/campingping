import { ButtonHTMLAttributes, Children, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  width?: string;
  height?: string;
  bgcolor?: string;
  fontsize?: string;
  onClick?: () => void;
}

const Button = ({
  children,
  width = 'w-24',
  height = 'h-10',
  bgcolor = 'Green',
  fontsize = 'content',
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`${width} ${height} bg-${bgcolor} text-${fontsize} text-white rounded cursor-pointer`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
