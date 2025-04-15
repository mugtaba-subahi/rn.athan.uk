import { format, addDays, isBefore } from 'date-fns';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import * as TimeUtils from '@/shared/time';
import { AlertType } from '@/shared/types';

export interface ScheduledNotification {
  id: string;
  date: string;
  time: string;
  englishName: string;
  arabicName: string;
  alertType: AlertType;
}

/**
 * Creates notification trigger date from prayer date and time
 */
export const genTriggerDate = (date: string, time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const triggerDate = TimeUtils.createLondonDate(date);

  triggerDate.setHours(hours, minutes, 0, 0);
  return triggerDate;
};

/**
 * Gets notification sound based on alert type
 */
export const getNotificationSound = (alertType: AlertType, soundIndex: number): string | null => {
  if (alertType !== AlertType.Sound) return null;

  return `athan${soundIndex + 1}.wav`;
};

/**
 * Creates notification content based on alert type
 */
export const genNotificationContent = (
  englishName: string,
  arabicName: string,
  alertType: AlertType,
  soundIndex: number
): Notifications.NotificationContentInput => {
  return {
    title: `${englishName} \u2004`,
    body: `\u200E${arabicName}`, // LTR mark
    sound: getNotificationSound(alertType, soundIndex) || undefined,
    color: '#5a3af7',
    autoDismiss: false,
    sticky: false,
    priority: Notifications.AndroidNotificationPriority.MAX,
    interruptionLevel: 'active',
  };
};

/**
 * Checks if a scheduled notification is outdated
 */
export const isNotificationOutdated = (notification: ScheduledNotification): boolean => {
  const triggerDate = genTriggerDate(notification.date, notification.time);
  const now = TimeUtils.createLondonDate();

  return isBefore(triggerDate, now);
};

/**
 * Checks if a given prayer time is in the future
 */
export const isPrayerTimeInFuture = (date: string, time: string): boolean => {
  const triggerDate = genTriggerDate(date, time);
  const now = TimeUtils.createLondonDate();
  return triggerDate > now;
};

/**
 * Generates X consecutive dates starting from given date (inclusive)
 * Index 0 is the start date (today if not specified)
 */
export const genNextXDays = (numberOfDays: number): string[] => {
  const today = TimeUtils.createLondonDate();

  return Array.from({ length: numberOfDays }, (_, i) => {
    const date = addDays(today, i);
    return format(date, 'yyyy-MM-dd');
  });
};

export const createDefaultAndroidChannel = async () => {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('athan_1', {
    name: 'Athan 1',
    sound: 'athan1.wav',
    importance: Notifications.AndroidImportance.MAX,
    enableVibrate: true,
    vibrationPattern: [0, 250, 250, 250],
  });
};
