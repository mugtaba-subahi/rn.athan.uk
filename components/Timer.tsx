import { StyleSheet, Text, View } from 'react-native';
import { useAtom } from 'jotai';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { COLORS, OVERLAY, TEXT } from '@/constants';
import { nextPrayerIndexAtom, overlayVisibleAtom } from '@/store/store';
import { useTimer } from '@/hooks/useTimer';

interface TimerProps {
  isOverlay?: boolean;
}

export default function Timer({ isOverlay = false }: TimerProps) {
  const { nextPrayer } = useTimer({ isOverlay });
  const [nextPrayerIndex] = useAtom(nextPrayerIndexAtom);
  const [overlayVisible] = useAtom(overlayVisibleAtom);

  const fontFamily = { fontFamily: overlayVisible ? TEXT.famiy.medium : TEXT.famiy.regular };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(overlayVisible ? 1.5 : 1) },
      { translateY: withTiming(overlayVisible ? 5 : 0) }
    ]
  }));

  return (
    <View style={styles.container}>
      {nextPrayerIndex === -1 ? (
        <Text style={styles.text}> {nextPrayer.timerName} </Text>
      ) : (
        <>
          <Text style={styles.text}>{`${nextPrayer.timerName || '...'} in`}</Text>
          <Animated.View style={[styles.timerContainer, animatedStyle]}>
            <Animated.Text style={[styles.timer, fontFamily]}>{nextPrayer.timeDisplay}</Animated.Text>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginBottom: 40,
    justifyContent: 'center',
    zIndex: OVERLAY.zindexes.off.timer,
    pointerEvents: 'none',
  },
  text: {
    fontFamily: TEXT.famiy.regular,
    color: COLORS.textSecondary,
    opacity: TEXT.opacity + 0.15,
    textAlign: 'center',
    fontSize: TEXT.size - 2,
    marginBottom: 3,
  },
  timer: {
    fontFamily: TEXT.famiy.regular,
    color: COLORS.textPrimary,
    fontSize: TEXT.size + 8,
    textAlign: 'center',
  },
  timerContainer: {
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
