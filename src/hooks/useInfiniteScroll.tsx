import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

const LIMIT = 10;

const useInfiniteScroll = ({
  loadMoreElementRef,
}: {
  loadMoreElementRef: MutableRefObject<HTMLElement | null>;
}) => {
  const [currentCursor, setCurrentCursor] = useState(1);
  const nextCursorRef = useRef(1);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting) {
      if (nextCursorRef.current) {
        setCurrentCursor(nextCursorRef.current);
      }
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver);

    if (loadMoreElementRef.current) {
      observer.observe(loadMoreElementRef.current);
    }
    return () => {
      if (loadMoreElementRef.current) {
        observer.unobserve(loadMoreElementRef.current);
      }
    };
  }, [handleObserver, loadMoreElementRef]);

  return { nextCursorRef, currentCursor, LIMIT };
};

export default useInfiniteScroll;
