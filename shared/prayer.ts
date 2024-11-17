import { ISingleApiResponseTransformed, IScheduleNow, IApiResponse, IApiTimes, PrayerType } from '@/shared/types';
import { PRAYERS_ENGLISH, PRAYERS_ARABIC, EXTRAS_ENGLISH, EXTRAS_ARABIC } from '@/shared/constants';
import { isDateTodayOrFuture, getLastThirdOfNight, isTimePassed, addMinutes } from '@/shared/time';

/**
 * Filters API response data to only include today and future dates
 */
export const filterApiData = (apiData: IApiResponse): IApiResponse => {
  const timesFiltered: IApiTimes = {};

  const entries = Object.entries(apiData.times);

  entries.forEach(([date, times]) => {
    if (!isDateTodayOrFuture(date)) return;
    timesFiltered[date] = times;
  });

  return {
    city: apiData.city,
    times: timesFiltered
  };
};

/**
 * Transforms API response data into normalized prayer schedule format and adds calculated Duha time.
 */
export const transformApiData = (apiData: IApiResponse): ISingleApiResponseTransformed[] => {
  const transformations: ISingleApiResponseTransformed[] = [];

  const entries = Object.entries(apiData.times);

  entries.forEach(([date, times]) => {
    const schedule: ISingleApiResponseTransformed = {
      date,
      fajr: times.fajr,
      sunrise: times.sunrise,
      duha: addMinutes(times.sunrise, 1),
      dhuhr: times.dhuhr,
      asr: times.asr,
      magrib: times.magrib,
      isha: times.isha,
      "last third": getLastThirdOfNight(times.magrib, times.fajr),
    };

    transformations.push(schedule);
  });

  return transformations;
};

/**
 * Creates structured prayer times object for today with status information. Maps prayer times to both English and Arabic names.
 */
export const createSchedule = (prayers: ISingleApiResponseTransformed, type: PrayerType): IScheduleNow => {
  const schedule: IScheduleNow = {};
  const names = type === 'standard' ? PRAYERS_ENGLISH : EXTRAS_ENGLISH;
  const arabicNames = type === 'standard' ? PRAYERS_ARABIC : EXTRAS_ARABIC;

  names.forEach((name, index) => {
    const prayerTime = prayers[name.toLowerCase() as keyof ISingleApiResponseTransformed];

    schedule[index] = {
      index,
      date: prayers.date,
      english: name,
      arabic: arabicNames[index],
      time: prayerTime,
      passed: isTimePassed(prayerTime),
      isNext: false,
      type
    };
  });

  return schedule;
};
