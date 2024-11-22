import { useState, useCallback, useRef, useEffect, forwardRef } from 'react';
import { StyleSheet, Pressable, Text, View, GestureResponderEvent } from 'react-native';
import { PiVibrate, PiBellSimpleSlash, PiBellSimpleRinging, PiSpeakerSimpleHigh } from "rn-icons/pi";
import { useAtom } from 'jotai';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withSpring,
  interpolate,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS, TEXT, ANIMATION, PRAYER, PRAYER_INDEX_LAST_THIRD } from '@/shared/constants';
import { AlertType } from '@/shared/types';
import { useAtomValue } from 'jotai';
import { scheduleAtom, alertPreferencesAtom } from '@/stores/store';
import { setAlertPreference } from '@/stores/actions';
import React = require('react');

const SPRING_CONFIG = { damping: 12, stiffness: 500, mass: 0.5 };
const TIMING_CONFIG = { duration: 5 };


const ALERT_CONFIGS = [
  {
    icon: PiBellSimpleSlash,
    label: "Off",
    type: AlertType.Off
  },
  {
    icon: PiBellSimpleRinging,
    label: "Notification",
    type: AlertType.Notification
  },
  {
    icon: PiVibrate,
    label: "Vibrate",
  },
  {
    icon: PiSpeakerSimpleHigh,
    label: "Sound",
    type: AlertType.Sound
  }
] as const;

interface Props { index: number; }

export default function Alert({ index }: Props) {
  const { nextIndex } = useAtomValue(scheduleAtom);

  const [iconIndex, setIconIndex] = useState(0);
  const [isPopupActive, setIsPopupActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const isPassed = index < nextIndex;
  const isNext = index === nextIndex;

  const defaultColorProgress = isPopupActive || isPassed || isNext ? 1 : 0;
  const colorProgress = useSharedValue(defaultColorProgress);

  useEffect(() => {
    if (isPopupActive === true) {
      colorProgress.value = withTiming(1, { duration: ANIMATION.duration });
      return;
    };

    if (isPopupActive === false) {
      colorProgress.value = withTiming(0, { duration: ANIMATION.duration });
    }
  }, [isPopupActive]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const nextIndex = (iconIndex + 1) % ALERT_CONFIGS.length;
    setIconIndex(nextIndex);

    timeoutRef.current && clearTimeout(timeoutRef.current);
    setIsPopupActive(true);

    timeoutRef.current = setTimeout(() => {
      setIsPopupActive(false);
    }, 1500);
  };

  const econ = forwardRef(ALERT_CONFIGS[iconIndex].icon);
  const AnimatedIcon = Animated.createAnimatedComponent(econ);

  const iconAnimatedProps = useAnimatedProps(() => ({
    color: interpolateColor(
      colorProgress.value,
      [0, 1],
      [COLORS.inactivePrayer, COLORS.activePrayer]
    )
  }));

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress} style={styles.iconContainer}>
        <AnimatedIcon animatedProps={iconAnimatedProps} size={20} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '100%',
  },
  iconContainer: {
    paddingRight: PRAYER.padding.right,
    paddingLeft: 13,
    justifyContent: 'center',
  }
});
