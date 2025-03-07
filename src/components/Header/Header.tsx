import logo from '@images/campingping_white.svg';
import Image from 'next/image';
import Link from 'next/link';
const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 hidden sm:flex w-full flex justify-center items-center h-14 bg-Green ">
      <Link href={'/list'}>
        <Image src={logo} width={140} height={50} alt="campingping" />
      </Link>
    </div>
  );
};

export default Header;
