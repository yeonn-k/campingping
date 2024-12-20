import Image from 'next/image';
import { useState } from 'react';

interface NavItem {
  name: string;
  iconName: string;
  url?: string;
}

const Nav = () => {
  const [selectedNavName, setSelectedNavName] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const navItems: NavItem[] = [
    { name: '검색', iconName: 'search', url: '/list' },
    { name: '지도', iconName: 'map', url: '/map' },
    { name: '오픈챗', iconName: 'chat', url: '/community' },
    { name: '마이페이지', iconName: 'user', url: '/my-page' },
    isLoggedIn
      ? { name: '로그아웃', iconName: 'logout' }
      : { name: '로그인', iconName: 'login', url: '/log-in' },
  ];

  const handleNavClick = (navItem: NavItem) => {
    setSelectedNavName(navItem.name);

    if (navItem.name === '로그아웃') {
      // Handle logout logic
      setIsLoggedIn(false);
      console.log('Logged out');
    } else if (navItem.name === '로그인') {
      // Handle login navigation
      setIsLoggedIn(true);
      console.log('Logged in');
    }
  };

  const getIconPath = (iconName: string, isActive: boolean): string => {
    return `/icons/nav/${iconName}_${isActive ? 'green' : 'gray'}.png`;
  };

  return (
    <div className="flex justify-around absolute bottom-0 left-0 w-full">
      {navItems.map((navItem) => (
        <div
          key={navItem.name}
          onClick={() => handleNavClick(navItem)}
          className={`flex flex-col min-w-max items-center justify-center cursor-pointer p-2 rounded-lg transition`}
        >
          <Image
            src={getIconPath(
              navItem.iconName,
              selectedNavName === navItem.name
            )}
            alt={navItem.name}
            width={24}
            height={24}
          />
          <span
            className={`text-[12px] ${
              selectedNavName === navItem.name ? 'text-Green' : 'text-Gray'
            }`}
          >
            {navItem.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Nav;
