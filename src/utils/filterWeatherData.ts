import { WeatherType } from '@/types/WeatherType';

export const filterWeatherData = (data: WeatherType[]) => {
  const today = new Date();
  const formattedToday = formatDateAsKey(today);

  const filteredData = data
    .filter((item: WeatherType) => {
      const itemDate = item.date;
      return itemDate >= formattedToday;
    })
    .slice(0, 4);

  return filteredData;
};

const formatDateAsKey = (date: Date) => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
};
