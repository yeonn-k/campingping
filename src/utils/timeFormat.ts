import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';

export const timeFormat = (utcTime: string) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.locale('ko');

  return dayjs.utc(utcTime).format('YYYY. MM. DD. A hh:mm');
};
