import Image from 'next/image';
import logo from '@images/campingping.png';

const DefaultImg = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-52 border-2 border-Green rounded-md">
      <Image src={logo} alt="logo" width={70} />
      <p className="w-full text-center">
        아직 캠핑장 사진이 준비되지 않았어요 !
      </p>
    </div>
  );
};

export default DefaultImg;
