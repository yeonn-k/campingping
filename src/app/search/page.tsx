'use client';

import Image from 'next/image';

import closeIcon from '@icons/close.svg';
import { useRouter, useSearchParams } from 'next/navigation';
import useRegionHandler from '@/hooks/useRegionHandler';
import { useEffect } from 'react';
import { useCreateQueryString } from '@/hooks/useCreateQueryString';

const regions = [
  { fullRegionName: '서울특별시', shortRegionName: '서울시' },
  { fullRegionName: '부산광역시', shortRegionName: '부산시' },
  { fullRegionName: '대구광역시', shortRegionName: '대구시' },
  { fullRegionName: '인천광역시', shortRegionName: '인천시' },
  { fullRegionName: '광주광역시', shortRegionName: '광주시' },
  { fullRegionName: '대전광역시', shortRegionName: '대전시' },
  { fullRegionName: '울산광역시', shortRegionName: '울산시' },
  { fullRegionName: '세종특별자치시', shortRegionName: '세종시' },
  { fullRegionName: '경기도', shortRegionName: '경기도' },
  { fullRegionName: '강원도', shortRegionName: '강원도' },
  { fullRegionName: '충청북도', shortRegionName: '충청북도' },
  { fullRegionName: '충청남도', shortRegionName: '충청남도' },
  { fullRegionName: '전라북도', shortRegionName: '전라북도' },
  { fullRegionName: '전라남도', shortRegionName: '전라남도' },
  { fullRegionName: '경상북도', shortRegionName: '경상북도' },
  { fullRegionName: '경상남도', shortRegionName: '경상남도' },
  { fullRegionName: '제주특별자치도', shortRegionName: '제주도' },
];

const Search = () => {
  const router = useRouter();
  const {
    selectedRegion,
    setSelectedRegion,
    handleUserSelect,
    coloredRegion,
    setColoredRegion,
  } = useRegionHandler();

  const searchParams = useSearchParams();

  const originParam = searchParams.get('origin');
  const categoryParam = searchParams.get('category');
  const regionParam = searchParams.get('region');

  const createQueryString = useCreateQueryString(searchParams);

  useEffect(() => {
    const fullRegionName = regions.find(
      (region) => region.shortRegionName === regionParam
    )?.fullRegionName;

    setColoredRegion(fullRegionName || '');
    setSelectedRegion(regionParam || '');
  }, [regionParam, setSelectedRegion, setColoredRegion]);

  useEffect(() => {
    router.push(
      createQueryString(`/search`, [
        { name: 'category', value: categoryParam },
        { name: 'region', value: selectedRegion },
      ])
    );
  }, [createQueryString, router, categoryParam, selectedRegion, regionParam]);

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
      if (selectedRegion) {
        sessionStorage.setItem('region', selectedRegion);
        router.push(
          createQueryString(`/${originParam}`, [
            { name: 'origin', value: null },
            { name: 'category', value: categoryParam },
            { name: 'region', value: regionParam },
          ])
        );
      }
      if (!selectedRegion) {
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
              className={`flex justify-center items-center border  w-36 h-12 rounded-full ${coloredRegion === fullRegionName ? 'border-Green text-Green' : 'border-LightGray text-Gray'}`}
              onClick={(e) => {
                handleUserSelect(e);
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
