import Image from 'next/image';

import Magnifier from '@icons/search_gray.svg';
import Link from 'next/link';
import { useCreateQueryString } from '@/hooks/useCreateQueryString';
import { useSearchParams } from 'next/navigation';

const SearchBar = ({
  origin,
  category,
  region,
}: {
  origin?: string;
  category?: string;
  region?: string;
}) => {
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString(searchParams);

  return (
    <Link
      href={createQueryString('/search', [
        {
          name: 'origin',
          value: origin,
        },
        { name: 'category', value: category },
        { name: 'region', value: region },
      ])}
      className="w-full h-15 mt-2 flex justify-center items-center"
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
