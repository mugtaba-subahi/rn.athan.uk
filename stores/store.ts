import { atom } from 'jotai';
import { IScheduleNow } from '@/shared/types';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { jotaiStorage } from '@/stores/database';
import { PRAYERS_ENGLISH } from '@/shared/constants';

// App Status
export const isLoadingAtom = atom<boolean>(true);
export const hasErrorAtom = atom<boolean>(false);

// Remove these atoms
export const dateTodayAtom = atom<string>('');
export const prayersTodayAtom = atom<IScheduleNow>({});
export const prayersTomorrowAtom = atom<IScheduleNow>({});
export const prayersNextIndexAtom = atom<number>(-1);
export const prayersSelectedIndexAtom = atom<number>(-1);

// Overlay State
export const overlayVisibleAtom = atom<boolean>(false);
export const overlayStartOpeningAtom = atom<boolean>(false);
export const overlayFinishedOpeningAtom = atom<boolean>(false);
export const overlayStartClosingAtom = atom<boolean>(false);
export const overlayFinishedClosingAtom = atom<boolean>(false);
export const overlayControlsAtom = atom<{
  open?: () => void;
  close?: () => void;
}>({});

// Measurement Types
export interface PageCoordinates {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
}

// Measurements State
export const absoluteNextPrayerMeasurementsAtom = atom<PageCoordinates | null>(null);
export const absolutePrayerMeasurementsAtom = atom<Record<number, PageCoordinates>>({});
export const absoluteDateMeasurementsAtom = atom<PageCoordinates| null>(null);

export const prayerNextIndexAtom = atom<number>(-1);
export const extraNextIndexAtom = atom<number>(-1);

export const prayerMeasurementsAtom = atom<Record<number, Measurements>>({});
export const extraMeasurementsAtom = atom<Record<number, Measurements>>({});

// Alert Preferences
export enum AlertType {
  Off = 0,
  Notification = 1,
  Vibrate = 2,
  Sound = 3
}

export interface AlertPreferences {
  [prayerIndex: number]: AlertType;
}

const createInitialAlertPreferences = (): AlertPreferences => {
  const preferences: AlertPreferences = {};
  
  PRAYERS_ENGLISH.forEach((_, index) => {
    preferences[index] = AlertType.Off;
  });

  return preferences;
};

export const alertPreferencesAtom = atomWithStorage<AlertPreferences>(
  'alert_preferences',
  createInitialAlertPreferences(),
  createJSONStorage(() => jotaiStorage),
  { getOnInit: true }
);