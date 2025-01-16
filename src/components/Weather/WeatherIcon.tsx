import Image from 'next/image';
import cloudGreen from '../../../public/icons/weather/cloud_green.svg';
import sunGreen from '../../../public/icons/weather/sun_green.svg';
import rainGreen from '../../../public/icons/weather/rain_green.svg';
import snowGreen from '../../../public/icons/weather/snow_green.svg';
import cloudGray from '../../../public/icons/weather/cloud_gray.svg';
import sunGray from '../../../public/icons/weather/sun_gray.svg';
import rainGray from '../../../public/icons/weather/rain_gray.svg';
import snowGray from '../../../public/icons/weather/snow_gray.svg';

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
    <div className="flex justify-center items-center w-6 h-6">
      <Image
        src={getIconSource()}
        alt={condition}
        width={22}
        height={22}
        className="transition-colors duration-200"
      />
    </div>
  );
};

export default WeatherIcon;
