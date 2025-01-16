import Image from 'next/image';
import { useRef } from 'react';

interface Category {
  name: string;
  iconName: string;
}

interface CategoryProps {
  selectedCategory: string;
  onCategorySelected: (selectedCategoryName: string) => void;
}

export const categories: Category[] = [
  { name: '전체', iconName: 'all' },
  { name: '일반야영장', iconName: 'tent' },
  { name: '자동차야영장', iconName: 'car' },
  { name: '카라반', iconName: 'caravan' },
  { name: '글램핑', iconName: 'glamping' },
  { name: '캠프닉', iconName: 'campnick' },
  { name: '산', iconName: 'mountain' },
  { name: '숲', iconName: 'forest' },
  { name: '계곡', iconName: 'valley' },
  { name: '바다', iconName: 'sea' },
  { name: '해변', iconName: 'beach' },
  { name: '섬', iconName: 'island' },
  { name: '강', iconName: 'river' },
  { name: '호수', iconName: 'lake' },
  { name: '도시', iconName: 'city' },
  { name: '반려동물', iconName: 'pet' },
];

const Category = ({
  selectedCategory,
  onCategorySelected: handleCategoryClick,
}: CategoryProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const getIconPath = (iconName: string, isActive: boolean): string => {
    return `/icons/category/${iconName}_${isActive ? 'green' : 'gray'}.png`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = x - startX.current;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const x = e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = x - startX.current;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div className="w-[390px]">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto whitespace-nowrap scroll-smooth p-2"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {categories.map((category) => (
          <div
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            className={`flex flex-col min-w-max items-center justify-center cursor-pointer p-2 rounded-lg transition`}
          >
            <Image
              src={getIconPath(
                category.iconName,
                selectedCategory === category.name
              )}
              alt={category.name}
              width={24}
              height={24}
            />
            <span
              className={`text-[12px] ${
                selectedCategory === category.name ? 'text-Green' : 'text-Gray'
              }`}
            >
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
