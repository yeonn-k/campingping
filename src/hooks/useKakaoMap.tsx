import { useGlobalStore } from '@/stores/globalState';
import { useEffect, useMemo } from 'react';

interface Props {
  dependencies: unknown[];
  onLoad: () => void;
}

export const useKakaoMap = ({ dependencies, onLoad }: Props) => {
  const { mapScriptLoaded } = useGlobalStore();

  const memoizedDependencies = useMemo(() => dependencies, [dependencies]);

  useEffect(() => {
    if (mapScriptLoaded) {
      window.kakao.maps.load(onLoad);
    }
  }, [memoizedDependencies, mapScriptLoaded, onLoad]);
};
