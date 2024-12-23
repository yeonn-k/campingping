import Image from 'next/image';
import myWishIcon from '@icons/liked.svg';
import notMyWishIcon from '@icons/not-liked.svg';

interface CardProps {
  itemId: string;
  liked: boolean;
  imgSrc: string;
  name: string;
  address: string;
  description: string;
}

const Card = ({
  itemId,
  liked = false,
  imgSrc,
  name,
  address,
  description,
}: CardProps) => {
  return (
    <div className="w-10.5/12 rounded overflow-hidden">
      <div className="relative">
        <Image
          // src={imgSrc}
          src="https://gocamping.or.kr/upload/camp/100287/thumb/thumb_720_5425wesMNlmaUJnDtboHnRcE.jpg"
          alt="캠핑장 이미지"
          width="100"
          height="67"
          layout="responsive"
          className="rounded"
          quality={40}
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
        <p className="text-content pb-1">변산반도국립공원 고사포 야영장</p>
        {/* <p className="text-content pb-1">{name}</p> */}
        <p className="text-description">강원 정선군 신동읍 동강로 916-212</p>
        {/* <p className="text-description">{address}</p> */}
        <p className="text-DarkGray text-description">
          운해와 야경이 일품인 휴양림속 야영장
          {/* {description} */}
        </p>
      </div>
    </div>
  );
};

export default Card;
