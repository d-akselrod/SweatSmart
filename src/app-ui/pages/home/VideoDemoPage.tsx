import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { AVPlaybackStatus, Video } from 'expo-av';
import { View, StyleSheet, Text } from 'react-native';

export const VideoDemoPage = () => {
  const navigation = useNavigation();

  const handleVideoEnd = () => {
    navigation.goBack();
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if ('isLoaded' in status && status.isLoaded) {
      if (status.didJustFinish) {
        handleVideoEnd();
      }
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('../../assets/videos/bench-press_demo.mp4')}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        shouldPlay={true}
        isLooping={false}
        style={styles.video}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%', // Adjust the height accordingly
    backgroundColor: 'white',
  },
});
