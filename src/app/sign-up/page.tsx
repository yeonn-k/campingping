'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';

import Input from '@/components/Input/Input';

import RegisterBg from '@images/registerBg.jpg';
import LogoWhite from '@images/campingping_white.svg';
import Button from '@/components/Button/Button';
import axios from 'axios';
import { BASE_URL } from '@confing/config';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import router from 'next/router';

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
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>();

  const sendVerification = async () => {
    try {
      const email = watch('email');
      if (!email) return;

      const res = await axios.post(`${BASE_URL}/auth/send-verification`, {
        email,
      });
      if (res.status === 200) {
        toast.success('인증번호가 발송되었습니다');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkVerification = async () => {
    try {
      const email = watch('email');
      const verification = watch('verification');
      if (!email || !verification) return;

      const res = await axios.post(`${BASE_URL}/auth/verify-code`, {
        email,
        code: verification,
      });
      if (res.status === 201) {
        toast.success('이메일 인증이 완료되었습니다.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkPassword = () => {
    const password = watch('password');
    const passwordCheck = watch('passwordCheck');

    if (passwordCheck && password !== passwordCheck) {
      setError('passwordCheck', {
        type: 'manual',
        message: '비밀번호가 일치하지 않습니다.',
      });
    } else {
      clearErrors('passwordCheck');
    }
  };

  useEffect(() => {
    checkPassword();
  }, [watch('password')]);

  const onSubmit = async (data: FormData) => {
    const user = {
      email: data.email,
      password: data.password,
      nickname: data.nickname,
    };

    if (user.email && user.password && user.nickname) {
      try {
        const res = await axios.post(`${BASE_URL}/auth/register`, {
          email: user.email,
          password: user.password,
          nickname: user.nickname,
        });

        if (res.status === 201) {
          router.push('/sing-in');
        } else toast.error('회원가입 중 문제가 발생했습니다.');
      } catch (error) {
        console.error(error);
        toast.error('회원가입 중 문제가 발생했습니다.');
      }
    }
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
          <div className={`w-10/12 ${errors.email ? 'mb-2' : 'mb-6'}`}>
            이메일
            <div className="flex gap-3">
              <Input
                placeholder="이메일을 입력해주세요"
                type="email"
                {...register('email', {
                  required: '이메일을 입력해주세요',
                  pattern: {
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                    message: '유효한 이메일을 입력해주세요',
                  },
                })}
                hasError={!!errors.email}
                errorMessage={errors.email?.message}
              />
              <Button width="w-[96px]" onClick={sendVerification}>
                인증코드
              </Button>
            </div>
          </div>
          <div className={`w-10/12 ${errors.verification ? 'mb-2' : 'mb-6'}`}>
            이메일 인증 코드 입력
            <div className="flex gap-3">
              <Input
                placeholder="인증 코드를 입력해주세요"
                type="string"
                {...register('verification', {
                  required: '인증 코드를 입력해주세요',
                })}
                hasError={!!errors.verification}
                errorMessage={errors.verification?.message}
              />
              <Button width="w-[96px]" onClick={checkVerification}>
                인증하기
              </Button>
            </div>
          </div>
          <div className={`w-10/12 ${errors.password ? 'mb-2' : 'mb-6'}`}>
            비밀번호
            <Input
              placeholder="비밀번호를 입력해주세요"
              type="password"
              {...register('password', {
                required: '비밀번호를 입력해주세요',
                pattern: {
                  value: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/,
                  message: '영문, 숫자, 특수문자 포함 8자리 이상이어야 합니다.',
                },
              })}
              hasError={!!errors.password}
              errorMessage={errors.password?.message}
            />
          </div>
          <div className={`w-10/12 ${errors.passwordCheck ? 'mb-2' : 'mb-6'}`}>
            비밀번호 확인
            <Input
              placeholder="비밀번호를 확인해주세요"
              type="password"
              {...register('passwordCheck', {
                required: '비밀번호를 확인해주세요',
                validate: (v: string) =>
                  v === watch('password') || '비밀번호가 일치하지 않습니다.',
              })}
              hasError={!!errors.passwordCheck}
              errorMessage={errors.passwordCheck?.message}
            />
          </div>
          <div className={`w-10/12 ${errors.nickname ? 'mb-2' : 'mb-6'}`}>
            닉네임
            <Input
              placeholder="닉네임을 입력해주세요"
              type="text"
              {...register('nickname', {
                required: '닉네임을 입력해주세요',
              })}
              hasError={!!errors.nickname}
              errorMessage={errors.nickname?.message}
            />
          </div>
          <Button width={'w-10/12'}>가입하기</Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
