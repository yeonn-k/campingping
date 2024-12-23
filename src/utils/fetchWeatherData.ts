import axios from 'axios';
import { convertToGrid } from './coordinateConversion';

export const fetchWeatherData = async (lat: number, lon: number) => {
  const serviceKey =
    'fR5r78vDyLa5VlMt5YTpJRUGjXoWDMk6ZQmB2LPtYHAHw%2F7mdvoXpnkrz7OuOB2JJH%2FOtbvUbmtUS%2FiPGGwoxQ%3D%3D';
  const baseDate = getBaseDate();
  const baseTime = '0200';
  const { nx, ny } = convertToGrid(lat, lon);

  const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${serviceKey}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

  try {
    const response = await axios.get(url);
    const data = response.data.response.body.items.item;
    return processWeatherData(data);
  } catch (error) {
    console.error('API 호출 에러:', error);
    throw error;
  }
};

const getBaseDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

interface WeatherItem {
  fcstDate: string;
  category: string;
  fcstValue: string;
}

interface ProcessedWeatherData {
  date: string;
  minTemp: string;
  maxTemp: string;
  skyCondition: string;
  precipitation: string;
}

const processWeatherData = (data: WeatherItem[]): ProcessedWeatherData[] => {
  const groupedByDate: Record<string, WeatherItem[]> = {};

  // 날짜별로 데이터 그룹화
  data.forEach((item) => {
    if (!groupedByDate[item.fcstDate]) {
      groupedByDate[item.fcstDate] = [];
    }
    groupedByDate[item.fcstDate].push(item);
  });

  // 각 날짜별 데이터 처리
  const processedData = Object.entries(groupedByDate).map(([date, items]) => {
    const dayData = {
      date,
      minTemp: '0',
      maxTemp: '0',
      skyCondition: '맑음',
      precipitation: '없음',
    };

    // 해당 날짜의 모든 데이터 순회
    items.forEach((item) => {
      switch (item.category) {
        case 'TMN':
          dayData.minTemp = item.fcstValue;
          break;
        case 'TMX':
          dayData.maxTemp = item.fcstValue;
          break;
        case 'SKY':
          dayData.skyCondition = mapSkyCondition(item.fcstValue);
          break;
        case 'PTY':
          dayData.precipitation = mapPrecipitation(item.fcstValue);
          break;
      }
    });

    return dayData;
  });

  // 날짜순으로 정렬하고 앞의 4일만 반환
  return processedData
    .sort((a, b) => parseInt(a.date) - parseInt(b.date))
    .slice(0, 4);
};

const mapSkyCondition = (code: string) => {
  switch (code) {
    case '1':
      return '맑음';
    case '3':
      return '구름많음';
    case '4':
      return '흐림';
    default:
      return '알 수 없음';
  }
};

const mapPrecipitation = (code: string) => {
  switch (code) {
    case '0':
      return '없음';
    case '1':
      return '비';
    case '2':
      return '눈';
    default:
      return '알 수 없음';
  }
};
