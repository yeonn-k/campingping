import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

export const timeFormat = (utcTime: string) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  return dayjs.utc(utcTime).tz('Asia/Seoul').format('YYYY. MM. DD. HH:mm');
};
