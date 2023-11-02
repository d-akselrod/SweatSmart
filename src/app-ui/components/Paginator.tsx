import { View, StyleSheet, useWindowDimensions, Animated } from 'react-native';

function Paginator({ data, index, scrollX }: any) {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {data.map((_: any, i: number) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [7, 14, 7],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            style={[styles.dot, { opacity: opacity, width: dotWidth }]}
            key={i}
          />
        );
      })}
    </View>
  );
}

export default Paginator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 20,
    height: 64,
  },

  dot: {
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#1a2264',
  },
});
