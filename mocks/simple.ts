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
const tomorrow = formatDateLong(addDays(now, 1));
const dayAfterTomorrow = formatDateLong(addDays(now, 2));

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
      // fajr: '05:35',
      // sunrise: '07:16',
      // dhuhr: '11:50',
      // asr: '13:49',
      // magrib: '16:14',
      // isha: '17:47',
      fajr: addMinutes(-10),
      sunrise: addMinutes(-20),
      dhuhr: addMinutes(-30),
      asr: addMinutes(10),
      magrib: addMinutes(20),
      isha: addMinutes(30),
      fajr_jamat: addMinutes(1),
      dhuhr_jamat: '00:00',
      asr_2: '00:00',
      asr_jamat: '00:00',
      magrib_jamat: '00:00',
      isha_jamat: '00:00',
    },
    [tomorrow]: {
      date: tomorrow,
      fajr: addMinutes(-11),
      sunrise: addMinutes(-21),
      dhuhr: addMinutes(-31),
      asr: addMinutes(11),
      magrib: addMinutes(21),
      isha: addMinutes(31),
      fajr_jamat: '00:00',
      dhuhr_jamat: '00:00',
      asr_2: '00:00',
      asr_jamat: '00:00',
      magrib_jamat: '00:00',
      isha_jamat: '00:00',
    },
    [dayAfterTomorrow]: {
      date: dayAfterTomorrow,
      fajr: '05:39',
      sunrise: '07:22',
      dhuhr: '11:51',
      asr: '13:46',
      magrib: '16:09',
      isha: '17:43',
      fajr_jamat: '00:00',
      dhuhr_jamat: '00:00',
      asr_2: '00:00',
      asr_jamat: '00:00',
      magrib_jamat: '00:00',
      isha_jamat: '00:00',
    },
  },
};
