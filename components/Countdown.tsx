import { useAtomValue } from 'jotai';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { useSchedule } from '@/hooks/useSchedule';
import { COLORS, STYLES, TEXT } from '@/shared/constants';
import { formatTime } from '@/shared/time';
import { ScheduleType } from '@/shared/types';
import { standardCountdownAtom, extraCountdownAtom, overlayCountdownAtom } from '@/stores/countdown';
import { overlayAtom } from '@/stores/overlay';
// import { midnightRerenderAtom } from '@/stores/schedule';

interface Props {
  type: ScheduleType;
}

export default function Countdown({ type }: Props) {
  const { isStandard, isLastPrayerPassed } = useSchedule(type);

  const overlay = useAtomValue(overlayAtom);
  // useAtomValue(midnightRerenderAtom);

  const countdownAtom = overlay.isOn ? overlayCountdownAtom : isStandard ? standardCountdownAtom : extraCountdownAtom;
  const countdown = useAtomValue(countdownAtom);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(overlay.isOn ? 1.5 : 1) }, { translateY: withTiming(overlay.isOn ? 5 : 0) }],
    fontFamily: overlay.isOn ? TEXT.famiy.medium : TEXT.famiy.regular,
  }));

  if (isLastPrayerPassed) {
    return (
      <View style={[styles.container]}>
        <Text style={[styles.text]}>All prayers finished</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container]}>
      <Text style={[styles.text]}>{countdown.name} in</Text>
      <Animated.Text style={[styles.countdown, animatedStyle]}>{formatTime(countdown.timeLeft)}</Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: STYLES.countdown.height,
    marginBottom: 40,
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  text: {
    textAlign: 'center',
    fontSize: TEXT.sizeSmall,
    marginBottom: 5,
    color: COLORS.textSecondary,
  },
  countdown: {
    color: 'white',
    fontSize: TEXT.size + 8,
    textAlign: 'center',
  },
});
