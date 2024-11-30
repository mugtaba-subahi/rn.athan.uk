import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

import { PRAYERS_ENGLISH } from '@/shared/constants';
import {
  AlertPreferences,
  AlertType,
  ScheduleStore,
  AppStore,
  DateStore,
  OverlayStore,
  SoundPreferences,
  ScheduleType,
  ListStore,
} from '@/shared/types';
import { database } from '@/stores/database';

// Custom storage for MMKV
const mmkvStorage = createJSONStorage(() => ({
  getItem: (key: string) => {
    const value = database.getString(key);
    return value ? JSON.parse(value) : null;
  },
  setItem: (key: string, value: unknown) => {
    database.set(key, JSON.stringify(value));
  },
  removeItem: (key: string) => {
    database.delete(key);
  },
}));

// Initial states for alerts
const createInitialAlertPreferences = (): AlertPreferences => {
  const preferences: AlertPreferences = {};
  PRAYERS_ENGLISH.forEach((_, index) => {
    preferences[index] = AlertType.Off;
  });
  return preferences;
};

export const alertPreferencesAtom = atomWithStorage('alertPreferences', createInitialAlertPreferences(), mmkvStorage, {
  getOnInit: true,
});

// Add initial state for sound
const initialSoundPreferences: SoundPreferences = {
  selected: 1,
};

export const soundPreferencesAtom = atomWithStorage('soundPreferences', initialSoundPreferences, mmkvStorage, {
  getOnInit: true,
});

export const appAtom = atom<AppStore>({
  isLoading: true,
  hasError: false,
});

export const dateAtom = atom<DateStore>({
  current: '',
  measurements: null,
});

const createScheduleAtom = (scheduleType: ScheduleType) =>
  atom<ScheduleStore>({
    type: scheduleType,
    today: {},
    tomorrow: {},
    nextIndex: 0,
    selectedIndex: -1,
  });

export const standardScheduleAtom = createScheduleAtom(ScheduleType.Standard);
export const extraScheduleAtom = createScheduleAtom(ScheduleType.Extra);

export const overlayAtom = atom<OverlayStore>({
  isOn: false,
});

export const pagePositionAtom = atom<number>(0);

export const listAtom = atom<ListStore>({
  standard: null,
  extra: null,
});
