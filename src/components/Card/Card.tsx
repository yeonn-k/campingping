import Image from 'next/image';
import myWishIcon from '@icons/liked.svg';
import notMyWishIcon from '@icons/not-liked.svg';
import noImg from '@images/noImg.png';

interface CardProps {
  itemId?: string;
  liked: boolean;
  imgSrc: string | null;
  name: string;
  address: string;
  description: string | null;
}

const Card = ({
  itemId,
  liked,
  imgSrc,
  name,
  address,
  description,
}: CardProps) => {
  return (
    <div className="w-10.5/12 rounded overflow-hidden">
      <div className="relative">
        <Image
          src={imgSrc ? imgSrc : noImg}
          alt="캠핑장 이미지"
          width="100"
          height="67"
          layout="responsive"
          className="rounded"
          quality={30}
        />
        <Image
          src={liked ? myWishIcon : notMyWishIcon}
          alt="위시리스트"
          width={20}
          height={19}
          className="absolute top-3 right-3"
        />
      </div>

      <div className="p-2">
        <p className="text-content pb-1">{name}</p>
        <p className="text-description">{address}</p>
        <p className="text-DarkGray text-description">
          {description ? description : '캠핑장의 정보를 업데이트 중입니다'}
        </p>
      </div>
    </div>
  );
};

export default Card;
