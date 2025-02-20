import Image from 'next/image';
import Link from 'next/link';

import myWishIcon from '@icons/liked.svg';
import notMyWishIcon from '@icons/not-liked.svg';
import DefaultImg from '../DefaultImg/DefaultImg';

import useWishlist from '@/hooks/useWishlist';
import { useState } from 'react';

interface CardProps {
  contentId: string;
  liked: boolean;
  imgSrc: string | null;
  name: string;
  address: string;
  description: string | null;
}

const Card = ({
  contentId,
  liked: initialLiked,
  imgSrc,
  name,
  address,
  description,
}: CardProps) => {
  const { addOrRemoveWishlist } = useWishlist();
  const [liked, setLiked] = useState(initialLiked);

  const handleWishlist = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const newLikedState = !liked;
    setLiked(newLikedState);

    addOrRemoveWishlist({ contentId, status: newLikedState });
  };
  return (
    <Link href={`/list/${contentId}`} className="w-full flex justify-center">
      <div className="w-10.5/12 rounded overflow-hidden">
        <div className="relative w-full h-56">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt="캠핑장 이미지"
              fill
              className="rounded object-cover"
              quality={60}
            />
          ) : (
            <DefaultImg />
          )}

          <Image
            src={liked ? myWishIcon : notMyWishIcon}
            alt="위시리스트"
            width={20}
            height={19}
            className="absolute top-3 right-3"
            onClick={handleWishlist}
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
    </Link>
  );
};

export default Card;
