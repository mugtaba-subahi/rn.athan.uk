import { BottomSheetModal, BottomSheetFlatList, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Canvas, LinearGradient, RoundedRect, vec } from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';
import { useMemo, useCallback, useState } from 'react';
import { StyleSheet, Text, Dimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ALL_AUDIOS } from '@/assets/audio';
import BottomSheetSoundItem from '@/components/BottomSheetSoundItem';
import Glow from '@/components/Glow';
import { COLORS, TEXT } from '@/shared/constants';
import { ScheduleType } from '@/shared/types';
import {
  cancelAllScheduleNotificationsForSchedule,
  addAllScheduleNotificationsForSchedule,
  setSoundPreference,
} from '@/stores/notifications';
import { setBottomSheetModal, setPlayingSoundIndex } from '@/stores/ui';

export default function BottomSheetSound() {
  const { bottom } = useSafeAreaInsets();

  // Temporary state to track selection before committing
  // This allows us to preview the selection without triggering notification updates
  const [tempSoundSelection, setTempSoundSelection] = useState<number | null>(null);

  const data = useMemo(() => ALL_AUDIOS.map((audio, index) => ({ id: index.toString(), audio })), []);

  const renderSheetBackground = useCallback(() => {
    const { width, height } = Dimensions.get('window');
    return (
      <Canvas style={StyleSheet.absoluteFill}>
        <RoundedRect x={0} y={0} width={width} height={height} r={24}>
          <LinearGradient start={vec(0, 0)} end={vec(width, height)} colors={['#0e0b32', '#090428']} />
        </RoundedRect>
      </Canvas>
    );
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <BottomSheetSoundItem
        index={parseInt(item.id)}
        audio={item.audio}
        // onSelect updates the temporary selection when user taps an item
        // This doesn't trigger any notification updates yet
        onSelect={setTempSoundSelection}
        // tempSelection is used for UI feedback while the sheet is open
        // Falls back to the actual stored preference if no temporary selection
        tempSelection={tempSoundSelection}
      />
    ),
    [tempSoundSelection]
  );

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.9}
        style={[styles.backdrop, props.style]}
      />
    ),
    []
  );

  const clearAudio = useCallback(() => setPlayingSoundIndex(null), []);

  const handleDismiss = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    clearAudio();

    // Only update preferences and notifications when sheet closes
    // and user has made a selection
    if (tempSoundSelection === null) return;

    // Update the persisted sound preference with user's selection
    setSoundPreference(tempSoundSelection);
    // Clear temporary selection state since changes are now persisted
    setTempSoundSelection(null);

    await Promise.all([
      cancelAllScheduleNotificationsForSchedule(ScheduleType.Standard),
      cancelAllScheduleNotificationsForSchedule(ScheduleType.Extra),
    ]);

    await Promise.all([
      addAllScheduleNotificationsForSchedule(ScheduleType.Standard),
      addAllScheduleNotificationsForSchedule(ScheduleType.Extra),
    ]);
  }, [tempSoundSelection]);

  return (
    <BottomSheetModal
      ref={(ref) => setBottomSheetModal(ref)}
      snapPoints={['80%']}
      enableDynamicSizing={false}
      onDismiss={handleDismiss}
      onAnimate={clearAudio}
      style={styles.modal}
      backgroundComponent={renderSheetBackground}
      handleIndicatorStyle={styles.indicator}
      backdropComponent={renderBackdrop}>
      <View style={styles.container}>
        <Glow
          color={'#28045b'}
          baseOpacity={1}
          size={Dimensions.get('window').width * 3}
          style={{
            bottom: -Dimensions.get('window').width * 1.5,
            left: -Dimensions.get('window').width * 1.25,
          }}
        />
        <Text style={[styles.text, styles.title]}>Select Athan</Text>

        <BottomSheetFlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: bottom + 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  modal: {
    paddingTop: 15,
  },
  container: {
    flex: 1,
  },
  indicator: {
    backgroundColor: COLORS.textSecondary,
  },
  title: {
    color: 'white',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: TEXT.size,
    fontFamily: TEXT.family.regular,
  },
  backdrop: {
    backgroundColor: '#000116',
  },
});
