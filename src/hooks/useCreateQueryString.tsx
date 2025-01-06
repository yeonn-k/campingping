import { ReadonlyURLSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const useCreateQueryString = (searchParams: ReadonlyURLSearchParams) => {
  const createQueryString = useCallback(
    (
      baseUrl: string,
      paramsList: { name: string; value?: string | number | null }[]
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      paramsList.forEach(({ name, value }) => {
        if (value) {
          params.set(name, `${value}`);
        } else {
          params.delete(name);
        }
      });

      return `${baseUrl}?${params.toString()}`;
    },
    [searchParams]
  );

  return createQueryString;
};
