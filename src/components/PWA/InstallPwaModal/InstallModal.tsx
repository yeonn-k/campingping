import Image from 'next/image';
import logo from '@images/campingping.png';
import Button from '@/components/Button/Button';
import { usePwaStore } from '@/stores/pwaState';

interface InstallModalProps {
  onClick: () => Promise<void>;
  onClose: () => Promise<void>;
}

const InstallModal = ({ onClick, onClose }: InstallModalProps) => {
  const { modalType } = usePwaStore();
  return (
    <div className="fixed top-0 w-full h-screen bg-black bg-opacity-50 z-zModal max-w-[450px] ">
      <div className=" bg-white p-6 rounded-b-3xl w-full h-48 flex flex-col justify-center items-center transition-all duration-500 ease-in-out z-zModal">
        <Image
          src={logo}
          alt="로고이미지"
          width={50}
          height={50}
          quality={50}
          priority
        />
        {modalType === 'supported' ? (
          <>
            <p className="text-description">
              <span className="text-textGreen">캠핑핑</span>은 앱으로 사용할 수
              있습니다.
            </p>
            <p>설치하시겠습니까?</p>
            <div className="flex gap-3 mt-3">
              <Button width="w-20" height="h-8" onClick={onClick}>
                확인
              </Button>
              <Button
                width="w-20"
                height="h-8"
                bgcolor="bg-LightGray"
                onClick={onClose}
              >
                취소
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-description">
              <span className="text-textGreen">캠핑핑</span>은 앱으로 사용할 수
              있습니다.
            </p>
            <p>
              <span className="text-textGreen">홈 화면에 추가</span> 기능을
              사용해보세요
            </p>
            <div className="mt-3">
              <Button width="w-20" height="h-8" onClick={onClose}>
                확인
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InstallModal;
