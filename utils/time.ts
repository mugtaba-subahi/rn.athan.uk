import { IPrayerInfo, ITransformedToday, DaySelection } from "@/types/prayers";

// Takes 'today' or 'tomorrow' and returns date in YYYY-MM-DD format.
// Used for prayer time calculations and date display formatting.
export const getTodayOrTomorrow = (day: DaySelection = 'today'): string => {
  const date = new Date();
  if (day === 'tomorrow') {
    date.setDate(date.getDate() + 1);
  }
  return date.toISOString().split('T')[0];
};

// Calculates time difference in milliseconds between now and target prayer time.
// Handles edge cases like passing midnight and adjusts for tomorrow's prayers.
export const getTimeDifference = (targetTime: string, date: string = getTodayOrTomorrow('today')): number => {
  const [hours, minutes] = targetTime.split(':').map(Number);
  const now = new Date();
  const target = new Date(date);
  target.setHours(hours, minutes, 0, 0);

  const diff = target.getTime() - now.getTime();
  
  const threshold = -1000;
  
  // Only add a day if we're actually past the time and not exactly at the time
  // using threshold to account for millisecond precision
  if (diff < threshold) { 
    target.setDate(target.getDate() + 1);
    return target.getTime() - now.getTime();
  }

  return diff;
};

// Compares given time string with current time to check if it's passed.
// Used to determine prayer status and handle UI state changes.
export const isTimePassed = (time: string): boolean => {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  
  target.setHours(hours, minutes, 0);

  return now > target;
};

// Formats milliseconds into readable time units (hours, minutes, seconds).
// Handles edge cases like zero values and returns condensed format (e.g., "1h 30m 5s").
export const formatTime = (ms: number): string => {
  if (ms < 0) return '0s';

  const MS_IN_HOUR = 3600000;
  const MS_IN_MINUTE = 60000;
  const MS_IN_SECOND = 1000;

  const h = Math.floor(ms / MS_IN_HOUR);
  const m = Math.floor((ms % MS_IN_HOUR) / MS_IN_MINUTE);
  const s = Math.floor((ms % MS_IN_MINUTE) / MS_IN_SECOND);

  return [h && `${h}h`, m && `${m}m`, `${s}s`].filter(Boolean).join(' ');
};

// Adds specified minutes to a time string and handles day wraparound.
// Returns formatted time string in 24-hour format (HH:mm).
export const addMinutes = (time: string, minutes: number): string => {
  const [h, m] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m + minutes);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// Gets prayer information including name, time remaining, and current status.
// Returns formatted object with timer display and prayer details.
export const getCurrentPrayerInfo = (
  prayers: ITransformedToday,
  prayerIndex: number,
  selectedDate: DaySelection = 'today',
  selectedPrayerIndex: number | null = null
): IPrayerInfo => {
  if (!prayers || Object.keys(prayers).length === 0) return { timerName: '', timeDisplay: '' };

  // Use selected prayer index if in overlay mode, otherwise use next prayer index
  const indexToUse = selectedPrayerIndex !== null ? selectedPrayerIndex : prayerIndex;
  const prayer = prayers[indexToUse];
  
  if (!prayer) return { timerName: 'All prayers passed', timeDisplay: '' };

  const diff = getTimeDifference(prayer.time, getTodayOrTomorrow(selectedDate));

  return {
    timerName: prayer.english,
    timeDisplay: formatTime(diff),
    timeDifference: diff,
    currentPrayer: prayer
  };
};

// Checks if provided date is either today or in the future.
// Used to filter past prayer times and validate date selections.
export const isDateTodayOrFuture = (date: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  return checkDate >= today;
};
