export const PRAYERS_ENGLISH = ["Fajr", "Sunrise", "Duha", "Dhuhr", "Asr", "Magrib", "Isha", "Last Third"];
export const PRAYERS_ARABIC = ["الفجر", "الشروق", "الضحى", "الظهر", "العصر", "المغرب", "العشاء", "آخر ثلث"];

export const PRAYER_INDEX_FAJR = 0;
export const PRAYER_INDEX_ISHA = 6;
export const PRAYER_INDEX_LAST_THIRD = 7;
export const PRAYERS_LENGTH_FAJR_TO_ISHA = 7;

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
  gradientStart: '#031a4c',
  gradientEnd: '#5b1eaa',

  activePrayer: '#ffffff',
  inactivePrayer: '#a1b6d57f',

  activeBackground: '#005dd5',
  activeBackgroundShadow: '#132063',
  inactiveBackground: '#272b7c',

  textSecondary: '#8BA3C7',
};

export const ANIMATION = {
  duration: 200,
  durationSlow: 1000,
  durationSlower: 1500,
  durationSlowest: 2250,
  overlayDelay: 150,
  cascadeDelay: 150,
};

export const OVERLAY = {
  closeThreshold: 2000,
   zindexes: {
    overlay: 2,
    background: -999,
    off: {
      countdown: 999,
      prayerNotSelected: -1,
      activeBackground: -2,
      longDate: -3,
      glow: -3,
    },
    on: {
      countdown: 999,
      prayerSelected: 4,
      longDate: -1,
      glow: 1,
    },
  },
};

export const PRAYER = {
  height: 57,
  padding: {
    left: 20,
    right: 25,
  },
  border: {
    borderRadius: 7,
  },
  shadow: {
    shadowOffset: { width: 1, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowColor: COLORS.activeBackgroundShadow,
  }
};
