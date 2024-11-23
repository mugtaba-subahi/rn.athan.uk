import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSetAtom } from 'jotai';

import { ANIMATION } from '@/shared/constants';
import Standard from '@/screens/Standard';
import Extra from '@/screens/Extra';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { pagePositionAtom } from '@/stores/store';

export default function Navigation() {
  const { bottom } = useSafeAreaInsets();

  const position = useSharedValue(0);
  const setPagePosition = useSetAtom(pagePositionAtom);

  const handlePageScroll = (e: any) => {
    const { position: pos, offset } = e.nativeEvent;
    const currentPosition = pos + offset;
    position.value = currentPosition;
    setPagePosition(currentPosition);
  };

  const dotStyle = (index: number) => useAnimatedStyle(() => {
    return {
      opacity: withTiming(
        Math.abs(position.value - index) < 0.5 ? 1 : 0.25,
        { duration: ANIMATION.duration }
      )
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        overdrag={true}
        overScrollMode="never"
        onPageScroll={handlePageScroll}
      >
        <Standard />
        <Extra />
      </PagerView>

      <View style={[styles.dotsContainer, { bottom: bottom + 5 }]}>
        {[0, 1].map((index) => (
          <Animated.View key={index} style={[styles.dot, dotStyle(index)]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
});