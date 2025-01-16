import Image from 'next/image';
import chevron from '@icons/chevron_green.svg';

interface ScrollToTopProps {
  scrollRef: React.RefObject<HTMLDivElement>;
}

const ScrollToTop = ({ scrollRef }: ScrollToTopProps) => {
  const scrollToTop = () => {
    if (scrollRef.current !== null) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <button
      className="fixed bottom-16 right-0 translate-x-[-14px] bg-white p-4 rounded-full shadow-shadowCustom w-14 h-14 z-[18]"
      onClick={scrollToTop}
    >
      <Image src={chevron} alt="페이지 상단으로" width={24} />
    </button>
  );
};

export default ScrollToTop;
