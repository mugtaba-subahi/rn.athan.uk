import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

import { TEXT } from '@/shared/constants';

export default function Mute() {
  const [isMuted, setIsMuted] = useState(false);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsMuted((prev) => !prev);
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Text style={styles.text}>{isMuted ? 'Unmute all' : 'Mute all'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    bottom: 35,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 50,
    alignSelf: 'center',
    backgroundColor: '#6941c649',
    borderColor: '#5b33b875',
    borderWidth: 1,
    shadowOffset: { width: 1, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowColor: '#281160',
  },
  text: {
    color: '#bb9ffdd9',
    fontFamily: TEXT.family.regular,
    fontSize: TEXT.sizeSmaller,
  },
});
