import Image from 'next/image';

type DefaultImgProps = {
  src?: string;
  alt?: string;
  type?: 'user' | 'camp' | 'default';
  width?: number;
  height?: number;
  className?: string;
};

const DefaultImg: React.FC<DefaultImgProps> = ({
  src,
  alt = 'Image',
  type = 'default',
  width = 100,
  height = 100,
  className = '',
  ...props
}) => {
  const defaultImages: Record<'user' | 'camp' | 'default', string> = {
    user: '/path/to/user/default/image.png',
    camp: '/image/campingping.png',
    default: '/path/to/general/default/image.png',
  };

  const defaultImageSrc = defaultImages[type];

  return (
    <Image
      src={src || defaultImageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      {...props}
    />
  );
};

export default DefaultImg;
