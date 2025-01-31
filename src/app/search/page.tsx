'use client';

import Image from 'next/image';

import closeIcon from '@icons/close.svg';

import { useRouter } from 'next/navigation';
import { useRegionSearch } from '@/hooks/useRegionSearch';
import { regionStore } from '@/stores/regionState';
import { useEffect, useState } from 'react';

import { regions, regionsWithDistricts } from 'public/data/region';

const Search = () => {
  const router = useRouter();
  const { updateRegion } = useRegionSearch();

  const { coloredRegion, coloredCity } = regionStore();
  const [originPath, setOriginPath] = useState<string | null>('map');
  const [query, setQuery] = useState<string | null>(null);
  const selectedRegion: string[] = coloredRegion
    ? regionsWithDistricts[coloredRegion]
    : [];

  const closeSearch = () => {
    router.back();
  };

  useEffect(() => {
    const currentQuery = new URLSearchParams(window.location.search);
    const origin = currentQuery.get('origin');
    if (origin && origin !== 'detail') {
      setOriginPath(origin);
    }
    currentQuery.delete('origin');

    const updatedQuery = currentQuery.toString();
    setQuery(updatedQuery);
  }, [updateRegion]);

  const handleSearch = async () => {
    try {
      router.push(`/${originPath}?${query || ''}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center pb-14">
      <div
        className="absolute left-5 top-5 flex justify-center items-center w-8 h-8 shadow-iconShadow rounded-full"
        onClick={closeSearch}
      >
        <Image src={closeIcon} width={10} height={10} alt="닫기 아이콘" />
      </div>
      <h1 className="mt-12 mb-4 text-title">지역으로 검색해보세요</h1>

      <div className="bg-LightGray w-full h-[1px] " />

      <div className="flex space-around px-4  gap-2 h-[70%]">
        <div className="w-[35%] h-full gap-2 flex flex-wrap overflow-scroll scrollbar-hide py-3">
          {regions.map((regionName) => {
            return (
              <div
                key={regionName}
                className={`flex flex-col justify-center items-center border w-36 h-12 rounded-full ${coloredRegion === regionName ? 'border-Green text-Green' : 'border-LightGray text-Gray'}`}
                onClick={(e) => {
                  updateRegion(e, 'region');
                }}
              >
                {regionName}
              </div>
            );
          })}
        </div>

        <div className="h-full w-[1px] bg-LightGray" />

        <div className="overflow-scroll w-[65%] h-full gap-2 flex flex-wrap scrollbar-hide py-3">
          {selectedRegion.map((city) => {
            return (
              <div
                key={city}
                className={`flex flex-col justify-center items-center border w-[45%] h-12 rounded-full ${coloredCity === city ? 'border-Green text-Green' : 'border-LightGray text-Gray'}`}
                onClick={(e) => {
                  updateRegion(e, 'city');
                }}
              >
                {city}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-LightGray w-full h-[1px] mb-4" />
      <button
        className="w-3/5 h-12 bg-Green rounded-full text-white mt-5"
        onClick={handleSearch}
      >
        확인
      </button>
    </div>
  );
};
export default Search;

//   <div className="grid grid-cols-2 w-10/12 h-2/3 place-items-center">
//
//   </div>
