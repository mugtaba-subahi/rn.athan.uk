import { addMinutes } from './addMinutes';
import { ISingleScheduleTransformed } from '../types/prayers';
import { IApiSingleTime } from '@/types/api';

export const transformPrayerSchedule = (prayers: IApiSingleTime[]): ISingleScheduleTransformed[] => {
  const transformedDays: ISingleScheduleTransformed[] = [];

  prayers.forEach(prayer => {
    const duha = addMinutes(prayer.sunrise);

    transformedDays.push({
      date: prayer.date,
      fajr: prayer.fajr,
      sunrise: prayer.sunrise,
      duha,
      dhuhr: prayer.dhuhr,
      asr: prayer.asr,
      magrib: prayer.magrib,
      isha: prayer.isha,
    });
  });

  return transformedDays;
};