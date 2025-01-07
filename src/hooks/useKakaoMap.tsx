import { useGlobalStore } from '@/stores/globalState';
import { useEffect } from 'react';

interface Props {
  dependencies: unknown[];
  onLoad: () => void;
}

export const useKakaoMap = ({ dependencies, onLoad }: Props) => {
  const { mapScriptLoaded } = useGlobalStore();

  useEffect(() => {
    if (mapScriptLoaded) {
      window.kakao.maps.load(onLoad);
    }
  }, [JSON.stringify(dependencies), mapScriptLoaded, onLoad]);
};
