import Storage from '@/stores/database';
import { createSchedule } from '@/shared/prayer';
import { PrayerType, IScheduleNow } from '@/shared/types';
import { useAtom } from 'jotai';
import { standardScheduleAtom, extraScheduleAtom, standardNextIndexAtom, extraNextIndexAtom } from '@/stores/store';

export default function useSchedule(type: PrayerType) {
  const isStandard = type === 'standard';

  const [standardSchedule, setStandardSchedule] = useAtom(standardScheduleAtom);
  const [extraSchedule, setExtraSchedule] = useAtom(extraScheduleAtom);

  const [standardNextIndex, setStandardNextIndex] = useAtom(standardNextIndexAtom);
  const [extraNextIndex, setExtraNextIndex] = useAtom(extraNextIndexAtom);

  const schedule = isStandard ? standardSchedule : extraSchedule;
  const setSchedule = isStandard ? setStandardSchedule : setExtraSchedule;

  const nextIndex = isStandard ? standardNextIndex : extraNextIndex;
  const setNextIndex = isStandard ? setStandardNextIndex : setExtraNextIndex;

  // Set today and tomorrow prayers in the store
  const setTodayAndTomorrow = () => {
    console.log(`Setting ${type} schedule`);

    const todayRaw = Storage.prayers.getTodayOrTomorrow('today');
    const tomorrowRaw = Storage.prayers.getTodayOrTomorrow('tomorrow');

    if (!todayRaw || !tomorrowRaw) throw new Error('Data not found');
    
    const todaySchedule = createSchedule(todayRaw, type);
    const tomorrowSchedule = createSchedule(tomorrowRaw, type);

    setSchedule(todaySchedule);

    console.log(`Finished setting ${type} schedule`);
    return { today: todaySchedule, tomorrow: tomorrowSchedule };
  }

  // Initialize next prayer index
  const updateNextIndex = (prayers: IScheduleNow) => {
    console.log('Setting next prayer');

    const schedule = Object.values(prayers);
    const nextPrayer = schedule.find(prayer => !prayer.passed) || prayers[0];
    
    setNextIndex(nextPrayer.index);

    console.log('Finished setting next prayer');
    return nextPrayer;
  };

  // Mark next prayer as passed and set next prayer index
  // setPrayersNextIndex(nextPrayer.index === 5 ? 0 : prayersNextIndex + 1);
  // Reset to Fajr if last prayer has passed
  // console.log('Finished setting next prayer');

  return {
    schedule,
    nextIndex,
    setTodayAndTomorrow,
    updateNextIndex
  };
};