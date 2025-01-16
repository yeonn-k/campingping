import { regionStore } from '@/stores/regionState';
import { updateQueryString } from '@/utils/updateQueryString';
import { useState, useCallback } from 'react';

export const useRegion = () => {
  const [region, setRegion] = useState<string | null>(null);
  const { coloredState, setColoredState } = regionStore();

  const updateRegion = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | string | null) => {
      if (e === null) {
        setRegion(null);

        updateQueryString({ region: null });
      } else if (typeof e === 'string') {
        setRegion(e);
      } else if (e !== null && e.target instanceof HTMLDivElement) {
        const value = e.target.innerText;

        if (value === coloredState) {
          setRegion(null);
          setColoredState(null);
          updateQueryString({ region: null });
        } else {
          let formattedRegion = value;

          if (value.includes('특별자치')) {
            formattedRegion = value.slice(0, 2) + value.slice(-1);
          } else if (value.includes('광역시') || value.includes('특별시')) {
            formattedRegion = value.slice(0, 2) + '시';
          }

          setRegion(formattedRegion);
          setColoredState(value);
          updateQueryString({ region: formattedRegion });
        }
      }
    },
    [coloredState]
  );

  return { region, setRegion, updateRegion };
};
