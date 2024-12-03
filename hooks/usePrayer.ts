import { useAtomValue } from 'jotai';

import * as TimeUtils from '@/shared/time';
import { ScheduleType } from '@/shared/types';
import { standardScheduleAtom, extraScheduleAtom } from '@/stores/schedule';

export const usePrayer = (type: ScheduleType, index: number = 0) => {
  const isStandard = type === ScheduleType.Standard;

  const schedule = useAtomValue(isStandard ? standardScheduleAtom : extraScheduleAtom);

  const prayer = schedule.today[index];
  const isPassed = TimeUtils.isTimePassed(prayer.time);
  const isLastPrayerPassed = TimeUtils.isLastPrayerPassed(schedule);
  const isNext = index === schedule.nextIndex;

  const ui = {
    initialColorPos: isPassed || isNext ? 1 : 0,
  };

  return {
    ...prayer,
    isStandard,
    schedule,
    isPassed,
    isNext,
    isLastPrayerPassed,
    ui,
  };
};
