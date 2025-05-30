import { View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Day from '@/components/Day';
import List from '@/components/List';
import Mute from '@/components/Mute';
import Timer from '@/components/Timer';
import { SCREEN } from '@/shared/constants';
import { ScheduleType } from '@/shared/types';

interface Props {
  type: ScheduleType;
}

export default function Screen({ type }: Props) {
  const insets = useSafeAreaInsets();

  const computedStyles: ViewStyle = {
    paddingTop: insets.top + SCREEN.paddingHorizontal,
    paddingBottom: insets.bottom,
    maxWidth: 700,
    width: '100%',
    alignSelf: 'center',
  };

  return (
    <View style={[{ flex: 1 }, computedStyles]}>
      <Timer type={type} />
      <Day type={type} />
      <List type={type} />

      {/* Spacing */}
      <View style={{ flex: 1 }} />

      <Mute type={type} />
    </View>
  );
}
