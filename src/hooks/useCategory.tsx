import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const useCategory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('전체');

  useEffect(() => {
    const category = searchParams.get('category');
    setSelectedCategory(category || '전체');
  }, [searchParams]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!value) {
        params.delete(name);
      } else {
        params.set(name, value);
        return params.toString();
      }
      return params.toString();
    },
    [searchParams]
  );

  const setSelectedCategoryValue = (categoryValue: string) => {
    router.push(`/map?${createQueryString('category', categoryValue)}`);
  };

  const handleCategorySelected = useCallback(
    (categoryValue: string) => {
      setSelectedCategoryValue(categoryValue);
    },
    [setSelectedCategoryValue]
  );

  return { selectedCategory, handleCategorySelected, setSelectedCategory };
};

export default useCategory;
