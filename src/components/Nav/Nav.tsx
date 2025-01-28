'use client';

import { userStore } from '@/stores/userState';
import { api } from '@/utils/axios';
import Image from 'next/image';
import signInIcon from '@icons/nav/login_gray.png';
import signOutIcon from '@icons/nav/logout_gray.png';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import { chattingStore } from '@/stores/chattingState';
import { regionStore } from '@/stores/regionState';

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

  const { userState, userEmail, setUserState } = userStore();
  const { setChatState, setChatRoomId, setChatNick } = chattingStore();
  const { setColoredState } = regionStore();

  const handleNavClick = (navItem: NavItem) => {
    if (navItem.url) {
      if (navItem.url === '/my-page' && !userState) {
        toast.error('로그인이 필요한 페이지에요');
        router.replace('/sign-in');
      } else {
        router.push(navItem.url);
      }
      setChatState(false);
      setChatRoomId(null);
      setChatNick('');
      setColoredState(null);
    }
  };

  const signOut = async () => {
    try {
      let res;

      if (userEmail && userEmail.includes('kakao')) {
        res = await api.get('/auth/kakao-logout');
      } else {
        res = await api.post('/auth/logout');
      }
      if (res.status === 200) {
        setUserState(null);
        setChatState(false);
        setChatRoomId(null);
        setChatNick('');
        setColoredState(null);
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <div className="fixed bottom-0 w-full max-w-[450px] bg-white py-1 z-zNav">
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
        {userState ? (
          <div
            key="logout"
            onClick={() => {
              router.push('/list');
            }}
            className={`flex flex-col width-[80px] min-w-max items-center justify-center cursor-pointer p-1 rounded-lg transition`}
          >
            <Image
              src={signOutIcon}
              alt="로그아웃"
              width={24}
              height={24}
              onClick={signOut}
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
            <Image src={signInIcon} alt="로그인" width={24} height={24} />
            <span className={`text-[10px] text-Gray`}>로그인</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
