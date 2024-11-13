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
    if (!isOverlay && index === nextPrayerIndex) {
      textOpacity.value = withTiming(1, { duration: ANIMATION.durationSlow });
    };
  }, [nextPrayerIndex]);

  useEffect(() => {
    if (isOverlay && selectedPrayerIndex === nextPrayerIndex) {
      backgroundOpacity.value = 1;
    } else {
      backgroundOpacity.value = 0;
    }
  }, [overlayVisible]);

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
      setSelectedPrayerIndex(-1);
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
      color: 'white',
      opacity: 1
    };

    return {
      color: COLORS.textTransparent,
      opacity: textOpacity.value,
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    // non-overlay styles
    const baseStyles = {
      borderRadius: PRAYER.borderRadius,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginHorizontal: !isOverlay ? SCREEN.paddingHorizontal : 0,
      opacity: 1,
    };

    if (overlayVisible) {

      if (isOverlay) {
        baseStyles.opacity = 0

        if (index === selectedPrayerIndex) {
          baseStyles.opacity = 1;

          if (index === nextPrayerIndex) {
            return {
              ...baseStyles,
              backgroundColor: 'green',
              shadowColor: COLORS.primaryShadow,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.5,
              shadowRadius: 5,
              opacity: backgroundOpacity.value,
            };
          }
        }
      }
    }

    // if (overlayVisible && isOverlay && selectedPrayerIndex === nextPrayerIndex && index === nextPrayerIndex) {
    //   return {
    //     ...baseStyles,
    //     backgroundColor: COLORS.primary,
    //     shadowColor: COLORS.primaryShadow,
    //     shadowOffset: { width: 0, height: 10 },
    //     shadowOpacity: 0.5,
    //     shadowRadius: 5,
    //     opacity: backgroundOpacity.value,
    //   };
    // }

    return baseStyles;
  });

  return (
    <AnimatedPressable
      ref={viewRef}
      onLayout={handleLayout}
      style={containerStyle}
      onPress={handlePress}
    >
      <Animated.Text style={[styles.text, styles.english, animatedTextStyle]}> {prayer.english} </Animated.Text>
      <Animated.Text style={[styles.text, styles.arabic, animatedTextStyle]}> {prayer.arabic} </Animated.Text>
      <PrayerTime index={index} isOverlay={isOverlay} />
      <Alert index={index} isOverlay={isOverlay} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
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
});