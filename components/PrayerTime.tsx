import { StyleSheet, View } from 'react-native';
import { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { useAtom } from 'jotai';
import { TEXT, ANIMATION, COLORS } from '@/constants';
import { todaysPrayersAtom, tomorrowsPrayersAtom, overlayClosingAtom, nextPrayerIndexAtom, selectedPrayerIndexAtom } from '@/store/store';
import { useEffect } from 'react';

interface Props {
  index: number;
  isOverlay: boolean;
  isSelected: boolean;
}

export default function PrayerTime({ index, isOverlay, isSelected }: Props) {
  const [todaysPrayers] = useAtom(todaysPrayersAtom);
  const [tomorrowsPrayers] = useAtom(tomorrowsPrayersAtom);
  const [nextPrayerIndex] = useAtom(nextPrayerIndexAtom);
  const [overlayClosing] = useAtom(overlayClosingAtom);

  const prayer = todaysPrayers[index];
  const isPassed = prayer.passed;
  const isNext = index === nextPrayerIndex;
  const todayTime = todaysPrayers[index].time;
  const tomorrowTime = tomorrowsPrayers[index]?.time;

  const opacity = useSharedValue(TEXT.transparent);
  const textColor = useSharedValue(COLORS.textTransparent);

  useEffect(() => {
    // Non-selected state
    if (!isSelected && !isOverlay) {
      if (isPassed && !isNext) {
        opacity.value = 1;
        textColor.value = 'white';
      } else if (!isPassed && isNext) {
        opacity.value = 1;
        textColor.value = 'white';
      } else if (!isPassed && !isNext) {
        opacity.value = TEXT.transparent;
        textColor.value = COLORS.textTransparent;
      }
    }
  }, [isSelected, isOverlay, isPassed, isNext]);

  useEffect(() => {
    // Selected state
    if (isSelected) {
      textColor.value = 'white';
      opacity.value = isOverlay ? 1 : 0;
    }
  }, [isSelected, isOverlay]);

  useEffect(() => {
    // Overlay closing state
    if (overlayClosing) {
      if (isOverlay) {
        opacity.value = 0;
      } else {
        opacity.value = isPassed || isNext ? 1 : TEXT.transparent;
      }
    }
  }, [overlayClosing, isOverlay, isPassed, isNext]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value, { duration: ANIMATION.duration }),
    color: withTiming(textColor.value, { duration: ANIMATION.duration }),
  }));

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, animatedStyle]}>
        {isOverlay && isPassed ? tomorrowTime : todayTime}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontFamily: TEXT.famiy.regular,
    fontSize: TEXT.size,
    textAlign: 'center',
  },
});