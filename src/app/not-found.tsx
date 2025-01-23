import Image from 'next/image';
import logo from '@images/campingping.png';

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center ">
      <Image src={logo} alt="symbol" width={60} height={60} priority />
      <p>찾으시는 페이지가 존재하지 않습니다</p>
    </div>
  );
};

export default NotFound;
