import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import { PiVibrate, PiBellSimpleSlash, PiBellSimpleRinging, PiSpeakerSimpleHigh } from "rn-icons/pi";
import { useAtom } from 'jotai';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  cancelAnimation,
  runOnJS
} from 'react-native-reanimated';

import { COLORS, TEXT } from '@/constants';
import { todaysPrayersAtom, nextPrayerIndexAtom, overlayAtom, selectedPrayerIndexAtom, selectedPrayerDateAtom } from '@/store/store';

interface Props {
  index: number;
}

export default function Alert({ index }: Props) {
  const [todaysPrayers] = useAtom(todaysPrayersAtom);
  const [nextPrayerIndex] = useAtom(nextPrayerIndexAtom);
  const [selectedPrayerIndex] = useAtom(selectedPrayerIndexAtom);
  const [isOverlay] = useAtom(overlayAtom);
  const [iconIndex, setIconIndex] = useState(0);
  const [, setIsOverlay] = useAtom(overlayAtom);
  const [, setSelectedPrayerIndex] = useAtom(selectedPrayerIndexAtom);
  const [, setSelectedDate] = useAtom(selectedPrayerDateAtom);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const translateX = useSharedValue(-20);
  const timeoutId = useSharedValue<NodeJS.Timeout | null>(null);

  const prayer = todaysPrayers[index];
  const isPassed = prayer.passed;
  const isNext = index === nextPrayerIndex;

  const alertConfigs = useMemo(() => [
    { icon: PiBellSimpleSlash, label: "Off" },
    { icon: PiBellSimpleRinging, label: "Notification" },
    { icon: PiVibrate, label: "Vibrate" },
    { icon: PiSpeakerSimpleHigh, label: "Sound" }
  ], []);

  const handlePress = useCallback((e) => {
    e?.stopPropagation();

    // Always reset overlay state first
    setIsOverlay(false);
    setSelectedPrayerIndex(null);
    setSelectedDate('today');

    // Continue with existing alert logic
    setIconIndex(prev => (prev + 1) % alertConfigs.length);

    if (timeoutId.value) {
      clearTimeout(timeoutId.value);
    }

    opacity.value = withTiming(1, { duration: 150 });
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 150,
      mass: 0.5
    });
    translateX.value = withSpring(0, {
      damping: 12,
      stiffness: 150,
      mass: 0.5
    });

    timeoutId.value = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.95);
      translateX.value = withTiming(-20);
    }, 2000);
  }, [alertConfigs.length]);

  const animatedStyle = useAnimatedStyle(() => {
    const baseOpacity = isPassed || isNext ? 1 : 0.5;
    return {
      opacity: withTiming(
        isOverlay && selectedPrayerIndex !== index ? 0 : baseOpacity,
        { duration: 300 }
      ),
    };
  });

  const popupAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateX: translateX.value }
    ]
  }));

  const currentConfig = alertConfigs[iconIndex];
  const IconComponent = currentConfig.icon;

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress} style={styles.iconContainer}>
        <Animated.View style={animatedStyle}>
          <IconComponent color="white" size={20} />
        </Animated.View>
      </Pressable>

      <Animated.View style={[styles.popup, popupAnimatedStyle]}>
        <IconComponent color="white" size={20} style={styles.popupIcon} />
        <Text style={styles.label}>{currentConfig.label}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    paddingHorizontal: 23,
    paddingVertical: 20,
  },
  popup: {
    position: 'absolute',
    right: '100%',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  popupIcon: {
    marginRight: 15
  },
  label: {
    fontSize: TEXT.size,
    color: COLORS.textPrimary,
  }
});
