import Image from 'next/image';

import Magnifier from '@icons/search_gray.svg';

const SearchBar = () => {
  return (
    <div className="w-9/12 h-10 mt-5 rounded-full shadow-shadowCustom flex justify-center items-center text-Gray">
      <Image src={Magnifier} alt="돋보기" width={18} height={18} />
      <button className="outline-none w-9/12 text-center">검색 시작하기</button>
    </div>
  );
};

export default SearchBar;
