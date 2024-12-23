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
  { name: '오픈챗', iconName: 'chat', url: '/community' },
  { name: '마이페이지', iconName: 'user', url: '/my-page' },
  { name: '로그아웃', iconName: 'logout' },
  { name: '로그인', iconName: 'login', url: '/log-in' },
];

const Nav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (navItem: NavItem) => {
    if (navItem.url) {
      router.push(navItem.url);
    }
  };

  return (
    <div className="flex justify-around absolute bottom-0 left-0 w-full">
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
    </div>
  );
};

export default Nav;
