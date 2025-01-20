import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { updateQueryString } from '@/utils/updateQueryString';

const useCategory = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const selectedCategoryValue =
    selectedCategory === '전체' ? null : selectedCategory;

  useEffect(() => {
    const category = searchParams.get('category') || '전체';
    setSelectedCategory(category);
  }, [searchParams]);

  const setSelectedCategoryValue = useCallback(
    (category: string) => {
      updateQueryString({ category: category === '전체' ? null : category });
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
    selectedCategoryValue,
  };
};

export default useCategory;
