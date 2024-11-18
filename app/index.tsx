import { useEffect, useState } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { WaveIndicator } from 'react-native-indicators';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import useStore from '@/hooks/useStore';
import { useAppState } from '@/hooks/useApp';
import { COLORS, OVERLAY } from '@/shared/constants';
import Navigation from '@/app/Navigation';
import RadialGlow from '@/components/RadialGlow';

export default function Index() {
  const { app } = useStore('standard');
  const { initialize } = useAppState();

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

  if (!fontsLoaded || app.isLoading) return <WaveIndicator color="white" />;

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFillObject}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={[StyleSheet.absoluteFillObject, { zIndex: OVERLAY.zindexes.background }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <StatusBar barStyle="light-content" />
      <RadialGlow />
      <Navigation />
    </GestureHandlerRootView>
  );
};