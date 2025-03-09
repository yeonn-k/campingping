'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Category from '@/components/Category/Category';
import Card from '@/components/Card/Card';
import { Camp } from '@/types/Camp';
import SearchBar from '@/components/SearchBar/SearchBar';
import { api } from '@/utils/axios';

import { createApiUrl } from '@/utils/createApiUrl';

import useCategory from '@/hooks/useCategory';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header/Header';

const LIMIT = 21;

const List = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { selectedCategoryValue, selectedCategory, handleCategorySelected } =
    useCategory();
  const [regionQuery, setRegionQuery] = useState<string | null>(null);
  const [cityQuery, setCityQuery] = useState<string | null>(null);

  const [campingData, setCampingData] = useState<Camp[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const currentRegionQuery = searchParams.get('region');
    const currentCityQuery = searchParams.get('city');
    setRegionQuery(currentRegionQuery);
    setCityQuery(currentCityQuery);
  }, [searchParams]);

  const fetchCampingData = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const apiUrl = createApiUrl('/campings/lists', [
        { name: 'limit', value: LIMIT },
        { name: 'cursor', value: nextCursor },
        { name: 'category', value: selectedCategoryValue },
      ]);

      const response = await api.get(apiUrl);

      const data = response.data.data.result;
      if (response.data.data.nextCursor === null) {
        setHasMore(false);
      } else {
        setHasMore(true);
        setNextCursor(response.data.data.nextCursor);
      }

      setCampingData((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = data.filter((item: Camp) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [LIMIT, nextCursor, selectedCategoryValue, regionQuery, cityQuery]);

  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || !hasMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            fetchCampingData();
          }
        },
        { threshold: 0.4 }
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoading, hasMore, fetchCampingData]
  );

  useEffect(() => {
    const refreshData = async () => {
      setCampingData([]);
      await fetchCampingData();
    };

    refreshData();
  }, [selectedCategoryValue, regionQuery, cityQuery]);
  return (
    <>
      <Header />
      <div className="w-full flex flex-col pb-20 h-screen pt-11 sm:pt-14">
        <SearchBar category={selectedCategoryValue} region={regionQuery} />

        <Category
          selectedCategory={selectedCategory}
          onCategorySelected={handleCategorySelected}
        />

        <div
          className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 pb-20 overflow-auto"
          ref={scrollRef}
        >
          {campingData?.length ? (
            campingData.map((camp, idx) => (
              <Card
                ref={idx === campingData.length - 1 ? lastItemRef : undefined}
                key={camp.contentId}
                contentId={camp.contentId}
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

        <ScrollToTop scrollRef={scrollRef} />
      </div>
    </>
  );
};

export default List;
