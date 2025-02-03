import Image from 'next/image';
import logo from '@images/campingping.png';
import Button from '../Button/Button';

interface InstallModalProps {
  onClick: () => Promise<void>;
  onClose: () => Promise<void>;
}

const InstallModal = ({ onClick, onClose }: InstallModalProps) => {
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
      </div>
    </div>
  );
};

export default InstallModal;
