import Image from 'next/image';
import logo from '@images/campingping.png';

interface DefaultImgProps {
  width?: string;
  height?: string;
}

const DefaultImg = ({ width, height }: DefaultImgProps) => {
  return (
    <>
      <div
        className={`flex flex-col justify-center items-center ${width ? width : 'w-full'} ${height ? height : 'h-52'} border-2 border-Green rounded-md`}
      >
        <div className="w-full flex justify-center items-center m-2">
          <Image src={logo} alt="logo" width={70} />
        </div>

        {!width && (
          <p className="w-full text-center">
            아직 캠핑장 사진이 준비되지 않았어요 !
          </p>
        )}
      </div>
    </>
  );
};

export default DefaultImg;
