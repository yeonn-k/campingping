'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Category from '@/components/Category/Category';
import Card from '@/components/Card/Card';
import { Camp } from '@/types/Camp';
import SearchBar from '@/components/SearchBar/SearchBar';
import { api } from '@/utils/axios';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import LoadingSpinner from '@/components/Button/LoadingSpinner';
import { createApiUrl } from '@/utils/createApiUrl';

import useCategory from '@/hooks/useCategory';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';
import { useSearchParams } from 'next/navigation';

const List = () => {
  const { selectedCategoryValue, selectedCategory, handleCategorySelected } =
    useCategory();
  const [regionQuery, setRegionQuery] = useState<string | null>(null);

  const [campingData, setCampingData] = useState<Camp[] | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { nextCursorRef, currentCursor, LIMIT, resetCursor } =
    useInfiniteScroll({
      loadMoreElementRef: loadMoreRef,
    });

  const scrollRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      setRegionQuery(searchParams.get('region'));
    }
  }, [searchParams]);

  const fetchCampingData = useCallback(async () => {
    try {
      const apiUrl = createApiUrl('/campings/lists', [
        { name: 'limit', value: LIMIT },
        { name: 'cursor', value: currentCursor },
        { name: 'category', value: selectedCategoryValue },
        { name: 'region', value: regionQuery },
      ]);

      const response = await api.get(apiUrl);
      const camps = response.data.data.result;
      const nextCursor = response.data.data.nextCursor;
      return { camps, nextCursor };
    } catch (error) {
      console.error(error);
      return { camps: [], nextCursor: 0 };
    }
  }, [LIMIT, currentCursor, selectedCategoryValue, regionQuery]);

  useEffect(() => {
    setCampingData([]);
    resetCursor();
  }, [resetCursor, selectedCategoryValue, regionQuery]);

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

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="w-full flex flex-col pb-20 h-screen" ref={scrollRef}>
        <SearchBar
          origin="list"
          category={selectedCategoryValue}
          region={regionQuery}
        />
        <Category
          selectedCategory={selectedCategory}
          onCategorySelected={handleCategorySelected}
        />
        <div className="flex flex-col space-y-8  p-4 mx-* pb-20 ">
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

        <ScrollToTop scrollRef={scrollRef} />
      </div>
    </Suspense>
  );
};

export default List;
