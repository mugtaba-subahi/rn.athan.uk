import * as Notifications from 'expo-notifications';

import logger from '@/shared/logger';
import * as NotificationUtils from '@/shared/notifications';
import { AlertType, ScheduleType } from '@/shared/types';
import * as Database from '@/stores/database';
import * as NotificationStore from '@/stores/notifications';

export const addOneScheduledNotificationForPrayer = async (
  englishName: string,
  arabicName: string,
  date: string,
  time: string,
  alertType: AlertType
): Promise<NotificationUtils.ScheduledNotification> => {
  const sound = await NotificationStore.getSoundPreference();
  const triggerDate = NotificationUtils.genTriggerDate(date, time);

  const content = NotificationUtils.genNotificationContent(englishName, arabicName, alertType, sound);

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content,
      trigger: triggerDate,
    });

    const notification = { id, date, time, englishName, arabicName, alertType };

    logger.info('NOTIFICATION SYSTEM: Scheduled:', notification);
    return notification;
  } catch (error) {
    logger.error('NOTIFICATION SYSTEM: Failed to schedule:', error);
    throw error;
  }
};

export const cancelScheduledNotificationById = async (notificationId: string) => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);

  logger.info('NOTIFICATION SYSTEM: Cancelled:', notificationId);
};

export const clearAllScheduledNotificationForPrayer = async (scheduleType: ScheduleType, prayerIndex: number) => {
  const notifications = Database.getAllScheduledNotificationsForPrayer(scheduleType, prayerIndex);

  // Cancel all notifications
  const promises = notifications.map((notification) => Notifications.cancelScheduledNotificationAsync(notification.id));
  await Promise.all(promises);

  logger.info('NOTIFICATION SYSTEM: Cancelled all notifications for prayer:', { scheduleType, prayerIndex });
};
