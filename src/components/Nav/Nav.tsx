'use client';

import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  iconName: string;
  url?: string;
}
const navItems: NavItem[] = [
  { name: '검색', iconName: 'search', url: '/list' },
  { name: '지도', iconName: 'map', url: '/map' },
  { name: '커뮤니티', iconName: 'community', url: '/community' },
  { name: '마이페이지', iconName: 'mypage', url: '/my-page' },
];

const Nav = () => {
  const router = useRouter();
  const pathname = usePathname();
  // const user = useStore((state) => state.user); // 차후에 스토어에서 가지고 올것
  const user = false; // user log out 상태 가정

  const handleNavClick = (navItem: NavItem) => {
    if (navItem.url) {
      router.push(navItem.url);
    }
  };

  return (
    <div className="flex w-full z-zNav justify-center sticky bottom-0 left-0 z-zNav">
      <div className="flex w-full justify-around">
        {navItems.map((navItem) => (
          <div
            key={navItem.name}
            onClick={() => handleNavClick(navItem)}
            className={`flex flex-col width-[80px] min-w-max items-center justify-center cursor-pointer p-1 rounded-lg transition`}
          >
            <Image
              src={`/icons/nav/${navItem.iconName}_${pathname === navItem.url ? 'green' : 'gray'}.png`}
              alt={navItem.name}
              width={24}
              height={24}
            />
            <span
              className={`text-[10px] ${pathname === navItem.url ? 'text-Green' : 'text-Gray'}`}
            >
              {navItem.name}
            </span>
          </div>
        ))}

        {user ? (
          <div
            key="logout"
            onClick={() => {
              router.push('/sign-out');
            }}
            className={`flex flex-col width-[80px] min-w-max items-center justify-center cursor-pointer p-1 rounded-lg transition`}
          >
            <Image
              src={`/icons/nav/logout_gray.png`}
              alt="로그아웃"
              width={24}
              height={24}
            />
            <span className="text-[10px] text-Gray">로그아웃</span>
          </div>
        ) : (
          <div
            key="login"
            onClick={() => {
              router.push('/sign-in');
            }}
            className={`flex flex-col width-[80px] min-w-max items-center justify-center cursor-pointer p-1 rounded-lg transition`}
          >
            <Image
              src={`/icons/nav/login_${pathname === '/login' ? 'green' : 'gray'}.png`}
              alt="로그인"
              width={24}
              height={24}
            />
            <span
              className={`text-[10px] ${pathname === '/login' ? 'text-Green' : 'text-Gray'}`}
            >
              로그인
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
