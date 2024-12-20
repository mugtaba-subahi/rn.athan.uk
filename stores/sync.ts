import { atom } from 'jotai';
import { atomWithStorage, loadable } from 'jotai/utils';
import { getDefaultStore } from 'jotai/vanilla';

import * as Api from '@/api/client';
import { PRAYER_INDEX_ASR } from '@/shared/constants';
import logger from '@/shared/logger';
import * as TimeUtils from '@/shared/time';
import { DaySelection, ScheduleType } from '@/shared/types';
import * as Database from '@/stores/database';
import * as ScheduleStore from '@/stores/schedule';
import * as Timer from '@/stores/timer';

const store = getDefaultStore();

// TODO: Remove below check
Database.cleanup();
// TODO: Remove above check

// --- Atoms ---

export const syncLoadable = loadable(atom(async () => sync()));
export const dateAtom = atomWithStorage<string>('display_date', '', Database.mmkvStorage, { getOnInit: true });

// --- Actions ---

const setDate = () => {
  const schedule = store.get(ScheduleStore.standardScheduleAtom);
  const currentDate = schedule.today[PRAYER_INDEX_ASR].date;

  store.set(dateAtom, currentDate);
};

const shouldFetchNextYear = (): boolean => {
  const fetchedYears = Database.getItem('fetched_years') || {};
  const nextYear = TimeUtils.getCurrentYear() + 1;
  return TimeUtils.isDecember() && !fetchedYears[nextYear];
};

const initializeAppState = () => {
  ScheduleStore.setSchedule(ScheduleType.Standard);
  ScheduleStore.setSchedule(ScheduleType.Extra);

  setDate();

  Timer.startTimers();
};

const needsDataUpdate = (): boolean => {
  const dateSaved = store.get(dateAtom);
  const standardSchedule = store.get(ScheduleStore.standardScheduleAtom);
  const dateNow = TimeUtils.getDateTodayOrTomorrow(DaySelection.Today);

  return dateSaved !== dateNow || Object.keys(standardSchedule.today).length === 0 || shouldFetchNextYear();
};

const updatePrayerData = async () => {
  logger.info('SYNC: Starting data refresh');
  Database.cleanup();

  try {
    const { currentYearData, nextYearData, currentYear } = await Api.fetchPrayerData(shouldFetchNextYear());

    Database.saveAllPrayers(currentYearData);
    Database.markYearAsFetched(currentYear);

    if (nextYearData) {
      Database.saveAllPrayers(nextYearData);
      Database.markYearAsFetched(currentYear + 1);
    }
  } catch (error) {
    logger.error('SYNC: Failed to update prayer data', { error });
    throw error;
  }
};

// App entry point and manages midnight synchronization
export const sync = async () => {
  try {
    if (needsDataUpdate()) await updatePrayerData();
    else logger.info('SYNC: Data already up to date');

    initializeAppState();
  } catch (error) {
    logger.error('SYNC: Failed', { error });
    throw error;
  }
};
