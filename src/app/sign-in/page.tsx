'use client';

import Image from 'next/image';
import { SubmitHandler, useForm } from 'react-hook-form';

import LogoWhite from '@images/campingping_white.svg';
import RegisterBg from '@images/registerBg.jpg';
import SymbolImg from '@images/campingping.png';
import KakaoLogo from '@icons/KakaoTalk_logo.svg';

import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';

interface FormData {
  email: string;
  password: string;
}

const SignIn = () => {
  const { register, handleSubmit, watch } = useForm<FormData>();
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  return (
    <div className="relative flex justify-center items-center w-full">
      <Image
        src={RegisterBg}
        width={100}
        height={100}
        alt="배경이미지"
        className="absolute inset-0 w-full h-full object-cover"
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
          <Button width={'w-10/12'} onClick={() => {}}>
            로그인
          </Button>
        </form>
        <Button width={'w-10/12'} bgcolor={'bg-kakaoYellow'} onClick={() => {}}>
          <div className="flex justify-center">
            <Image src={KakaoLogo} width={27} height={27} alt="kakao" />
            <span className="ml-1">카카오 로그인</span>
          </div>
        </Button>
        <button className="mt-2">회원가입</button>
      </div>
    </div>
  );
};

export default SignIn;
