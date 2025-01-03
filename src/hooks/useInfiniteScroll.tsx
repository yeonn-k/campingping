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
    // console.log({ entries });
    const target = entries[0];
    if (target.isIntersecting) {
      // red div is visible
      // load more data, change the cursor
      if (nextCursorRef.current) {
        setCurrentCursor(nextCursorRef.current);
      }
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '20px',
    });

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
