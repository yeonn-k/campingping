import { useEffect } from 'react';

interface Props {
  dependencies: unknown[];
  onLoad: () => void;
}

export const useKakaoMap = ({ dependencies, onLoad }: Props) => {
  useEffect(() => {

      window.kakao.maps.load(onLoad);
    }
[JSON.stringify(dependencies), , onLoad]);
};
