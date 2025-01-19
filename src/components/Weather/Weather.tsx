/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { fetchWeatherData } from '../../utils/fetchWeatherData';
import { getCurrentLocation } from '../../utils/location';
import WeatherIcon from './WeatherIcon';

import { weatherFormatDate } from '@/utils/weatherFormatDate';
import { filterWeatherData } from '@/utils/filterWeatherData';

const Weather = () => {
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lon: 0 });
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (currentLocation.lat && currentLocation.lon) {
      fetchWeatherData(currentLocation.lat, currentLocation.lon)
        .then((data) => {
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

  const gridClass = weatherData.length === 0 ? 'grid-cols-1' : 'grid-cols-4';

  return (
    // <div className="grid grid-cols-4 w-full">

    <div
      className={`absolute mt-2 grid ${gridClass} w-[94%] bg-white/80 rounded-2xl z-zBanner`}
    >
      {!weatherData.length ? (
        <div className="w-full flex justify-center items-center text-Gray p-2">
          날씨 데이터를 불러오는 중...
        </div>
      ) : (
        weatherData.map((day, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-start p-2 ${
              index === 0 ? 'text-Green' : 'text-Gray'
            }`}
          >
            <div className="text-xs mb-1">{weatherFormatDate(day.date)}</div>
            <div className="mb-1">
              <WeatherIcon condition={day.skyCondition} active={index === 0} />
            </div>
            <div className="text-xs whitespace-nowrap">
              H:{day.maxTemp}° L:{day.minTemp}°
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Weather;
