'use client';

// import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';

import { userStore } from '@/stores/userState';

import LogoWhite from '@images/campingping_white.svg';
import RegisterBg from '@images/registerBg.jpg';
import SymbolImg from '@images/campingping.png';
import KakaoLogo from '@icons/KakaoTalk_logo.svg';

import { api } from '@/utils/axios';

interface FormData {
  email: string;
  password: string;
}

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const SignIn = () => {
  const router = useRouter();
  const { setUserState } = userStore();
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const { email, password } = data;

    if (!email || !password) {
      toast.error('이메일과 비밀번호를 모두 입력해주세요');
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error('올바른 이메일을 입력해주세요');
    }

    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      if (res.status === 200) {
        setUserState(email);
        router.push('/list');
      } else {
        toast.error('이메일 또는 비밀번호가 잘못되었습니다.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const kakaoSignIn = async () => {
    try {
      const res = await api.get('/auth/kakao-login');

      if (res.status === 200) {
        console.log(res);
        setUserState(res.data.email);
        router.push('/list');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const moveToSignUp = () => {
    router.push('/sign-up');
  };
  return (
    <div className="relative flex justify-center items-center w-full">
      <Image
        src={RegisterBg}
        width={100}
        height={100}
        alt="배경이미지"
        className="absolute inset-0 w-full h-full object-cover"
        quality={60}
      />
      <Image
        src={LogoWhite}
        width={200}
        height={50}
        alt="logo"
        priority
        className="absolute top-36"
      />
      <div className="absolute bg-white w-[346px] h-[494px] rounded-lg flex justify-center items-center flex-col">
        <Image
          src={SymbolImg}
          width={110}
          height={110}
          quality={100}
          alt="심볼 이미지"
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center mb-3"
        >
          <div className="mb-6 w-10/12">
            이메일
            <Input
              placeholder="이메일을 입력해주세요"
              type="email"
              {...register('email')}
            />
          </div>
          <div className="mb-6 w-10/12">
            비밀번호
            <Input
              placeholder="비밀번호를 입력해주세요"
              type="password"
              {...register('password')}
            />
          </div>
          <Button width={'w-10/12'}>로그인</Button>
        </form>
        {/* <Link href={`${API_URL}/auth/kakao-login`} className="w-10/12"> */}
        <Button
          width={'w-10/12'}
          bgcolor={'bg-kakaoYellow'}
          onClick={kakaoSignIn}
        >
          <div className="flex justify-center">
            <Image src={KakaoLogo} width={27} height={27} alt="kakao" />
            <span className="ml-1">카카오 로그인</span>
          </div>
        </Button>
        {/* </Link> */}
        <button className="mt-2" onClick={moveToSignUp}>
          회원가입
        </button>
      </div>
    </div>
  );
};

export default SignIn;
