import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useCreateQueryString } from './useCreateQueryString';

const useCategory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString(searchParams);

  const [selectedCategory, setSelectedCategory] = useState('전체');

  useEffect(() => {
    const category = searchParams.get('category');
    setSelectedCategory(category || '전체');
  }, [searchParams]);

  const setSelectedCategoryValue = useCallback(
    (categoryValue: string) => {
      const queryString = createQueryString('/', [
        { name: 'category', value: categoryValue },
      ]);
      router.push(queryString);
    },
    [createQueryString, router]
  );

  const handleCategorySelected = useCallback(
    (categoryValue: string) => {
      setSelectedCategoryValue(categoryValue);
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
