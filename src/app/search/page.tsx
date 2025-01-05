'use client';

import Image from 'next/image';

import closeIcon from '@icons/close.svg';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useCreateQueryString } from '@/hooks/useCreateQueryString';
import { regionStore } from '@/stores/useRegionState';
import { regions } from '@/utils/regions';

const Search = () => {
  const router = useRouter();

  const { regionState, coloredState, setRegionState } = regionStore();

  const searchParams = useSearchParams();

  const originParam = searchParams.get('origin');
  const categoryParam = searchParams.get('category');
  const regionParam = searchParams.get('region');

  const createQueryString = useCreateQueryString(searchParams);

  useEffect(() => {
    setRegionState(regionParam || null);
  }, [regionParam, setRegionState]);

  useEffect(() => {
    router.push(
      createQueryString(`/search`, [
        { name: 'category', value: categoryParam },
        { name: 'region', value: regionState },
      ])
    );
  }, [createQueryString, router, categoryParam, regionState, regionParam]);

  const closeSearch = () => {
    router.push(
      createQueryString(`/${originParam}`, [
        { name: 'origin', value: null },
        { name: 'category', value: categoryParam },
        { name: 'region', value: null },
      ])
    );
  };

  const handleSearch = async () => {
    try {
      if (regionState) {
        sessionStorage.setItem('region', regionState);
        router.push(
          createQueryString(`/${originParam}`, [
            { name: 'origin', value: null },
            { name: 'category', value: categoryParam },
            { name: 'region', value: regionParam },
          ])
        );
      }
      if (!regionState) {
        closeSearch();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      <div
        className="absolute left-5 top-5 flex justify-center items-center w-9 h-9 shadow-iconShadow rounded-full"
        onClick={closeSearch}
      >
        <Image src={closeIcon} width={10} height={10} alt="닫기 아이콘" />
      </div>
      <h1 className="mt-20 mb-7 text-title">지역으로 검색해보세요</h1>
      <div className="bg-LightGray w-full h-[1px] mb-2" />
      <div className="grid grid-cols-2 w-10/12 h-2/3 place-items-center">
        {regions.map(({ fullRegionName }) => {
          return (
            <div
              key={fullRegionName}
              className={`flex justify-center items-center border  w-36 h-12 rounded-full ${coloredState === fullRegionName ? 'border-Green text-Green' : 'border-LightGray text-Gray'}`}
              onClick={(e) => {
                setRegionState(e);
              }}
            >
              {fullRegionName}
            </div>
          );
        })}
      </div>
      <div className="bg-LightGray w-full h-[1px] mt-3" />
      <button
        className="w-3/5 h-10 bg-Green rounded-full text-white mt-5"
        onClick={handleSearch}
      >
        확인
      </button>
    </div>
  );
};

export default Search;
