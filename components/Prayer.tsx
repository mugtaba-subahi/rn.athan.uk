import { StyleSheet, View, Pressable, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, withDelay, useSharedValue, interpolateColor } from 'react-native-reanimated';
import { useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';

import { COLORS, TEXT, PRAYER, ANIMATION, PRAYERS_ENGLISH, PRAYER_INDEX_LAST_THIRD, PRAYER_INDEX_FAJR } from '@/shared/constants';
import Alert from './Alert';
import PrayerTime from './PrayerTime';
import { useAtomValue } from 'jotai';
import { scheduleAtom } from '@/stores/store';
import { getCascadeDelay } from '@/shared/prayer';

interface Props { index: number; isOverlay?: boolean; }

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Prayer({ index, isOverlay = false }: Props) {
  const schedule = useAtomValue(scheduleAtom);

  const prayer = schedule.today[index];
  const isPassed = index < schedule.nextIndex
  const isNext = index === schedule.nextIndex;
  const isLastThird = index === PRAYER_INDEX_LAST_THIRD;

  const viewRef = useRef<View>(null);

  const colorProgress = useSharedValue(isPassed || isNext ? 1 : 0);

  // handle non-overlay animations
  useEffect(() => {
    if (isNext) {
      colorProgress.value = withDelay(ANIMATION.duration, withTiming(1, { duration: ANIMATION.durationSlow }));
      return;
    };

    // Isha prayer just finished
    if (schedule.nextIndex === PRAYER_INDEX_FAJR) {
      colorProgress.value = withDelay(
        getCascadeDelay(index),
        withTiming(0, { duration: ANIMATION.durationSlow })
      );
      return;
    }
  }, [schedule.nextIndex]);

  // handle overlay animations
  // useEffect(() => {
  //   if (isOverlay && schedule.selectedIndex === schedule.nextIndex) {
  //     backgroundOpacity.value = 1;
  //   } else {
  //     backgroundOpacity.value = 0;
  //   }
  // }, [isOverlayOn]);

  // const handlePress = () => {
  //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  //   if (isOverlay) {
  //     app.setIsOverlayOn(false);
  //     return;
  //   }

  //   app.setIsOverlayOn(true);
  // };

  const animatedTextStyle = useAnimatedStyle(() => {
    if (isOverlay) return {
      color: COLORS.activePrayer,
    };

    return {
      color: interpolateColor(
        colorProgress.value,
        [0, 1],
        [COLORS.inactivePrayer, COLORS.activePrayer]
      ),
    };
  });

  return (
    <AnimatedPressable
      ref={viewRef}
      style={styles.container}
    // onPress={handlePress}
    >
      <Animated.Text style={[styles.text, styles.english, animatedTextStyle]}>{prayer.english}</Animated.Text>
      <Animated.Text style={[styles.text, styles.arabic, animatedTextStyle]}>{prayer.arabic}</Animated.Text>
      <PrayerTime index={index} isOverlay={isOverlay} />
      <Alert index={index} isOverlay={isOverlay} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: PRAYER.height,
  },
  text: {
    fontFamily: TEXT.famiy.regular,
    fontSize: TEXT.size,
    color: '#a0bcf487',
  },
  english: {
    paddingLeft: PRAYER.padding.left,
  },
  arabic: {
    flex: 1,
    textAlign: 'right',
    paddingRight: 15,
  },
});