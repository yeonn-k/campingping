import { CampDetail } from '@/types/Camp';
import { api } from '@/utils/axios';
import { useState } from 'react';

export const useFetchCampDetail = async (contentId: string) => {
  const [campData, setCampData] = useState<CampDetail | null>(null);

  try {
    const response = await api.get(`/campings/lists/${contentId}`);

    const camp = response.data.data;

    if (!response) {
      throw new Error('Error on fetching camp data');
    }
    setCampData(camp);
  } catch (error) {
    console.error(error);
  }

  return campData;
};
