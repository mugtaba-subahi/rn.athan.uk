import { useFonts } from 'expo-font';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { WaveIndicator } from 'react-native-indicators';

import Navigation from '@/app/Navigation';
import FontRobotoMedium from '@/assets/fonts/Roboto-Medium.ttf';
import FontRoboto from '@/assets/fonts/Roboto-Regular.ttf';
import Error from '@/components/Error';
import Overlay from '@/components/Overlay';
import { initializeListeners } from '@/device/listeners';
import { checkForUpdates } from '@/device/updates';
import { useNotification } from '@/hooks/useNotification';
import { initializeNotifications } from '@/shared/notifications';
import { syncLoadable } from '@/stores/sync';

export default function Index() {
  useFonts({ Roboto: FontRoboto, 'Roboto-Medium': FontRobotoMedium });

  const { state } = useAtomValue(syncLoadable);
  const { checkInitialPermissions } = useNotification();

  useEffect(() => {
    // Initialize notifications on first load
    initializeNotifications(checkInitialPermissions);
    // Initialize background/foreground state listeners
    initializeListeners(checkInitialPermissions);

    checkForUpdates();
  }, []);

  if (state === 'loading') return <WaveIndicator color="white" />;
  if (state === 'hasError') return <Error />;

  return (
    <>
      <Overlay />
      <Navigation />
    </>
  );
}
