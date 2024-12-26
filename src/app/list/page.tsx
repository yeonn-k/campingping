'use client';

import { useCallback, useEffect, useState } from 'react';
import Category from '@/components/Category/Category';
import Nav from '@/components/Nav/Nav';
import { useSearchParams } from 'next/navigation';
// import Card from '@/components/Card/Card';
import { useRouter } from 'next/navigation';

const List = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || '전체'
  );

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (selectedCategory === '전체') {
      router.push(`/list`);
    } else {
      router.push(`/list?${createQueryString('category', selectedCategory)}`);
    }
  }, [createQueryString, router, selectedCategory]);

  const handleCategorySelected = useCallback((categoryName: string) => {
    setSelectedCategory(categoryName);
  }, []);

  return (
    <div>
      <Category
        selectedCategory={selectedCategory}
        onCategorySelected={handleCategorySelected}
      />

      <Nav />
    </div>
  );
};

export default List;
