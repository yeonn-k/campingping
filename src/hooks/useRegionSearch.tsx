import { useCallback, useState } from 'react';

import { regionStore } from '@/stores/regionState';
import { updateQueryString } from '@/utils/updateQueryString';

export const useRegionSearch = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const { coloredCity, coloredRegion, setColoredCity, setColoredRegion } =
    regionStore();

  const updateRegion = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | string | null,
      type: 'region' | 'city'
    ) => {
      if (e === null) {
        setSelected(null);
        updateQueryString({ region: null, city: null });
      } else if (typeof e === 'string') {
        setSelected(e);
      } else if (e !== null && e.target instanceof HTMLDivElement) {
        const value = e.target.innerText;

        if (
          (type === 'region' && value === coloredRegion) ||
          (type === 'city' && value === coloredCity)
        ) {
          setSelected(null);
          if (type === 'region') {
            setColoredRegion(null);
            setColoredCity(null);
            updateQueryString({ region: null, city: null });
          }
          if (type === 'city') {
            setColoredCity(null);
            updateQueryString({ city: null });
          }
        } else {
          let formattedRegion = value;

          if (type === 'city') {
            setColoredCity(value);
            updateQueryString({ city: value });
          }
          if (type === 'region') {
            if (value.includes('특별자치')) {
              formattedRegion = value.slice(0, 2) + value.slice(-1);
            } else if (value.includes('광역시') || value.includes('특별시')) {
              formattedRegion = value.slice(0, 2) + '시';
            }

            setSelected(formattedRegion);
            setColoredRegion(value);
            setColoredCity(null);
            updateQueryString({ region: formattedRegion, city: null });
          }
        }
      }
    },
    [coloredRegion, coloredCity]
  );

  return { selected, setSelected, updateRegion };
};
