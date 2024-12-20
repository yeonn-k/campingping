'use client';

import { useCallback } from 'react';
import Category from '@/components/Category/Category';
import Nav from '@/components/Nav/Nav';

const List = () => {
  const handleCategorySelected = useCallback((categoryName: string) => {
    console.log('category selected', categoryName);
  }, []);

  return (
    <div>
      <Category onCategorySelected={handleCategorySelected} />
      <Nav />
    </div>
  );
};

export default List;
