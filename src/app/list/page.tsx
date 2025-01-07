'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Category from '@/components/Category/Category';
import Card from '@/components/Card/Card';
import { Camp } from '@/types/Camp';
import SearchBar from '@/components/SearchBar/SearchBar';
import { api } from '@/utils/axios';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import LoadingSpinner from '@/components/Button/LoadingSpinner';
import { useCreateQueryString } from '@/hooks/useCreateQueryString';
import { regionStore } from '@/stores/useRegionState';

const List = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [campingData, setCampingData] = useState<Camp[] | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { nextCursorRef, currentCursor, LIMIT, resetCursor } =
    useInfiniteScroll({
      loadMoreElementRef: loadMoreRef,
    });

  const createQueryString = useCreateQueryString(searchParams);
  const { regionState } = regionStore();

  console.log(regionState);

  const selectedCategory = searchParams.get('category') || '';
  const selectedRegion = regionStore;

  const setSelectedCategory = useCallback(
    (categoryValue: string) => {
      router.push(
        createQueryString('/list', [{ name: 'category', value: categoryValue }])
      );
    },
    [createQueryString, router]
  );

  const fetchCampingData = useCallback(async () => {
    try {
      const apiUrl = createQueryString('/campings/lists', [
        { name: 'limit', value: LIMIT },
        { name: 'cursor', value: currentCursor },
        { name: 'category', value: selectedCategory },
        { name: 'region', value: selectedRegion },
      ]);
      const response = await api.get(apiUrl);
      const camps = response.data.data.result;
      const nextCursor = response.data.data.nextCursor;
      return { camps, nextCursor };
    } catch (error) {
      console.error(error);
      return { camps: [], nextCursor: 0 };
    }
  }, [
    LIMIT,
    createQueryString,
    currentCursor,
    selectedCategory,
    selectedRegion,
  ]);

  useEffect(() => {
    setCampingData([]);
    resetCursor();
  }, [resetCursor, selectedCategory, selectedRegion]);

  useEffect(() => {
    setIsLoading(true);
    fetchCampingData().then(({ camps, nextCursor }) => {
      nextCursorRef.current = nextCursor;
      setCampingData((previous) => {
        const listOfPreviousContentId =
          previous?.map((previousCamp) => previousCamp.contentId) || [];
        const deDuplicatedResults = camps.filter(
          (camp: Camp) => !listOfPreviousContentId.includes(camp.contentId)
        );

        return [...(previous || []), ...deDuplicatedResults];
      });
    });
    setIsLoading(false);
  }, [fetchCampingData, nextCursorRef]);

  const handleCategorySelected = useCallback(
    (categoryValue: string) => {
      setSelectedCategory(categoryValue);
    },
    [setSelectedCategory]
  );
  console.log(campingData);
  return (
    <div className="flex flex-col ">
      <SearchBar />
      <Category
        selectedCategory={selectedCategory}
        onCategorySelected={handleCategorySelected}
      />
      <div className="flex flex-col space-y-8 scroll-smooth p-4 mx-*">
        {campingData?.length ? (
          campingData.map((camp) => (
            <Card
              key={camp.contentId}
              itemId={camp.contentId}
              liked={camp.favorite}
              imgSrc={camp.firstImageUrl}
              name={camp.facltNm ? camp.facltNm : ''}
              address={
                camp.addr1
                  ? camp.addr2
                    ? `${camp.addr1} ${camp.addr2}`
                    : camp.addr1
                  : ''
              }
              description={camp.lineIntro || ''}
            />
          ))
        ) : (
          <p>검색 결과가 없습니다</p>
        )}
      </div>
      <div ref={loadMoreRef} className="h-[100px]">
        {isLoading && <LoadingSpinner />}
      </div>
    </div>
  );
};

export default List;
