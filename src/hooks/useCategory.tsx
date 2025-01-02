import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const useCategory = () => {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const handleCategorySelected = useCallback((categoryName: string) => {
    setSelectedCategory(categoryName);
  }, []);

  return { selectedCategory, handleCategorySelected };
};

export default useCategory;
