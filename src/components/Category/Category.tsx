import Image from 'next/image';
import { getIconPath } from '@/utils/getIconPath';

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
  return (
    <div className="w-full">
      <div className="flex overflow-x-auto scrollbar-hide whitespace-nowrap scroll-smooth">
        {categories.map((category) => {
          const isSelected =
            selectedCategory === '전체'
              ? category.name === '전체'
              : selectedCategory === category.name;

          return (
            <div
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className={`flex flex-col min-w-max items-center justify-center cursor-pointer px-2 pb-2 rounded-lg transition`}
            >
              <Image
                src={getIconPath(category.iconName, isSelected)}
                alt={category.name}
                width={24}
                height={24}
                quality={5}
              />
              <span
                className={`text-[12px] ${
                  isSelected ? 'text-Green' : 'text-Gray'
                }`}
              >
                {category.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Category;
