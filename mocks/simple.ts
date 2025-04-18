import { addDays, subDays, format } from 'date-fns';

import { IApiResponse } from '@/shared/types';

const now = new Date();

const addMinutes = (minutesToAdd: number) => {
  const date = new Date(now.getTime() + minutesToAdd * 60000);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const formatDateLong = (date: Date) => format(date, 'yyyy-MM-dd');

const dayBeforeYesterday = formatDateLong(subDays(now, 2));
const yesterday = formatDateLong(subDays(now, 1));
const today = formatDateLong(now);
const daysAhead = Array.from({ length: 10 }, (_, i) => i + 1);
const [day1, day2, day3, day4, day5, day6, day7, day8, day9, day10] = daysAhead.map((d) =>
  formatDateLong(addDays(now, d))
);

export const MOCK_DATA_SIMPLE: IApiResponse = {
  city: 'london',
  times: {
    [dayBeforeYesterday]: {
      date: dayBeforeYesterday,
      fajr: '05:34',
      sunrise: '07:15',
      dhuhr: '11:50',
      asr: '13:50',
      magrib: '16:15',
      isha: '17:48',
      fajr_jamat: '00:00',
      dhuhr_jamat: '00:00',
      asr_2: '00:00',
      asr_jamat: '00:00',
      magrib_jamat: '00:00',
      isha_jamat: '00:00',
    },
    [yesterday]: {
      date: yesterday,
      fajr: '05:35',
      sunrise: '07:16',
      dhuhr: '11:50',
      asr: '13:49',
      magrib: '16:14',
      isha: '17:47',
      fajr_jamat: '00:00',
      dhuhr_jamat: '00:00',
      asr_2: '00:00',
      asr_jamat: '00:00',
      magrib_jamat: '00:00',
      isha_jamat: '00:00',
    },
    [today]: {
      date: today,
      fajr: addMinutes(1),
      sunrise: addMinutes(2),
      dhuhr: addMinutes(3),
      asr: addMinutes(4),
      magrib: addMinutes(5),
      isha: addMinutes(6),
      fajr_jamat: '00:00',
      dhuhr_jamat: '00:00',
      asr_2: '00:00',
      asr_jamat: '00:00',
      magrib_jamat: '00:00',
      isha_jamat: '00:00',
    },
    [day1]: {
      date: day1,
      fajr: addMinutes(-11),
      sunrise: addMinutes(-21),
      dhuhr: addMinutes(-31),
      asr: addMinutes(-41),
      magrib: addMinutes(-51),
      isha: addMinutes(-61),
      fajr_jamat: '00:00',
      dhuhr_jamat: '00:00',
      asr_2: '00:00',
      asr_jamat: '00:00',
      magrib_jamat: '00:00',
      isha_jamat: '00:00',
    },
    [day2]: {
      date: day2,
      fajr: '05:37',
      sunrise: '07:18',
      dhuhr: '11:51',
      asr: '13:47',
      magrib: '16:12',
      isha: '17:45',
      fajr_jamat: '00:00',
      dhuhr_jamat: '00:00',
      asr_2: '00:00',
      asr_jamat: '00:00',
      magrib_jamat: '00:00',
      isha_jamat: '00:00',
    },
    [day3]: {
      date: day3,
      fajr: '05:38',
      sunrise: '07:19',
      dhuhr: '11:51',
      asr: '13:46',
      magrib: '16:11',
      isha: '17:44',
      fajr_jamat: '00:00',
      dhuhr_jamat: '00:00',
      asr_2: '00:00',
      asr_jamat: '00:00',
      magrib_jamat: '00:00',
      isha_jamat: '00:00',
    },
    [day4]: {
      date: day4,
      fajr: '05:39',
      sunrise: '07:20',
      dhuhr: '11:51',
      asr: '13:45',
      magrib: '16:10',
      isha: '17:43',
      fajr_jamat: '00:00',
      dhuhr_jamat: '00:00',
      asr_2: '00:00',
      asr_jamat: '00:00',
      magrib_jamat: '00:00',
      isha_jamat: '00:00',
    },
    [day5]: {
      date: day5,
      fajr: '05:40',
      sunrise: '07:21',
      dhuhr: '11:51',
      asr: '13:44',
      magrib: '16:09',
      isha: '17:42',
      fajr_jamat: '00:00',
      dhuhr_jamat: '00:00',
      asr_2: '00:00',
      asr_jamat: '00:00',
      magrib_jamat: '00:00',
      isha_jamat: '00:00',
    },
    [day6]: {
      date: day6,
      fajr: '05:41',
      sunrise: '07:22',
      dhuhr: '11:51',
      asr: '13:43',
      magrib: '16:08',
      isha: '17:41',
      fajr_jamat: '00:00',
      dhuhr_jamat: '00:00',
      asr_2: '00:00',
      asr_jamat: '00:00',
      magrib_jamat: '00:00',
      isha_jamat: '00:00',
    },
    [day7]: {
      date: day7,
      fajr: '05:42',
      sunrise: '07:23',
      dhuhr: '11:51',
      asr: '13:42',
      magrib: '16:07',
      isha: '17:40',
      fajr_jamat: '00:00',
      dhuhr_jamat: '00:00',
      asr_2: '00:00',
      asr_jamat: '00:00',
      magrib_jamat: '00:00',
      isha_jamat: '00:00',
    },
    [day8]: {
      date: day8,
      fajr: '05:43',
      sunrise: '07:24',
      dhuhr: '11:51',
      asr: '13:41',
      magrib: '16:06',
      isha: '17:39',
      fajr_jamat: '00:00',
      dhuhr_jamat: '00:00',
      asr_2: '00:00',
      asr_jamat: '00:00',
      magrib_jamat: '00:00',
      isha_jamat: '00:00',
    },
    [day9]: {
      date: day9,
      fajr: '05:44',
      sunrise: '07:25',
      dhuhr: '11:51',
      asr: '13:40',
      magrib: '16:05',
      isha: '17:38',
      fajr_jamat: '00:00',
      dhuhr_jamat: '00:00',
      asr_2: '00:00',
      asr_jamat: '00:00',
      magrib_jamat: '00:00',
      isha_jamat: '00:00',
    },
    [day10]: {
      date: day10,
      fajr: '05:45',
      sunrise: '07:26',
      dhuhr: '11:51',
      asr: '13:39',
      magrib: '16:04',
      isha: '17:37',
      fajr_jamat: '00:00',
      dhuhr_jamat: '00:00',
      asr_2: '00:00',
      asr_jamat: '00:00',
      magrib_jamat: '00:00',
      isha_jamat: '00:00',
    },
  },
};
