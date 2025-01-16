import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { updateQueryString } from '@/utils/updateQueryString';

const useCategory = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const category = searchParams.get('category');
    setSelectedCategory(category || '전체');
  }, [searchParams]);

  const setSelectedCategoryValue = useCallback(
    (category: string) => {
      if (category === '전체') {
        updateQueryString({ category: null });
      } else {
        updateQueryString({ category });
      }
    },
    [pathname]
  );

  const handleCategorySelected = useCallback(
    (category: string) => {
      setSelectedCategoryValue(category);
      setSelectedCategory(category);
    },
    [setSelectedCategoryValue]
  );

  return {
    selectedCategory,
    handleCategorySelected,
    setSelectedCategory,
  };
};

export default useCategory;
