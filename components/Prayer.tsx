import * as Haptics from 'expo-haptics';
import { useAtomValue } from 'jotai';
import { useRef, useEffect } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';

import Alert from '@/components/Alert';
import PrayerTime from '@/components/PrayerTime';
import { useAnimationColor } from '@/hooks/useAnimation';
import { usePrayer } from '@/hooks/usePrayer';
import { useSchedule } from '@/hooks/useSchedule';
import { TEXT, COLORS, STYLES, ISTIJABA_INDEX } from '@/shared/constants';
import { getCascadeDelay } from '@/shared/prayer';
import { ScheduleType } from '@/shared/types';
import { setSelectedPrayerIndex, toggleOverlay } from '@/stores/overlay';
import { refreshUIAtom } from '@/stores/ui';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  type: ScheduleType;
  index: number;
  isOverlay?: boolean;
}

export default function Prayer({ type, index, isOverlay = false }: Props) {
  const refreshUI = useAtomValue(refreshUIAtom);

  const Schedule = useSchedule(type);
  const Prayer = usePrayer(type, index);
  const AnimColor = useAnimationColor(Prayer.ui.initialColorPos, {
    fromColor: COLORS.inactivePrayer,
    toColor: COLORS.activePrayer,
  });

  // Force animation to respect new state immediately when refreshing
  useEffect(() => {
    AnimColor.animate(Prayer.ui.initialColorPos);
  }, [refreshUI]);

  const viewRef = useRef<View>(null);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!Schedule.isStandard && index === ISTIJABA_INDEX) return;

    setSelectedPrayerIndex(type, index);
    toggleOverlay();
  };

  if (Prayer.isNext) AnimColor.animate(1);

  if (!Schedule.isLastPrayerPassed && Schedule.schedule.nextIndex === 0 && index !== 0) {
    const delay = getCascadeDelay(index, type);
    AnimColor.animate(0, { delay });
  }

  const computedStyleArabic = {
    paddingRight: Prayer.isStandard ? 20 : 15,
  };

  return (
    <AnimatedPressable ref={viewRef} style={styles.container} onPress={handlePress}>
      <Animated.Text style={[styles.text, styles.english, AnimColor.style]}>{Prayer.english}</Animated.Text>
      <Animated.Text style={[styles.text, styles.arabic, computedStyleArabic, AnimColor.style]}>
        {Prayer.arabic}
      </Animated.Text>
      <PrayerTime index={index} type={type} isOverlay={isOverlay} />
      <Alert index={index} type={type} isOverlay={isOverlay} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: STYLES.prayer.height,
  },
  text: {
    fontFamily: TEXT.family.regular,
    fontSize: TEXT.size,
  },
  english: {
    paddingLeft: STYLES.prayer.padding.left,
    width: 130,
  },
  arabic: {
    flex: 1,
    textAlign: 'right',
  },
});
