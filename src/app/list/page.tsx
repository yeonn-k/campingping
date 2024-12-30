'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Category from '@/components/Category/Category';
import Card from '@/components/Card/Card';

import Camp from '@/assets/types/Camp';

const List = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || '전체'
  );
  const [campingData, setCampingData] = useState<Camp[] | null>(null);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const fetchCampingData = useCallback(
    async (page: number) => {
      try {
        const apiUrl =
          selectedCategory === '전체'
            ? `http://kdt-react-node-1-team03.elicecoding.com:3000/campings/lists?limit=10&cursor=${page}`
            : `http://kdt-react-node-1-team03.elicecoding.com:3000/campings/lists?limit=10&cursor=${page}&category=${selectedCategory}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error); // You can replace this with a logging function if needed
      }
    },
    [selectedCategory]
  );

  const loadMore = async () => {
    const newPage = page + 1;
    const newData = await fetchCampingData(newPage);
    setCampingData((prevData) => [...(prevData || []), ...newData]);
    setPage(newPage);
  };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        loadMore();
      }
    },
    [page]
  );

  useEffect(() => {
    if (selectedCategory === '전체') {
      router.push(`/list`);
    } else {
      router.push(`/list?${createQueryString('category', selectedCategory)}`);
    }
  }, [createQueryString, router, selectedCategory]);

  useEffect(() => {
    if (selectedCategory === '전체') {
      router.push(`/list`);
    } else {
      router.push(`/list?${createQueryString('category', selectedCategory)}`);
    }
  }, [createQueryString, router, selectedCategory]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCampingData(page);
      setCampingData(data);
    };
    fetchData();
  }, [fetchCampingData, page]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: '20px',
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observerRef.current?.unobserve(loadMoreRef.current);
      }
    };
  }, [handleObserver]);

  const handleCategorySelected = useCallback((categoryName: string) => {
    setSelectedCategory(categoryName);
  }, []);

  return (
    <div className="flex flex-col grow">
      <Category
        selectedCategory={selectedCategory}
        onCategorySelected={handleCategorySelected}
      />
      <div className="flex justify-center h-[700px] p-4">
        <div className="space-y-8 overflow-y-auto scroll-smooth">
          {campingData?.length ? (
            campingData.map((camp) => (
              <Card
                key={camp.id}
                itemId={camp.contentId}
                liked={false}
                imgSrc={camp.images?.url || ''}
                name={camp.factDivNm}
                address={`${camp.addr1} ${camp.addr2}` || ''}
                description={camp.lineIntro || ''}
              />
            ))
          ) : (
            <p>검색 결과가 없습니다</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default List;
