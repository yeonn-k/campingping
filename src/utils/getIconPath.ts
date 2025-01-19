export const getIconPath = (iconName: string, isActive: boolean): string => {
  return `/icons/category/${iconName}_${isActive ? 'green' : 'gray'}.png`;
};
