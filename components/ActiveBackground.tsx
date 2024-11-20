import { StyleSheet, ViewStyle } from 'react-native';
import { useAtomValue } from 'jotai';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { COLORS, PRAYER } from '@/shared/constants';
import { ScheduleType } from '@/shared/types';
import { extraScheduleAtom, standardScheduleAtom } from '@/stores/store';

interface Props {
  type: ScheduleType;
  dimensions: {
    width: number;
    height: number;
  };
}

export default function ActiveBackground({ type, dimensions }: Props) {
  const isStandard = type === ScheduleType.Standard;
  const schedule = useAtomValue(isStandard ? standardScheduleAtom : extraScheduleAtom);

  const totalPrayers = Object.keys(schedule.today).length;
  const prayerHeight = dimensions.height / totalPrayers;

  const computedStyles: ViewStyle = {
    height: dimensions.height / totalPrayers,
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: schedule.nextIndex * prayerHeight }],
  }));

  return <Animated.View style={[styles.background, computedStyles, animatedStyles]} />;
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    width: '100%',
    borderRadius: PRAYER.borderRadius,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primaryShadow
  }
});
