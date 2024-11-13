import { StyleSheet, View, Pressable } from 'react-native';
import { useAtom } from 'jotai';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { useEffect, useRef } from 'react';

import { todaysPrayersAtom, tomorrowsPrayersAtom, nextPrayerIndexAtom, absoluteNextPrayerMeasurementsAtom, absolutePrayerMeasurementsAtom, selectedPrayerIndexAtom, overlayVisibleAtom, lastSelectedPrayerIndexAtom } from '@/store/store';
import { COLORS, TEXT, PRAYER, ANIMATION, SCREEN, OVERLAY } from '@/constants';
import Alert from './Alert';
import PrayerTime from './PrayerTime';

interface Props {
  index: number;
  isOverlay?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Prayer({ index, isOverlay = false }: Props) {
  const [todaysPrayers] = useAtom(todaysPrayersAtom);
  const [tomorrowsPrayers] = useAtom(tomorrowsPrayersAtom);
  const [nextPrayerIndex] = useAtom(nextPrayerIndexAtom);
  const [, setAbsolutePrayerMeasurements] = useAtom(absolutePrayerMeasurementsAtom);
  const [, setNextPrayerMeasurements] = useAtom(absoluteNextPrayerMeasurementsAtom);
  const [selectedPrayerIndex, setSelectedPrayerIndex] = useAtom(selectedPrayerIndexAtom);
  const [overlayVisible, setOverlayVisible] = useAtom(overlayVisibleAtom);
  const [lastSelectedPrayerIndex, setLastSelectedPrayerIndex] = useAtom(lastSelectedPrayerIndexAtom);
  const viewRef = useRef<View>(null);

  const prayer = todaysPrayers[index];
  const tomorrowPrayer = tomorrowsPrayers[index];
  const isPassed = prayer.passed;
  const isNext = index === nextPrayerIndex;
  const textOpacity = useSharedValue(isPassed || isNext ? 1 : TEXT.opacity);
  const backgroundOpacity = useSharedValue(0);

  useEffect(() => {
    if (index === nextPrayerIndex) {
      textOpacity.value = withTiming(1, { duration: ANIMATION.duration });
    } else if (!isPassed) {
      textOpacity.value = TEXT.opacity;
    }
  }, [nextPrayerIndex]);

  useEffect(() => {
    // When overlay opens, store the last selected index
    if (overlayVisible && selectedPrayerIndex === index) {
      setLastSelectedPrayerIndex(index);
    }

    // Only show background when it's the next prayer
    if (overlayVisible && isOverlay && selectedPrayerIndex === nextPrayerIndex) {
      backgroundOpacity.value = withTiming(1, { duration: ANIMATION.duration });
    } else {
      // Always reset background opacity in all other cases
      backgroundOpacity.value = withTiming(0, { duration: ANIMATION.duration });
    }
  }, [overlayVisible, selectedPrayerIndex]); // Added selectedPrayerIndex as dependency

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
      opacity: 1,
    };

    if (isPassed || isNext) return {
      color: COLORS.textPrimary,
      opacity: textOpacity.value,
    };

    return {
      color: COLORS.textTransparent,
      opacity: textOpacity.value,
    };
  });

  const backgroundStyle = useAnimatedStyle(() => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primary,
    borderRadius: PRAYER.borderRadius,
    shadowColor: COLORS.primaryShadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    opacity: backgroundOpacity.value,
  }));

  const containerStyle = [
    styles.container,
    isOverlay && selectedPrayerIndex !== index && styles.overlayHidden,
    !isOverlay && styles.spacing,
  ];

  return (
    <AnimatedPressable
      ref={viewRef}
      onLayout={handleLayout}
      style={containerStyle}
      onPress={handlePress}
    >
      <Animated.View style={backgroundStyle} />
      <Animated.Text style={[styles.text, styles.english, animatedTextStyle]}> {prayer.english} </Animated.Text>
      <Animated.Text style={[styles.text, styles.arabic, animatedTextStyle]}> {prayer.arabic} </Animated.Text>
      <PrayerTime index={index} isOverlay={isOverlay} />
      <Alert index={index} isOverlay={isOverlay} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: PRAYER.borderRadius,
    flexDirection: 'row',
    alignItems: 'center'
  },
  spacing: {
    marginHorizontal: SCREEN.paddingHorizontal,
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
    flex: 1,
    textAlign: 'right',
  },
  overlayHidden: {
    opacity: 0,
  },
});