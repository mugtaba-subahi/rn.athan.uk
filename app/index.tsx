import { useEffect, useState } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { WaveIndicator } from 'react-native-indicators';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAppState } from '@/hooks/useAppState';
import { COLORS, OVERLAY } from '@/shared/constants';
import Navigation from '@/app/Navigation';

export default function Index() {
  const { initialize, isLoading } = useAppState();

  const [fontsLoaded] = useFonts({
    'Roboto': require('@/assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('@/assets/fonts/Roboto-Medium.ttf')
  });

  useEffect(() => {
    const init = async () => {
      await initialize();
    };
    init();
  }, []);

  if (!fontsLoaded || isLoading) return <WaveIndicator color="white" />;

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFillObject}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={[StyleSheet.absoluteFillObject, { zIndex: OVERLAY.zindexes.background }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <StatusBar barStyle="light-content" />
      <Navigation />
    </GestureHandlerRootView>
  );
};