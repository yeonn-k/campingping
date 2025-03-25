import { useQuery } from '@tanstack/react-query';
import { createApiUrl } from '@/utils/createApiUrl';
import { api } from '@/utils/axios';
import { CampMap } from '@/types/Camp';

export const useCampingsByLocation = (
  lat: number | null,
  lon: number | null
) => {
  return useQuery<CampMap[]>({
    queryKey: ['map', lat, lon],
    queryFn: async () => {
      const apiUrl = createApiUrl('/campings/map', [
        { name: 'lat', value: lat },
        { name: 'lon', value: lon },
      ]);

      const res = await api.get(apiUrl);
      return res.data.data;
    },
    enabled: lat !== null && lon !== null,
  });
};
