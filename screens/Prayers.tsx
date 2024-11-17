import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Countdown from '@/components/Countdown';
import DateDisplay from '@/components/DateDisplay';
import Prayer from '@/components/Prayer';
import Footer from '@/components/Footer';
import ActiveBackground from '@/components/ActiveBackground';
import Overlay from '@/components/Overlay';
import { SCREEN, PRAYERS_ENGLISH } from '@/shared/constants';
import RadialGlow from '@/components/RadialGlow';

export default function Prayers({ list }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + SCREEN.paddingHorizontal, paddingBottom: insets.bottom }]}>
      {/* <RadialGlow /> */}
      {/* <ActiveBackground /> */}

      {/* <Countdown /> */}
      {/* <DateDisplay /> */}

      {list.map((_, index) => (
        <Prayer key={index} index={index} />
      ))}

      {/* <Overlay /> */}
      {/* <Footer /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});