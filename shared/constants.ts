import * as TimeUtils from '@/shared/time';

export const PRAYERS_ENGLISH = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Magrib', 'Isha'];
export const PRAYERS_ARABIC = ['الفجر', 'الشروق', 'الظهر', 'العصر', 'المغرب', 'العشاء'];
export const PRAYER_INDEX_ASR = 3; // Used to display the date

export const EXTRAS_ENGLISH = ['Last Third', 'Suhoor', 'Duha', 'Istijaba'];
export const EXTRAS_ARABIC = ['آخر ثلث', 'السحور', 'الضحى', 'استجابة'];
export const ISTIJABA_INDEX = 3;

export const NOTIFICATION_ROLLING_DAYS = 6;
export const NOTIFICATION_REFRESH_HOURS = 24;

export const SCHEDULE_LENGTHS = {
  standard: PRAYERS_ENGLISH.length,
  extra: TimeUtils.isFriday() ? EXTRAS_ENGLISH.length : 3, // remove Istijaba on non-Fridays
};

export const TIME_ADJUSTMENTS = {
  suhoor: -45, // minutes before fajr
  duha: 20, // minutes after sunrise
  istijaba: -59, // minutes before magrib
};

export const TEXT = {
  family: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
  },
  size: 18,
  sizeSmall: 16,
  sizeSmaller: 14,
  opacity: 0.5,
  opacityHigher: 0.75,
};

export const SCREEN = {
  paddingHorizontal: 12,
};

export const COLORS = {
  gradientScreen1Start: '#031a4c',
  gradientScreen1End: '#5b1eaa',

  gradientScreen2Start: '#320088',
  gradientScreen2End: '#140035',

  activePrayer: '#ffffff',
  inactivePrayer: '#8aa9d662',

  activeBackground: '#0847e5',
  standardActiveBackgroundShadow: '#081a76',
  extraActiveBackgroundShadow: '#061e5b',

  textSecondary: '#a0c8ff89',

  glows: {
    overlay: '#8000ff',
    bottomsheet: '#8000ff',
  },
};

export const ANIMATION = {
  duration: 200,
  durationSlow: 1000,
  durationSlower: 1500,
  durationSlowest: 2250,
  cascadeDelay: 150,
  popupDuration: 900,
  debounce: 1000,
};

export const OVERLAY = {
  zindexes: {
    overlay: 2,
    glow: -1,
  },
};

export const STYLES = {
  timer: {
    height: 60,
  },
  prayer: {
    height: 57,
    padding: {
      left: 20,
      right: 20,
    },
    border: {
      borderRadius: 8,
    },
    shadow: {
      shadowOffset: { width: 1, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
    },
  },
};
