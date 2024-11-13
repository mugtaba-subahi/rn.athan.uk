import { StyleSheet, View, Pressable } from 'react-native';
import { useAtom } from 'jotai';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { useEffect, useRef } from 'react';

import { todaysPrayersAtom, tomorrowsPrayersAtom, nextPrayerIndexAtom, absoluteNextPrayerMeasurementsAtom, absolutePrayerMeasurementsAtom, selectedPrayerIndexAtom, overlayVisibleAtom } from '@/store/store';
import { COLORS, TEXT, PRAYER, ANIMATION, SCREEN, OVERLAY } from '@/constants';
import Alert from './Alert';
import PrayerTime from './PrayerTime';

interface Props {
  index: number;
  isOverlay?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

export default function Prayer({ index, isOverlay = false }: Props) {
  const [todaysPrayers] = useAtom(todaysPrayersAtom);
  const [tomorrowsPrayers] = useAtom(tomorrowsPrayersAtom);
  const [nextPrayerIndex] = useAtom(nextPrayerIndexAtom);
  const [, setAbsolutePrayerMeasurements] = useAtom(absolutePrayerMeasurementsAtom);
  const [, setNextPrayerMeasurements] = useAtom(absoluteNextPrayerMeasurementsAtom);
  const [selectedPrayerIndex, setSelectedPrayerIndex] = useAtom(selectedPrayerIndexAtom);
  const [overlayVisible, setOverlayVisible] = useAtom(overlayVisibleAtom);
  const viewRef = useRef<View>(null);

  const prayer = todaysPrayers[index];
  const tomorrowPrayer = tomorrowsPrayers[index];
  const isPassed = prayer.passed;
  const isNext = index === nextPrayerIndex;

  const textOpacity = useSharedValue(isPassed || isNext ? 1 : TEXT.opacity);
  const backgroundOpacity = useSharedValue(0);

  useEffect(() => {
    // Fade in text for next prayer in main view
    if (!isOverlay && index === nextPrayerIndex) {
      textOpacity.value = withTiming(1, { duration: ANIMATION.duration });
    }

    // Control background visibility
    if (overlayVisible && isOverlay && selectedPrayerIndex === nextPrayerIndex && index === nextPrayerIndex) {
      backgroundOpacity.value = 1;
    } else {
      backgroundOpacity.value = withTiming(0, { duration: 500 });
    }
  }, [overlayVisible, nextPrayerIndex]);

  const handleLayout = () => {
    if (!viewRef.current || isOverlay) return;

    viewRef.current.measureInWindow((x, y, width, height) => {
      const measurements = { pageX: x, pageY: y, width, height };

      setAbsolutePrayerMeasurements(prev => ({
        ...prev,
        [index]: measurements
      }));

      if (isNext) {
        setNextPrayerMeasurements(measurements);
      }
    });
  };

  const handlePress = () => {
    if (isOverlay) {
      setOverlayVisible(false);
      return;
    }

    setSelectedPrayerIndex(index);
    setOverlayVisible(true);
  };

  const animatedTextStyle = useAnimatedStyle(() => {
    if (isOverlay) return {
      color: 'white',
      opacity: selectedPrayerIndex === index ? 1 : 0,
    };

    if (isPassed || isNext) return {
      color: 'white',
      opacity: textOpacity.value
    };

    return {
      color: COLORS.textTransparent,
      opacity: textOpacity.value,
    };
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  return (
    <Pressable
      ref={viewRef}
      onLayout={handleLayout}
      style={[styles.container, { marginHorizontal: isOverlay ? 0 : SCREEN.paddingHorizontal }]}
      onPress={handlePress}
    >
      <AnimatedView style={[styles.background, animatedBackgroundStyle]} />
      <Animated.Text style={[styles.text, styles.english, animatedTextStyle]}>{prayer.english}</Animated.Text>
      <Animated.Text style={[styles.text, styles.arabic, animatedTextStyle]}>{prayer.arabic}</Animated.Text>
      <PrayerTime index={index} isOverlay={isOverlay} />
      <Alert index={index} isOverlay={isOverlay} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: PRAYER.borderRadius,
  },
  text: {
    fontFamily: TEXT.famiy.regular,
    fontSize: TEXT.size,
  },
  english: {
    flex: 1,
    marginLeft: 20,
  },
  arabic: {
    flex: 0.75,
    textAlign: 'right',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: PRAYER.borderRadius,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primaryShadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  }
});