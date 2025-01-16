import Image from 'next/image';
import Link from 'next/link';

import Magnifier from '@icons/search_gray.svg';

interface SearchBarProps {
  origin: string;
  category: string | null;
  region: string | null;
}

const SearchBar = ({ origin, category, region }: SearchBarProps) => {
  const query: Record<string, string> = { origin };
  if (category) {
    query['category'] = category;
  }
  if (region) {
    query['region'] = region;
  }

  return (
    <Link
      href={{ pathname: '/search', query }}
      className="w-full h-15 mt-2 mb-3 flex justify-center items-center "
    >
      <div className="w-9/12 h-10 mt-5 rounded-full shadow-shadowCustom flex justify-center items-center text-Gray">
        <Image src={Magnifier} alt="돋보기" width={18} height={18} />
        <button className="outline-none w-9/12 text-center">
          검색 시작하기
        </button>
      </div>
    </Link>
  );
};

export default SearchBar;
