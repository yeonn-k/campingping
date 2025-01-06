/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { fetchWeatherData } from '../../utils/fetchWeatherData';
import { formatDate, filterWeatherData } from './Weather';

import WeatherIcon from './WeatherIcon';

const WeatherWithLatLon = ({ lat, lon }: { lat: number; lon: number }) => {
  const [weatherData, setWeatherData] = useState<any[]>([]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat && lon) {
      fetchWeatherData(lat, lon)
        .then((data) => {
          const filteredData = filterWeatherData(data);
          setWeatherData(filteredData);
        })
        .catch((err) => {
          setError('날씨 데이터를 가져오는데 실패했습니다.');
          console.error('날씨 데이터 오류:', err);
        });
    }
  }, [lat, lon]);

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

export default WeatherWithLatLon;
