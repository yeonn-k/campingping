/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { fetchWeatherData } from '../../utils/fetchWeatherData';
import { getCurrentLocation } from '../../utils/location'; // 위치 관련 함수 import
import WeatherIcon from './WeatherIcon';

const Weather = () => {
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lon: 0 });
  const [error, setError] = useState<string | null>(null);

  // 현재 위치 가져오기
  useEffect(() => {
    getCurrentLocation()
      .then((location) => {
        setCurrentLocation(location);
      })
      .catch((error) => {
        setError(
          '위치 정보를 가져오는데 실패했습니다. 위치 권한을 확인해주세요.'
        );
        console.error('위치 오류:', error);
      });
  }, []);

  // 날씨 데이터 가져오기
  useEffect(() => {
    if (currentLocation.lat && currentLocation.lon) {
      fetchWeatherData(currentLocation.lat, currentLocation.lon)
        .then((data) => {
          console.log('날씨 데이터:', data); // 데이터 확인
          const filteredData = filterWeatherData(data);
          setWeatherData(filteredData);
        })
        .catch((err) => {
          setError('날씨 데이터를 가져오는데 실패했습니다.');
          console.error('날씨 데이터 오류:', err);
        });
    }
  }, [currentLocation]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!weatherData.length) {
    return <div className="text-Gray">날씨 데이터를 불러오는 중...</div>;
  }

  return (
    <div className="grid grid-cols-4 w-full">
      {weatherData.map((day, index) => (
        <div
          key={index}
          className={`flex flex-col items-center justify-start p-4 ${
            index === 0 ? 'text-Green' : 'text-Gray'
          }`}
        >
          <div className="text-xs mb-1">{formatDate(day.date)}</div>
          <div className="mb-1">
            <WeatherIcon condition={day.skyCondition} active={index === 0} />
          </div>
          <div className="text-xs whitespace-nowrap">
            H:{day.maxTemp}° L:{day.minTemp}°
          </div>
        </div>
      ))}
    </div>
  );
};

export default Weather;

// 날짜 포맷팅
const formatDate = (date: string) => {
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);
  return `${month}/${day}`;
};

// 데이터 필터링 및 정렬
const filterWeatherData = (data: any[]) => {
  const today = new Date();
  const formattedToday = formatDateAsKey(today); // 현재 날짜 포맷

  // 현재 날짜 이후의 데이터만 필터링
  const filteredData = data
    .filter((item: any) => {
      const itemDate = item.date;
      return itemDate >= formattedToday;
    })
    .slice(0, 4); // 4일치 데이터만 추출

  return filteredData;
};

// 날짜 키 포맷팅
const formatDateAsKey = (date: Date) => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
};
