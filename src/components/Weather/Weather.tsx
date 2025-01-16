/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { fetchWeatherData } from '../../utils/fetchWeatherData';
import { getCurrentLocation } from '../../utils/location';
import WeatherIcon from './WeatherIcon';

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
      className={`absolute mt-3 grid ${gridClass} w-[94%] bg-white/80 rounded-2xl z-zModal`}
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
            <div className="text-xs mb-1">{formatDate(day.date)}</div>
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

const formatDate = (date: string) => {
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);
  return `${month}/${day}`;
};

const filterWeatherData = (data: any[]) => {
  const today = new Date();
  const formattedToday = formatDateAsKey(today);

  const filteredData = data
    .filter((item: any) => {
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
