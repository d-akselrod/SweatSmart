import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

const ItemHeight = 50; // Height of each item in the wheel picker

const WheelPicker = (props: { items: number[]; onSelect: Function }) => {
  const { items, onSelect } = props;
  const [scrollY] = useState(new Animated.Value(0));

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
  };

  const handleItemSelected = (index: number) => {
    onSelect(items[index]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        snapToInterval={ItemHeight}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleItemSelected(index)}
          >
            <Text
              style={[
                styles.item,
                {
                  paddingTop: index === 0 ? 10 : 0,
                  paddingBottom: index === items.length - 1 ? 10 : 0,
                },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.maskTop} />
      <View style={styles.maskBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200, // Adjust height as needed
    overflow: 'hidden',
  },
  scrollViewContent: {
    paddingTop: 100,
    paddingBottom: 100,
  },
  item: {
    height: ItemHeight,
    lineHeight: ItemHeight,
    fontSize: 20,
    textAlign: 'center',
  },
  maskTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  maskBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default WheelPicker;
