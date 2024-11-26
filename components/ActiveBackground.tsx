import { StyleSheet } from 'react-native';
import { useAtomValue } from 'jotai';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolateColor
} from 'react-native-reanimated';
import { ANIMATION, COLORS, PRAYER } from '@/shared/constants';
import { dateAtom, extraScheduleAtom, standardScheduleAtom } from '@/stores/store';
import { ScheduleType } from '@/shared/types';
import * as timeUtils from '@/shared/time';
import * as prayerUtils from '@/shared/prayer';

const TIMING_CONFIG = {
  duration: ANIMATION.durationSlow,
  easing: Easing.elastic(0.5)
};

const componentSharedValues = (shouldShowBackground: boolean, yPosition: number) => ({
  translateY: useSharedValue(yPosition),
  colorPos: useSharedValue(shouldShowBackground ? 1 : 0)
});

const createAnimatedStyles = (animations: ReturnType<typeof componentSharedValues>) => ({
  background: useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animations.colorPos.value,
      [0, 1],
      ['transparent', COLORS.activeBackground]
    ),
    transform: [{
      translateY: animations.translateY.value
    }]
  }))
});

interface Props { type: ScheduleType };

export default function ActiveBackground({ type }: Props) {
  const isStandard = type === ScheduleType.Standard;

  // State
  const schedule = useAtomValue(isStandard ? standardScheduleAtom : extraScheduleAtom);
  const date = useAtomValue(dateAtom);

  // Derived State
  const todayYYYMMDD = timeUtils.formatDateShort(timeUtils.createLondonDate());
  const isLastPrayerPassed = prayerUtils.isLastPrayerPassed(schedule);
  const shouldShowBackground = !isLastPrayerPassed;
  const yPosition = schedule.nextIndex * PRAYER.height;
  const shouldHide = schedule.nextIndex === 0 && date.current === todayYYYMMDD && isLastPrayerPassed;

  // Animations
  const sharedValues = componentSharedValues(shouldShowBackground, yPosition);
  const animatedStyles = createAnimatedStyles(sharedValues);

  // Animation Updates
  if (shouldHide) {
    sharedValues.colorPos.value = withTiming(0, TIMING_CONFIG, (finished) => {
      if (finished) sharedValues.translateY.value = withTiming(0, TIMING_CONFIG);
    });
  } else {
    sharedValues.translateY.value = withTiming(yPosition, TIMING_CONFIG);
  }

  return <Animated.View style={[styles.background, animatedStyles.background]} />;
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    width: '100%',
    height: PRAYER.height,
    borderRadius: 8,
    shadowOffset: { width: 1, height: 15 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowColor: COLORS.activeBackgroundShadow
  }
});
