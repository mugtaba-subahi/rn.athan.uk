import { atom } from 'jotai';
import { getDefaultStore } from 'jotai/vanilla';

import * as TimeUtils from '@/shared/time';
import * as Types from '@/shared/types';
import { getOverlay } from '@/stores/overlay';
import { getSchedule, incrementNextIndex } from '@/stores/schedule';

const store = getDefaultStore();

// --- Atoms ---

const createCountdownAtom = () =>
  atom<Types.CountdownStore>({
    timeLeft: 10,
    name: 'Fajr',
  });

export const standardCountdownAtom = createCountdownAtom();
export const extraCountdownAtom = createCountdownAtom();
export const overlayCountdownAtom = createCountdownAtom();

// --- Actions ---

const updateCountdown = (type: Types.ScheduleType) => {
  const isStandard = type === Types.ScheduleType.Standard;
  const countdownAtom = isStandard ? standardCountdownAtom : extraCountdownAtom;

  const schedule = getSchedule(type);
  const prayer = schedule.today[schedule.nextIndex];
  const countdown = TimeUtils.calculateCountdown(prayer);

  store.set(countdownAtom, { timeLeft: countdown.timeLeft, name: countdown.name });

  // Start new countdown
  TimeUtils.countdown(countdown.timeLeft, {
    onTick: (secondsLeft) => {
      store.set(countdownAtom, { timeLeft: secondsLeft, name: countdown.name });
    },
    onFinish: () => {
      incrementNextIndex(type);

      const { nextIndex } = getSchedule(type);
      if (nextIndex === 0) return;

      updateCountdown(type);
    },
  });
};

export const updateOverlayCountdown = (type: Types.ScheduleType, selectedIndex: number) => {
  const schedule = getSchedule(type);
  const prayer = schedule.today[selectedIndex];

  const countdown = TimeUtils.calculateCountdown(prayer);

  // Start new countdown
  TimeUtils.countdown(countdown.timeLeft, {
    onTick: (secondsLeft) => {
      store.set(overlayCountdownAtom, { timeLeft: secondsLeft, name: countdown.name });
    },
    onFinish: () => {},
  });

  store.set(overlayCountdownAtom, { timeLeft: countdown.timeLeft, name: countdown.name });
};

export const startCountdowns = () => {
  const standardSchedule = getSchedule(Types.ScheduleType.Standard);

  const isScheduleFinishedStandard = TimeUtils.isLastPrayerPassed(standardSchedule);
  const isScheduleFinishedExtra = TimeUtils.isLastPrayerPassed(standardSchedule);

  if (!isScheduleFinishedStandard) updateCountdown(Types.ScheduleType.Standard);
  if (!isScheduleFinishedExtra) updateCountdown(Types.ScheduleType.Extra);
  if (isScheduleFinishedStandard && isScheduleFinishedStandard) {
    // setinterval to get date from store, get todays date and compare. if same, do nothing. if different, update schedule, call setSchedule twice
  }

  const overlay = getOverlay();
  updateOverlayCountdown(overlay.scheduleType, overlay.selectedPrayerIndex);
};
