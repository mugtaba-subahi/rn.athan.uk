import React, { useCallback } from 'react';
import { StyleSheet, Pressable, Text, View, Animated } from 'react-native';
import { useAtom } from 'jotai';
// import * as Haptics from 'expo-haptics';

import { todaysPrayersAtom, nextPrayerIndexAtom, overlayVisibleAtom, overlayAnimationAtom, tomorrowsPrayersAtom, selectedPrayerDateAtom } from '@/store/store';
import { COLORS, TEXT, SCREEN } from '@/constants';
import Alert from './Alert';

interface Props {
  index: number;
}

export default function Prayer({ index }: Props) {
  const [overlayVisible, setOverlayVisible] = useAtom(overlayVisibleAtom);
  const [overlayAnimation] = useAtom(overlayAnimationAtom);
  const [todaysPrayers] = useAtom(todaysPrayersAtom);
  const [nextPrayerIndex] = useAtom(nextPrayerIndexAtom);
  const [tomorrowsPrayers] = useAtom(tomorrowsPrayersAtom);
  const [selectedDate, setSelectedDate] = useAtom(selectedPrayerDateAtom);

  const toggleOverlay = useCallback(() => {
    const prayer = todaysPrayers[index];
    const isVisible = overlayVisible === index;
    const shouldShowTomorrow = prayer.passed;

    if (!isVisible) {
      setSelectedDate(shouldShowTomorrow ? 'tomorrow' : 'today');
    }

    Animated.timing(overlayAnimation, {
      toValue: isVisible ? 0 : 1,
      duration: 100,
      useNativeDriver: true
    }).start(() => {
      if (isVisible) {
        setOverlayVisible(-1);
        setSelectedDate('today');
      }
    });

    if (!isVisible) setOverlayVisible(index);
  }, [overlayVisible, index, todaysPrayers]);

  const prayer = selectedDate === 'tomorrow' && overlayVisible === index
    ? tomorrowsPrayers[index]
    : todaysPrayers[index];

  const isActive = overlayVisible > -1 && overlayVisible === index;
  const isPassed = prayer.passed;
  const isNext = index === nextPrayerIndex;
  
  // Updated shouldDim logic to only show full opacity for selected prayer when showing tomorrow
  const shouldDim = !isPassed && !isNext && 
    !(selectedDate === 'tomorrow' && overlayVisible === index) && 
    styles.dim;

  return (
    <Pressable
      style={[
        styles.container,
        isActive && styles.active,
        isPassed && styles.passed,
        isNext && styles.next
      ]}
      onPress={toggleOverlay}
    >
      <Text style={[styles.text, styles.english, shouldDim]}> {prayer.english} </Text>
      <Text style={[styles.text, styles.arabic, shouldDim]}> {prayer.arabic} </Text>
      <Text style={[styles.text, styles.time, shouldDim]}> {prayer.time} </Text>
      <Alert index={index} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SCREEN.paddingHorizontal
  },
  dim: {
    opacity: 0.5
  },
  passed: {
    opacity: 1,
  },
  next: {
    opacity: 1,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primaryShadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    borderRadius: 5,
  },
  text: {
    fontFamily: TEXT.famiy.regular,
    fontSize: TEXT.size,
    color: COLORS.textPrimary,
  },
  english: {
    flex: 1,
    marginLeft: 20,
    marginRight: 15,
  },
  arabic: {
    flex: 1,
    textAlign: 'right',
    marginRight: 34,
  },
  time: {
    flex: 1,
    textAlign: 'center',
    marginRight: 10,
  },
  active: {
    zIndex: 1
  }
});
