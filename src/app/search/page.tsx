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
    <div className=" w-full h-screen overflow-hidden sm:flex sm:items-center sm:justify-center ">
      <div className="relative sm:w-[60%] sm:h-[80vh] flex flex-col items-center pb-14 sm:pb-14 sm:border sm:rounded-3xl sm:border-Gree overflow-hidden">
        <div
          className="absolute left-5 top-5 flex justify-center items-center w-8 h-8 sm:w-10 sm:h-10  sm:left-8 sm:top-8 shadow-iconShadow rounded-full "
          onClick={closeSearch}
        >
          <Image src={closeIcon} width={10} height={10} alt="닫기 아이콘" />
        </div>
        <h1 className="mt-12 mb-4 sm:mt-24 sm:mb-9 text-title sm:text-[28px]">
          지역으로 검색해보세요
        </h1>

        <div className="bg-LightGray w-full h-[1px] " />

        <div className="grid grid-cols-[1fr_2fr] px-4 h-[65vh] w-full sm:h-[50vh] min-w-[400px]">
          <div className="w-full h-full gap-2 overflow-scroll scrollbar-hide py-3 grid grid-cols-1 pr-2 place-items-center border-r border-LightGray content-start ">
            {regions.map((regionName) => {
              return (
                <div
                  key={regionName}
                  className={`flex flex-col justify-center items-center border w-full h-12 rounded-full ${coloredRegion === regionName ? 'border-Green text-Green' : 'border-LightGray text-Gray'}`}
                  onClick={(e) => {
                    updateRegion(e, 'region');
                  }}
                >
                  {regionName}
                </div>
              );
            })}
          </div>

          <div className=" overflow-scroll w-[65%] h-full w-full gap-2 grid grid-cols-2 content-start scrollbar-hide py-3 ml-4 pr-5">
            {selectedRegion.map((city) => {
              return (
                <div
                  key={city}
                  className={`flex flex-col justify-center items-center border w-full h-12 rounded-full ${coloredCity === city ? 'border-Green text-Green' : 'border-LightGray text-Gray'}`}
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

        <div className="bg-LightGray w-full h-[1px] mb-3 " />
        <div className="flex justify-center items-center w-full h-full">
          <button
            className="w-3/5 h-14 bg-Green rounded-full text-white mt-2"
            onClick={handleSearch}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
export default Search;
