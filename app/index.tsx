import { useFonts } from 'expo-font';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WaveIndicator } from 'react-native-indicators';

import * as Api from '@/api/client';
import Navigation from '@/app/Navigation';
import FontRobotoMedium from '@/assets/fonts/Roboto-Medium.ttf';
import FontRoboto from '@/assets/fonts/Roboto-Regular.ttf';
import GradientBackground from '@/components/GradientBackground';
import Overlay from '@/components/Overlay';
import logger from '@/shared/logger';
import { ScheduleType } from '@/shared/types';
import { setSchedule, setDate } from '@/stores/actions';
import * as Database from '@/stores/database';
import { measurementsAtom } from '@/stores/store';

export default function Index() {
  const [fontsLoaded] = useFonts({
    Roboto: FontRoboto,
    'Roboto-Medium': FontRobotoMedium,
  });

  const measurements = useAtomValue(measurementsAtom);
  const measurementsSet = measurements.date && measurements.list;

  useEffect(() => {
    const init = async () => {
      try {
        const data = await Api.handle();
        Database.saveAll(data);

        setSchedule(ScheduleType.Standard);
        setSchedule(ScheduleType.Extra);
        setDate();
      } catch (error) {
        logger.error('Init failed:', error);
      }
    };
    init();
  }, []);

  if (!fontsLoaded) return <WaveIndicator color="white" />;

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFillObject}>
      <GradientBackground />
      <StatusBar barStyle="light-content" />
      {measurementsSet && <Overlay />}
      <Navigation />
    </GestureHandlerRootView>
  );
}
