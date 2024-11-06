import React, { useEffect } from 'react';
import { StyleSheet, StatusBar, View, Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtom } from 'jotai';
import { useFonts } from 'expo-font';
// @ts-ignore
import { WaveIndicator } from 'react-native-indicators';
import Reanimated, {
  useAnimatedStyle,
  withRepeat,
  withSpring,
  useSharedValue
} from 'react-native-reanimated';

import { COLORS } from '@/constants';
import Main from '@/components/Main';
import Error from '@/components/Error';
import { isLoadingAtom, hasErrorAtom, todaysPrayersAtom, tomorrowsPrayersAtom, overlayVisibleAtom, overlayAnimationAtom, nextPrayerIndexAtom } from '@/store/store';
import { MOCK_DATA_SIMPLE } from '@/mocks/data';
import { usePrayers } from '@/hooks/usePrayers';

export default function Index() {
  const [fontsLoaded] = useFonts({
    'Roboto': require('@/assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('@/assets/fonts/Roboto-Medium.ttf'),
  });

  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [hasError, setHasError] = useAtom(hasErrorAtom);
  const [, setTodaysPrayers] = useAtom(todaysPrayersAtom);
  const [, setTomorrowsPrayers] = useAtom(tomorrowsPrayersAtom);
  const [overlayVisible, setOverlayVisible] = useAtom(overlayVisibleAtom);
  const [overlayAnimation] = useAtom(overlayAnimationAtom);
  const [, setNextPrayerIndex] = useAtom(nextPrayerIndexAtom);

  const removeOverlay = () => {
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.timing(overlayAnimation, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true
    }).start(() => {
      setOverlayVisible(-1);
    });
  };

  const { initialize } = usePrayers();

  const offset = useSharedValue(0);

  useEffect(() => {
    initialize(MOCK_DATA_SIMPLE);
    offset.value = withRepeat(withSpring(100), -1, true);
  }, []);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  if (!fontsLoaded) return <WaveIndicator color="white" />;

  return (
    <>
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayAnimation,
            pointerEvents: overlayVisible !== -1 ? 'auto' : 'none'
          }
        ]}
      >
        <Pressable style={styles.overlayPressable} onPress={removeOverlay} />
      </Animated.View>

      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.gradient}
      />
      <StatusBar barStyle="light-content" />

      {isLoading && <WaveIndicator color="white" />}
      {hasError && !isLoading && <Error />}
      {!hasError && !isLoading && <Main />}

      <Reanimated.View
        style={[{
          width: 50,
          height: 50,
          backgroundColor: 'white',
          borderRadius: 25,
          position: 'absolute',
          bottom: 100,
          left: 20,
          zIndex: 2,
        }, animatedStyles]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 1, // Lower than Timer's z-index
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayPressable: {
    width: '100%',
    height: '100%'
  },
});
