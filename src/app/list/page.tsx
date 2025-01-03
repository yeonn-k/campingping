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

const List = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [campingData, setCampingData] = useState<Camp[] | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { nextCursorRef, currentCursor, LIMIT } = useInfiniteScroll({
    loadMoreElementRef: loadMoreRef,
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const selectedCategory = searchParams.get('category');

  const setSelectedCategoryValue = (categoryValue: string) => {
    router.push(`/list?${createQueryString('category', categoryValue)}`);
  };

  const fetchCampingData = useCallback(async () => {
    try {
      const apiUrl = `/campings/lists?limit=${LIMIT}&cursor=${currentCursor}${selectedCategory ? `&category=${selectedCategory}` : ''}`;
      const response = await api.get(apiUrl);
      const camps = response.data.data.result;
      const nextCursor = response.data.data.nextCursor;
      return { camps, nextCursor };
    } catch (error) {
      console.error(error);
      return { camps: [], nextCursor: 0 };
    }
  }, [LIMIT, currentCursor, selectedCategory]);

  useEffect(() => {
    setIsLoading(true);
    fetchCampingData().then(({ camps, nextCursor }) => {
      nextCursorRef.current = nextCursor;
      setCampingData((previous) => {
        const listOfPreviousContentId =
          previous?.map((previousCamp) => previousCamp.contentId) || [];
        const results = camps.filter(
          (camp) => !listOfPreviousContentId.includes(camp.contentId)
        );

        return [...(previous || []), ...results];
      });
    });
    setIsLoading(false);
  }, [fetchCampingData, nextCursorRef]);

  const handleCategorySelected = useCallback(
    (categoryValue: string) => {
      setSelectedCategoryValue(categoryValue);
    },
    [setSelectedCategoryValue]
  );

  return (
    <div className="flex flex-col grow">
      <SearchBar />
      <Category
        selectedCategory={selectedCategory}
        onCategorySelected={handleCategorySelected}
      />
      <div className="flex items-center align-center p-4">
        <div className="flex flex-col items-center space-x-4 space-y-8 scroll-smooth mx-*">
          {campingData?.length ? (
            campingData.map((camp) => (
              <Card
                key={camp.id}
                itemId={camp.contentId}
                liked={false}
                imgSrc={camp.fistImgeUrl}
                name={camp.facltNm}
                address={`${camp.addr1} ${camp.addr2}` || ''}
                description={camp.lineIntro || ''}
              />
            ))
          ) : (
            <p>검색 결과가 없습니다</p>
          )}
        </div>
      </div>
      <div
        ref={loadMoreRef}
        style={{ height: '20px', backgroundColor: 'red' }}
      />
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default List;
