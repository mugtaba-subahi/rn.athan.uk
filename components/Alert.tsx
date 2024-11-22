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
  interpolateColor
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS, TEXT, ANIMATION, PRAYER, PRAYER_INDEX_LAST_THIRD } from '@/shared/constants';
import { AlertType } from '@/shared/types';
import { useAtomValue } from 'jotai';
import { scheduleAtom, alertPreferencesAtom } from '@/stores/store';
import { setAlertPreference } from '@/stores/actions';

const SPRING_CONFIG = { damping: 12, stiffness: 500, mass: 0.5 };
const TIMING_CONFIG = { duration: 5 };

const WrappedBellSlash = forwardRef((props, ref) => <PiBellSimpleSlash {...props} ref={ref} />);
const WrappedBellRinging = forwardRef((props, ref) => <PiBellSimpleRinging {...props} ref={ref} />);
const WrappedVibrate = forwardRef((props, ref) => <PiVibrate {...props} ref={ref} />);
const WrappedSpeaker = forwardRef((props, ref) => <PiSpeakerSimpleHigh {...props} ref={ref} />);

const AnimatedBellSlash = Animated.createAnimatedComponent(WrappedBellSlash);
const AnimatedBellRinging = Animated.createAnimatedComponent(WrappedBellRinging);
const AnimatedVibrate = Animated.createAnimatedComponent(WrappedVibrate);
const AnimatedSpeaker = Animated.createAnimatedComponent(WrappedSpeaker);

const ALERT_CONFIGS = [
  {
    icon: PiBellSimpleSlash,
    animatedIcon: AnimatedBellSlash,
    label: "Off",
    type: AlertType.Off
  },
  {
    icon: PiBellSimpleRinging,
    animatedIcon: AnimatedBellRinging,
    label: "Notification",
    type: AlertType.Notification
  },
  {
    icon: PiVibrate,
    animatedIcon: AnimatedVibrate,
    label: "Vibrate",
    type: AlertType.Vibrate
  },
  {
    icon: PiSpeakerSimpleHigh,
    animatedIcon: AnimatedSpeaker,
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

  console.log('click: ', defaultColorProgress);

  useEffect(() => {
    console.log('isPopupActive triggered');
    if (isPopupActive === true) {
      console.log('ON');
      colorProgress.value = 1;
      return;
    };

    if (isPopupActive === false) {
      console.log('OFF');
      colorProgress.value = defaultColorProgress;
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

  const alertAnimatedStyle = useAnimatedStyle(() => ({
  }));

  const iconAnimatedProps = useAnimatedProps(() => ({
    color: interpolateColor(
      colorProgress.value,
      [0, 1],
      [COLORS.inactivePrayer, COLORS.activePrayer]
    )
  }));

  const AnimatedIcon = ALERT_CONFIGS[iconIndex].animatedIcon;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePress}
        style={styles.iconContainer}
      >
        <Animated.View style={alertAnimatedStyle}>
          <AnimatedIcon animatedProps={iconAnimatedProps} size={20} />
        </Animated.View>
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
  },
  popup: {
    position: 'absolute',
    alignSelf: 'center',
    right: '100%',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: 'black',
    ...PRAYER.shadow,
  },
  popupIcon: {
    marginRight: 15
  },
  label: {
    fontSize: TEXT.size,
    color: COLORS.activePrayer,
  },
});
