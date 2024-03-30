import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface IProgressBarProps {
  percent: number;
  color: string;
}
export const ProgressBar = (props: IProgressBarProps) => {
  const { percent, color } = props;
  const animate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animate, {
      toValue: percent,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [animate, percent]);

  const progress = animate.interpolate({
    inputRange: [0, percent + 0.0001],
    outputRange: ['0%', percent + 0.0001 + '%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.bar}>
      <Animated.View
        style={[styles.progress, { width: progress, backgroundColor: color }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#dedede',
    borderRadius: 5,
    height: 8,
  },

  progress: {
    borderRadius: 5,
    height: '100%',
  },
});
