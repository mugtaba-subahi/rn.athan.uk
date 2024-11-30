import { getDefaultStore } from 'jotai/vanilla';

import { PRAYER_INDEX_ISHA } from '@/shared/constants';
import * as PrayerUtils from '@/shared/prayer';
import * as TimeUtils from '@/shared/time';
import { AlertType, Measurements, PageCoordinates, ScheduleType } from '@/shared/types';
import * as database from '@/stores/database';
import {
  dateAtom,
  overlayAtom,
  alertPreferencesAtom,
  soundPreferencesAtom,
  standardScheduleAtom,
  extraScheduleAtom,
  measurementsAtom,
  appAtom,
} from '@/stores/store';

const store = getDefaultStore();

// Getters
export const getDate = () => store.get(dateAtom);
export const getOverlay = () => store.get(overlayAtom);
export const getAlertPreferences = () => store.get(alertPreferencesAtom);
export const getSoundPreferences = () => store.get(soundPreferencesAtom);

export const getSchedule = (type: ScheduleType) =>
  type === ScheduleType.Standard ? store.get(standardScheduleAtom) : store.get(extraScheduleAtom);

export const getApp = () => store.get(appAtom);

// Setters
export const toggleOverlay = () => {
  const overlay = getOverlay();

  store.set(overlayAtom, { ...overlay, isOn: !overlay.isOn });
};

export const setDate = () => {
  const schedule = getSchedule(ScheduleType.Standard);

  const currentDate = schedule.today[PRAYER_INDEX_ISHA].date;

  store.set(dateAtom, currentDate);
};

export const setMeasurement = (key: keyof Measurements, measurements: PageCoordinates) => {
  const current = store.get(measurementsAtom);
  store.set(measurementsAtom, { ...current, [key]: measurements });
};

// set standard schedule for today and tomorrow
export const setSchedule = (type: ScheduleType) => {
  const schedule = getSchedule(type);

  const today = TimeUtils.createLondonDate();
  const tomorrow = TimeUtils.createLondonDate();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dataToday = database.getByDate(today);
  const dataTomorrow = database.getByDate(tomorrow);

  const scheduleToday = PrayerUtils.createSchedule(dataToday!, type);
  const scheduleTomorrow = PrayerUtils.createSchedule(dataTomorrow!, type);

  const scheduleTodayValues = Object.values(scheduleToday);
  const nextPrayer = scheduleTodayValues.find((prayer) => !TimeUtils.isTimePassed(prayer.time)) || scheduleToday[0];

  const scheduleAtom = type === ScheduleType.Standard ? standardScheduleAtom : extraScheduleAtom;
  store.set(scheduleAtom, {
    ...schedule,
    type,
    today: scheduleToday,
    tomorrow: scheduleTomorrow,
    nextIndex: nextPrayer.index,
  });
};

export const incrementNextIndex = (type: ScheduleType) => {
  const isStandard = type === ScheduleType.Standard;
  const schedule = getSchedule(type);

  const isLastPrayer = schedule.nextIndex === Object.keys(schedule.today).length - 1;
  const nextIndex = isLastPrayer ? 0 : schedule.nextIndex + 1;

  const scheduleAtom = isStandard ? standardScheduleAtom : extraScheduleAtom;

  store.set(scheduleAtom, { ...schedule, nextIndex });
};

export const setAlertPreference = (prayerIndex: number, alertType: AlertType) => {
  const alertPreference = getAlertPreferences();

  store.set(alertPreferencesAtom, { ...alertPreference, [prayerIndex]: alertType });
};

export const setSelectedSound = (soundIndex: number) => {
  const soundPreferences = getSoundPreferences();

  store.set(soundPreferencesAtom, { ...soundPreferences, selected: soundIndex });
};

export const setSelectedPrayerIndex = (index: number, scheduleType: ScheduleType) => {
  const overlay = getOverlay();
  store.set(overlayAtom, { ...overlay, selectedPrayerIndex: index, scheduleType });
};

export const setAppLoading = (isLoading: boolean) => {
  const app = getApp();
  store.set(appAtom, { ...app, isLoading });
};
