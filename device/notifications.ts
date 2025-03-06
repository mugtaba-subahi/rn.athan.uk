import { format } from 'date-fns';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import logger from '@/shared/logger';
import * as NotificationUtils from '@/shared/notifications';
import { AlertType, ScheduleType } from '@/shared/types';
import * as Database from '@/stores/database';
import * as NotificationStore from '@/stores/notifications';

/**
 * Deletes all Android notification channels
 * @returns The number of channels deleted
 */
export const deleteAllAndroidChannels = async (): Promise<number> => {
  if (Platform.OS !== 'android') return 0;

  try {
    // Get all existing notification channels
    const channels = await Notifications.getNotificationChannelsAsync();
    logger.info(`NOTIFICATION SYSTEM: Found ${channels.length} existing channels`);

    // Delete all existing channels
    if (channels.length > 0) {
      const deletePromises = channels.map((channel) => Notifications.deleteNotificationChannelAsync(channel.id));
      await Promise.all(deletePromises);
      logger.info(`NOTIFICATION SYSTEM: Deleted ${channels.length} notification channels`);
    }

    return channels.length;
  } catch (error) {
    logger.error('NOTIFICATION SYSTEM: Failed to delete notification channels:', error);
    return 0;
  }
};

export const updateAndroidChannel = async (sound: number) => {
  if (Platform.OS !== 'android') return;

  try {
    await deleteAllAndroidChannels();

    // Create a unique channel ID with timestamp
    const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm-ss');
    const channelId = `athan_${sound + 1}_${timestamp}`;

    // Create new channel with enhanced properties
    await Notifications.setNotificationChannelAsync(channelId, {
      name: channelId,
      sound: `athan${sound + 1}.wav`,
      importance: Notifications.AndroidImportance.MAX,
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
      enableLights: true,
      showBadge: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      lightColor: '#2c1c77',
      bypassDnd: true,
    });

    // Store the channel ID for later use
    Database.setCurrentChannelId(channelId);

    logger.info('NOTIFICATION SYSTEM: Created new channel:', channelId);

    return channelId;
  } catch (error) {
    logger.error('NOTIFICATION SYSTEM: Failed to update channel:', error);
    // Just return a default channel ID
    return `athan_${sound + 1}`;
  }
};

export const addOneScheduledNotificationForPrayer = async (
  englishName: string,
  arabicName: string,
  date: string,
  time: string,
  alertType: AlertType
): Promise<NotificationUtils.ScheduledNotification> => {
  const sound = NotificationStore.getSoundPreference();
  const triggerDate = NotificationUtils.genTriggerDate(date, time);
  const content = NotificationUtils.genNotificationContent(englishName, arabicName, alertType, sound);

  // Use the stored channel ID, falling back to a default if not available
  const channelId =
    Platform.OS === 'android' && alertType === AlertType.Sound
      ? Database.getCurrentChannelId() || `athan_${sound + 1}`
      : undefined;

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
        channelId: channelId,
      },
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
