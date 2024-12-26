import Image from 'next/image';

import Magnifier from '@icons/search_gray.svg';
import Input from '../Input/Input';

const SearchBar = () => {
  return (
    <div className="w-9/12 h-11 mt-6 rounded-full shadow-shadowCustom flex justify-center items-center text-Gray">
      <Image src={Magnifier} alt="돋보기" width={18} height={18} />
      <button className="outline-none w-9/12 text-center">검색 시작하기</button>
    </div>
  );
};

export default SearchBar;
