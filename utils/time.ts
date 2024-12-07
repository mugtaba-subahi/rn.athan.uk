import { DaySelection } from "@/types/prayers";
import { format, addDays, setHours, setMinutes, isAfter, addMinutes as addMins, intervalToDuration, isFuture, isToday, parseISO, subDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// Creates a new Date object in London timezone
// Converts input date or current date to London time
export const createLondonDate = (date?: Date | string): Date => {
  const targetDate = date ? new Date(date) : new Date();
  const londonTime = formatInTimeZone(targetDate, 'Europe/London', 'yyyy-MM-dd HH:mm:ssXXX');
  return new Date(londonTime);
};

// Returns formatted date string for today or tomorrow
// Based on the provided day selection parameter
export const getTodayOrTomorrowDate = (daySelection: DaySelection = 'today'): string => {
  let date = createLondonDate();
  
  if (daySelection === 'tomorrow') {
    date = addDays(date, 1);
  }

  return format(date, 'yyyy-MM-dd');
};

// Calculates time difference in milliseconds between now and target time
// Returns adjusted time difference if the target time has passed
export const getTimeDifference = (targetTime: string, date: string = getTodayOrTomorrowDate('today')): number => {
  const [hours, minutes] = targetTime.split(':').map(Number);
  const now = createLondonDate();
  let target = createLondonDate(date);
  target = setHours(setMinutes(target, minutes), hours);

  const diff = target.getTime() - now.getTime();
  
  const threshold = -1000;
  
  if (diff < threshold) {
    target = addDays(target, 1);
    return target.getTime() - now.getTime();
  }

  return diff;
};

// Checks if a given time has already passed today
// Compares target time with current London time
export const isTimePassed = (time: string): boolean => {
  const [hours, minutes] = time.split(':').map(Number);
  const now = createLondonDate();
  let target = createLondonDate();
  target = setHours(setMinutes(target, minutes), hours);

  return isAfter(now, target);
};

// Converts milliseconds into human-readable time format
// Returns formatted string with hours, minutes, and seconds
export const formatTime = (ms: number): string => {
  if (ms < 0) return '0s';
  
  const duration = intervalToDuration({ start: 0, end: ms });
  const { hours, minutes, seconds } = duration;
  
  return [
    hours && `${hours}h`,
    minutes && `${minutes}m`,
    seconds !== undefined ? `${seconds}s` : '0s'
  ].filter(Boolean).join(' ');
};

// Adds specified minutes to a given time string
// Returns new time in HH:mm format
export const addMinutes = (time: string, minutes: number): string => {
  const [h, m] = time.split(':').map(Number);
  let date = createLondonDate();
  date = setHours(setMinutes(date, m), h);
  date = addMins(date, minutes);
  return format(date, 'HH:mm');
};

// Checks if a date is either today or in the future
// Returns true for today and future dates, false for past dates
export const isDateTodayOrFuture = (date: string): boolean => {
  const parsedDate = createLondonDate(date);
  return isToday(parsedDate) || isFuture(parsedDate);
};

// Formats a date string into a readable format
// Returns date in format: "Day, DD MMM YYYY"
export const formatDate = (date: string): string => {
  return format(createLondonDate(date), 'EEE, dd MMM yyyy');
};

// Calculates the start time of the last third of the night
// Uses Maghrib and Fajr times to determine night duration
export const getLastThirdOfNight = (magribTime: string, fajrTime: string): string => {
  const [mHours, mMinutes] = magribTime.split(':').map(Number);
  const [fHours, fMinutes] = fajrTime.split(':').map(Number);
  
  // Maghrib from yesterday
  let maghrib = createLondonDate();
  maghrib = subDays(setHours(setMinutes(maghrib, mMinutes), mHours), 1);

  // Fajr from today
  let fajr = createLondonDate();
  fajr = setHours(setMinutes(fajr, fMinutes), fHours);

  // Calculate night duration and last third start
  const nightDuration = fajr.getTime() - maghrib.getTime();
  const lastThirdStart = new Date(maghrib.getTime() + (nightDuration * 2/3));

  // add 10 minutes to the last third start time
  const minutesToAdd = 10;
  lastThirdStart.setMinutes(lastThirdStart.getMinutes() + minutesToAdd);

  // Return formatted time string in 24-hour format (HH:mm)
  return format(lastThirdStart, 'HH:mm');
};