import { useAtomValue } from 'jotai';

import * as TimeUtils from '@/shared/time';
import { ScheduleType } from '@/shared/types';
import { standardScheduleAtom, extraScheduleAtom } from '@/stores/schedule';

export const useSchedule = (type: ScheduleType) => {
  const isStandard = type === ScheduleType.Standard;
  const schedule = useAtomValue(isStandard ? standardScheduleAtom : extraScheduleAtom);

  const lastIndex = Object.keys(schedule.today).length - 1;
  const lastPrayer = schedule.today[lastIndex];
  const isLastPrayerPassed = TimeUtils.isTimePassed(lastPrayer.time);

  return {
    schedule,
    isStandard,
    isLastPrayerPassed,
  };
};