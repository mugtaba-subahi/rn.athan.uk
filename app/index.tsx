import { useEffect } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { WaveIndicator } from 'react-native-indicators';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, interpolateColor } from 'react-native-reanimated';
import { useAtomValue } from 'jotai';
import { pagePositionAtom } from '@/stores/store';

// Wrap LinearGradient with Animated
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

import { setSchedule, setDate } from '@/stores/actions';
import { COLORS, OVERLAY } from '@/shared/constants';
import Navigation from '@/app/Navigation';
import RadialGlow from '@/components/RadialGlow';
import * as Database from '@/stores/database';
import * as Api from '@/api/client';
import { ScheduleType } from '@/shared/types';

export default function Index() {
  const [fontsLoaded] = useFonts({
    'Roboto': require('@/assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('@/assets/fonts/Roboto-Medium.ttf')
  });

  const position = useAtomValue(pagePositionAtom);

  const gradientStyle = useAnimatedStyle(() => {
    const startColor = interpolateColor(
      position,
      [0, 1],
      [COLORS.gradientScreen1Start, COLORS.gradientScreen2Start]
    );
    const endColor = interpolateColor(
      position,
      [0, 1],
      [COLORS.gradientScreen1End, COLORS.gradientScreen2End]
    );

    return {
      colors: [startColor, endColor]
    };
  });

  useEffect(() => {
    const init = async () => {
      try {
        const data = await Api.handle();
        Database.saveAll(data);

        setSchedule(ScheduleType.Standard);
        setSchedule(ScheduleType.Extra);
        setDate();
      } catch (error) {
        console.error('Init failed:', error);
      }
    };
    init();
  }, []);

  if (!fontsLoaded) return <WaveIndicator color="white" />;

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFillObject}>
      <AnimatedLinearGradient
        animatedProps={gradientStyle}
        style={[StyleSheet.absoluteFillObject, { zIndex: OVERLAY.zindexes.background }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <StatusBar barStyle="light-content" />
      <RadialGlow />
      <Navigation />
    </GestureHandlerRootView>
  );
}