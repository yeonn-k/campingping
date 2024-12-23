import Image from 'next/image';
import cloudGreen from '../../assets/icons/weather/cloud_green.svg';
import sunGreen from '../../assets/icons/weather/sun_green.svg';
import rainGreen from '../../assets/icons/weather/rain_green.svg';
import snowGreen from '../../assets/icons/weather/snow_green.svg';
import cloudGray from '../../assets/icons/weather/cloud_gray.svg';
import sunGray from '../../assets/icons/weather/sun_gray.svg';
import rainGray from '../../assets/icons/weather/rain_gray.svg';
import snowGray from '../../assets/icons/weather/snow_gray.svg';

const WeatherIcon = ({
  condition,
  active,
}: {
  condition: string;
  active: boolean;
}) => {
  const getIconSource = () => {
    if (active) {
      switch (condition) {
        case '맑음':
          return sunGreen;
        case '비':
          return rainGreen;
        case '눈':
          return snowGreen;
        case '구름많음':
        case '흐림':
          return cloudGreen;
        default:
          return sunGreen;
      }
    } else {
      switch (condition) {
        case '맑음':
          return sunGray;
        case '비':
          return rainGray;
        case '눈':
          return snowGray;
        case '구름많음':
        case '흐림':
          return cloudGray;
        default:
          return sunGray;
      }
    }
  };

  return (
    <Image
      src={getIconSource()}
      alt={condition}
      width={22}
      height={22}
      className="transition-colors duration-200"
    />
  );
};

export default WeatherIcon;
