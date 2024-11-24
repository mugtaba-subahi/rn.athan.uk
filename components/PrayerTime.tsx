import { StyleSheet, View } from 'react-native';
import { withTiming, useSharedValue, withDelay, useAnimatedStyle, interpolateColor } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { TEXT, ANIMATION, COLORS, PRAYER_INDEX_LAST_THIRD, PRAYER_INDEX_FAJR } from '@/shared/constants';
import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { dateAtom, extraScheduleAtom, standardScheduleAtom } from '@/stores/store';
import { getCascadeDelay } from '@/shared/prayer';
import { ScheduleType } from '@/shared/types';
import { isTimePassed } from '@/shared/time';

interface Props {
  index: number;
  type: ScheduleType;
  isOverlay: boolean;
};


export default function PrayerTime({ index, type, isOverlay = false }: Props) {
  const isStandard = type === ScheduleType.Standard;
  const { today, tomorrow, nextIndex, selectedIndex } = useAtomValue(isStandard ? standardScheduleAtom : extraScheduleAtom);
  const date = useAtomValue(dateAtom);

  // const overlayVisible = false;

  const prayer = today[index];
  const isPassed = isTimePassed(prayer.time);
  const isNext = index === nextIndex;
  const todayTime = today[index].time;
  const tomorrowTime = tomorrow[selectedIndex]?.time;

  const colorProgress = useSharedValue(isPassed || isNext ? 1 : 0);
  const overlayTodayColor = useSharedValue(0);
  const overlayTomorrowColor = useSharedValue(0);

  useEffect(() => {
    if (isNext) {
      colorProgress.value = withDelay(ANIMATION.duration, withTiming(1, { duration: ANIMATION.durationSlow }));
      // } else if (nextIndex === PRAYER_INDEX_FAJR && isLastThird) {
      // colorProgress.value = withTiming(1, { duration: ANIMATION.durationSlowest });
      // } else if (nextIndex !== PRAYER_INDEX_FAJR && isLastThird) {
      // colorProgress.value = withTiming(0, { duration: ANIMATION.durationSlowest });
    };
  }, [nextIndex]);

  useEffect(() => {
    if (index !== nextIndex && today[0].date !== date.current) {
      colorProgress.value = withDelay(
        getCascadeDelay(index),
        withTiming(0, { duration: ANIMATION.durationSlow })
      );
    }
  }, [date.current]);

  // useEffect(() => {
  //   if (isNext) {
  //     originalOpacity.value = withTiming(1, { duration: ANIMATION.durationSlow });
  //     colorProgress.value = withTiming(1, { duration: ANIMATION.durationSlow });
  //     return;
  //   }

  //   if (nextIndex === 0) {
  //     originalOpacity.value = withDelay(
  //       getCascadeDelay(index),
  //       withTiming(TEXT.opacity, { duration: ANIMATION.durationSlow })
  //     );
  //     colorProgress.value = withDelay(
  //       getCascadeDelay(index),
  //       withTiming(0, { duration: ANIMATION.durationSlow })
  //     );
  //     return;
  //   }

  //   if (!isPassed) {
  //     originalOpacity.value = withTiming(TEXT.opacity, { duration: ANIMATION.durationSlow });
  //     colorProgress.value = withTiming(0, { duration: ANIMATION.durationSlow });
  //   }
  // }, [nextIndex]);

  // useEffect(() => {
  //   // if overlay is visible, and this prayer is selected
  //   if (overlayVisible && selectedIndex === index) {

  //     if (isNext) {
  //       overlayTodayOpacity.value = 0;
  //     };

  //     // upcoming prayer
  //     if (!isPassed) {
  //       overlayTodayOpacity.value = withTiming(1, { duration: ANIMATION.duration });
  //     };

  //     // tomorrow's prayer
  //     if (isPassed) {
  //       originalOpacity.value = withTiming(0, { duration: ANIMATION.duration });
  //       overlayTomorrowOpacity.value = withDelay(ANIMATION.overlayDelay, withTiming(1, { duration: ANIMATION.duration }));
  //     };
  //   }

  //   // if overlay is not visible
  //   if (!overlayVisible) {
  //     originalOpacity.value = withDelay(ANIMATION.overlayDelay, withTiming(baseOpacity, { duration: ANIMATION.duration }));
  //     overlayTodayOpacity.value = withTiming(0, { duration: ANIMATION.duration })
  //     overlayTomorrowOpacity.value = withTiming(0, { duration: ANIMATION.duration })
  //   };

  // }, [overlayVisible]);

  const mainTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        colorProgress.value,
        [0, 1],
        [COLORS.inactivePrayer, COLORS.activePrayer]
      ),
    };
  });

  return (
    <View style={[styles.container, { width: isStandard ? 95 : 85 }]}>
      {/* Main text (non-overlay) */}
      <Animated.Text style={[styles.text, mainTextStyle]}>
        {todayTime}
      </Animated.Text>

      {/* Overlay text - Only shows today's time */}
      <Animated.Text style={[
        styles.text,
        {
          color: interpolateColor(
            overlayTodayColor.value,
            [0, 1],
            ['transparent', COLORS.activePrayer]
          ),
        }
      ]}>
        {todayTime}
      </Animated.Text>

      {/* Tomorrow text - Only shows when passed */}
      <Animated.Text style={[
        styles.text,
        {
          color: interpolateColor(
            overlayTomorrowColor.value,
            [0, 1],
            ['transparent', COLORS.activePrayer]
          ),
        }
      ]}>
        {tomorrowTime}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  text: {
    fontFamily: TEXT.famiy.regular,
    fontSize: TEXT.size,
    textAlign: 'center',
    position: 'absolute',
    width: '100%',
  },
});