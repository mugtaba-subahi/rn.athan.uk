import { atom } from 'jotai';
import { getDefaultStore } from 'jotai/vanilla';

import * as PrayerUtils from '@/shared/prayer';
import * as TimeUtils from '@/shared/time';
import { ITransformedPrayer, ScheduleAtom, ScheduleStore, ScheduleType } from '@/shared/types';
import * as Database from '@/stores/database';

const store = getDefaultStore();

// --- Initial State ---

const createInitialPrayer = (scheduleType: ScheduleType): ITransformedPrayer => ({
  index: 0,
  date: '2024-11-15',
  english: 'Fajr',
  arabic: 'الفجر',
  time: '00:01',
  type: scheduleType,
});

const createInitialSchedule = (scheduleType: ScheduleType): ScheduleStore => ({
  type: scheduleType,
  today: { 0: createInitialPrayer(scheduleType) },
  tomorrow: { 0: createInitialPrayer(scheduleType) },
  nextIndex: 0,
});

// --- Atoms ---

export const standardScheduleAtom = atom<ScheduleStore>(createInitialSchedule(ScheduleType.Standard));
export const extraScheduleAtom = atom<ScheduleStore>(createInitialSchedule(ScheduleType.Extra));

// --- Helpers ---

// Create daily schedules based on provided date and next day
const buildDailySchedules = (type: ScheduleType, date: Date) => {
  const nextDate = TimeUtils.createLondonDate(date);

  nextDate.setDate(date.getDate() + 1);

  const dataToday = Database.getPrayerByDate(date);
  const dataTomorrow = Database.getPrayerByDate(nextDate);

  if (!dataToday || !dataTomorrow) throw new Error('Missing prayer data');

  return {
    today: PrayerUtils.createSchedule(dataToday, type),
    tomorrow: PrayerUtils.createSchedule(dataTomorrow, type),
  };
};

// --- Actions ---

const getScheduleAtom = (type: ScheduleType): ScheduleAtom => {
  return type === ScheduleType.Standard ? standardScheduleAtom : extraScheduleAtom;
};

export const getSchedule = (type: ScheduleType): ScheduleStore => store.get(getScheduleAtom(type));

export const setSchedule = (type: ScheduleType, date: Date): void => {
  const scheduleAtom = getScheduleAtom(type);
  const currentSchedule = store.get(scheduleAtom);

  const { today, tomorrow } = buildDailySchedules(type, date);
  const nextIndex = PrayerUtils.findNextPrayerIndex(today);

  store.set(scheduleAtom, { ...currentSchedule, type, today, tomorrow, nextIndex });
};

export const incrementNextIndex = (type: ScheduleType): void => {
  const scheduleAtom = getScheduleAtom(type);
  const schedule = getSchedule(type);

  const isLastPrayer = schedule.nextIndex === Object.keys(schedule.today).length - 1;
  const nextIndex = isLastPrayer ? 0 : schedule.nextIndex + 1;

  store.set(scheduleAtom, { ...schedule, nextIndex });
};
