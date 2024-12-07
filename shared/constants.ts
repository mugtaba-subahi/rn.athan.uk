export const PRAYERS_ENGLISH = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Magrib', 'Isha'];
export const PRAYERS_ARABIC = ['الفجر', 'الشروق', 'الظهر', 'العصر', 'المغرب', 'العشاء'];
export const PRAYER_INDEX_ASR = 3; // Used to display the date

export const EXTRAS_ENGLISH = ['Last Third', 'Suhoor', 'Duha', 'Istijaba'];
export const EXTRAS_ARABIC = ['آخر ثلث', 'السحور', 'الضحى', 'استجابة'];

export const TIME_ADJUSTMENTS = {
  suhoor: -45, // minutes before fajr
  duha: 20, // minutes after sunrise
  istijaba: -59, // minutes before magrib
};

export const TEXT = {
  famiy: {
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
};

export const ANIMATION = {
  duration: 200,
  durationSlow: 1000,
  durationSlower: 1500,
  durationSlowest: 2250,
  overlayDelay: 150,
  cascadeDelay: 150,
  popupDuration: 1500,
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
