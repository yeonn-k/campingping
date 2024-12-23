'use client';

import Button from '@/components/Button/Button';

const SignUp = () => {
  const test = () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000); // 2초 후 완료
    });
  };

  return (
    <Button
      onClick={async () => {
        await test();
        alert('loading spinner test');
      }}
    >
      확인
    </Button>
  );
};

export default SignUp;
