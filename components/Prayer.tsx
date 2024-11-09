import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { useAtom } from 'jotai';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { useEffect, useRef } from 'react';

import { todaysPrayersAtom, tomorrowsPrayersAtom, nextPrayerIndexAtom, absoluteActivePrayerMeasurementsAtom, absolutePrayerMeasurementsAtom, overlayVisibleAtom, selectedPrayerIndexAtom, relativePrayerMeasurementsAtom, overlayContentAtom, overlayClosingAtom } from '@/store/store';
import { COLORS, TEXT, SCREEN, PRAYER, ANIMATION } from '@/constants';
import Alert from './Alert';

interface Props {
  index: number;
  isOverlay?: boolean;  // Add this prop
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Prayer({ index, isOverlay = false }: Props) {
  const [todaysPrayers] = useAtom(todaysPrayersAtom);
  const [tomorrowsPrayers] = useAtom(tomorrowsPrayersAtom);
  const [nextPrayerIndex] = useAtom(nextPrayerIndexAtom);
  const [, setActiveMeasurements] = useAtom(absoluteActivePrayerMeasurementsAtom);
  const [absolutePrayerMeasurements, setAbsolutePrayerMeasurements] = useAtom(absolutePrayerMeasurementsAtom);
  const [, setRelativePrayerMeasurements] = useAtom(relativePrayerMeasurementsAtom);
  const [, setOverlayVisible] = useAtom(overlayVisibleAtom);
  const [, setSelectedPrayerIndex] = useAtom(selectedPrayerIndexAtom);
  const [, setOverlayContent] = useAtom(overlayContentAtom);
  const [overlayClosing] = useAtom(overlayClosingAtom);
  const viewRef = useRef<View>(null);
  const [selectedPrayerIndex] = useAtom(selectedPrayerIndexAtom); // Add this line

  const prayer = todaysPrayers[index];
  const tomorrowPrayer = tomorrowsPrayers[index];
  const isPassed = prayer.passed;
  const isNext = index === nextPrayerIndex;

  // Show tomorrow's time only when the prayer is in overlay and has passed
  const displayTime = isOverlay && isPassed ? tomorrowPrayer?.time : prayer.time;

  const backgroundOpacity = useSharedValue(0);

  useEffect(() => {
    if (isOverlay && overlayClosing) {
      backgroundOpacity.value = withTiming(0, { duration: 300 });
    } else if (isOverlay) {
      backgroundOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isOverlay, overlayClosing]);

  const isSelected = isOverlay && index === selectedPrayerIndex;

  const containerStyle = useAnimatedStyle(() => ({
    borderRadius: PRAYER.borderRadius,
    flexDirection: 'row',
    alignItems: 'center',
    ...(isSelected && isNext && {
      backgroundColor: COLORS.primary,
      shadowColor: COLORS.primaryShadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
    })
  }));

  const handleLayout = () => {
    if (!viewRef.current || isOverlay) return;  // Add isOverlay check here

    // Measure absolute window coordinates to display text in overlay
    viewRef.current.measureInWindow((x, y, width, height) => {
      const windowMeasurements = {
        pageX: x,
        pageY: y,
        width,
        height
      };

      setAbsolutePrayerMeasurements(prev => {
        const measurements = [...prev];
        measurements[index] = windowMeasurements;
        return measurements;
      });

      if (isNext) {
        setActiveMeasurements(windowMeasurements);
      }
    });

    // Measure relative coordinates for active background
    viewRef.current.measure((x, y, width, height) => {
      setRelativePrayerMeasurements(prev => {
        const relativeMeasurements = [...prev];
        relativeMeasurements[index] = {
          x,
          y,
          width,
          height,
          name: prayer.english
        };
        return relativeMeasurements;
      });
    });
  };

  const handlePress = () => {
    setSelectedPrayerIndex(index);
    setOverlayContent(prev => {
      const exists = prev.some(item => item.name === `prayer-${index}`);
      if (exists) return prev;

      return [...prev, {
        name: `prayer-${index}`,
        component: <Prayer index={index} isOverlay={true} />, // Pass isOverlay prop here
        measurements: absolutePrayerMeasurements[index]
      }];
    });
    setOverlayVisible(true);
  };

  // Update the textColor logic
  const textColor = isSelected 
    ? 'white'
    : isPassed || isNext ? COLORS.textPrimary : COLORS.textTransparent;

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(
      isSelected || isPassed || isNext ? 1 : TEXT.transparent,
      { duration: ANIMATION.duration }
    )
  }));

  return (
    <AnimatedPressable
      ref={viewRef}
      onLayout={handleLayout}
      style={containerStyle}
      onPress={handlePress}
    >
      <Animated.Text style={[styles.text, styles.english, { color: textColor }, animatedStyle]}>
        {prayer.english}
      </Animated.Text>
      <Animated.Text style={[styles.text, styles.arabic, { color: textColor }, animatedStyle]}>
        {prayer.arabic}
      </Animated.Text>
      <Animated.Text style={[styles.text, styles.time, { color: textColor }, animatedStyle]}>
        {displayTime}
      </Animated.Text>
      <Alert index={index} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  // Remove container and overlayContainer styles as they're now handled by containerStyle
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: TEXT.famiy.regular,
    fontSize: TEXT.size,
    color: COLORS.textPrimary,
  },
  english: {
    flex: 1,
    marginLeft: 20,
  },
  arabic: {
    flex: 1,
    textAlign: 'right',
  },
  time: {
    flex: 1,
    textAlign: 'center',
    marginLeft: 25,
    marginRight: 10,
  }
});
