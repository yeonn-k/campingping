interface ButtonProps {
  btnText: string;
  width?: string;
  height?: string;
  bgcolor?: string;
  fontsize?: string;
  onClick: () => void;
}

const Button = ({
  btnText,
  width = 'w-24',
  height = 'h-10',
  bgcolor = 'Green',
  fontsize = 'content',
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`${width} ${height} bg-${bgcolor} text-${fontsize} text-white rounded`}
      onClick={onClick}
    >
      {btnText}
    </button>
  );
};

export default Button;
