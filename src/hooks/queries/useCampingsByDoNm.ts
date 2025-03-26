import { useQuery } from '@tanstack/react-query';
import { createApiUrl } from '@/utils/createApiUrl';
import { api } from '@/utils/axios';
import { CampMap } from '@/types/Camp';

export const useCampingsByDoNm = (
  category: string | null,
  region: string | null,
  city: string | null
) => {
  return useQuery<CampMap[]>({
    queryKey: ['lists', category, region, city],
    queryFn: async () => {
      const apiUrl = createApiUrl('/campings/lists', [
        { name: 'category', value: category },
        { name: 'region', value: region },
        { name: 'city', value: city },
      ]);

      const res = await api.get(apiUrl);
      return res.data.data.result;
    },
    enabled: region !== null,
  });
};
