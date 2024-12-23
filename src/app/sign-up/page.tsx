'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';

import Input from '@/components/Input/Input';

import RegisterBg from '@images/registerBg.jpg';
import LogoWhite from '@images/campingping_white.svg';
import Button from '@/components/Button/Button';

interface FormData {
  email: string;
  verification: string;
  password: string;
  passwordCheck: string;
  nickname: string;
}

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: any) => {
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
        className="absolute top-24"
      />
      <div className="absolute bg-white w-[346px] h-[612px] rounded-lg flex justify-center items-center flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center mb-3 gap-1"
        >
          <h1 className="text-title">회원가입</h1>
          <div className="mb-6 w-10/12">
            이메일
            <div className="flex gap-3">
              <Input
                placeholder="이메일을 입력해주세요"
                type="email"
                {...register('email')}
              />
              <Button width="w-[96px]" onClick={() => {}}>
                인증코드
              </Button>
            </div>
          </div>
          <div className="mb-6 w-10/12">
            이메일 인증 코드 입력
            <div className="flex gap-3">
              <Input
                placeholder="인증 코드를 입력해주세요"
                type="email"
                {...register('verification')}
              />
              <Button width="w-[96px]" onClick={() => {}}>
                인증하기
              </Button>
            </div>
          </div>
          <div className="mb-6 w-10/12">
            비밀번호
            <Input
              placeholder="비밀번호를 입력해주세요"
              type="email"
              {...register('password')}
            />
          </div>
          <div className="mb-6 w-10/12">
            비밀번호 확인
            <Input
              placeholder="비밀번호를 확인해주세요"
              type="email"
              {...register('passwordCheck')}
            />
          </div>
          <div className="mb-6 w-10/12 ">
            닉네임
            <div className="flex gap-3">
              <Input
                placeholder="닉네임을 입력해주세요"
                type="email"
                {...register('nickname')}
              />
              <Button width="w-[96px]" onClick={() => {}}>
                중복확인
              </Button>
            </div>
          </div>
          <Button width={'w-10/12'} onClick={() => {}}>
            가입하기
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
