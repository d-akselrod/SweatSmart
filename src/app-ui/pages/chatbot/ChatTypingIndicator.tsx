import { useRef, useEffect } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { ChatAuthor } from './types';

interface ITypingIndicatorProps {
  dotColor: string;
}

const TypingIndicator = (props: ITypingIndicatorProps) => {
  const { dotColor } = props;

  const dot1Opacity = useRef(new Animated.Value(0.2)).current;
  const dot2Opacity = useRef(new Animated.Value(0.2)).current;
  const dot3Opacity = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const animate = (dotOpacity: Animated.Value) => {
      Animated.sequence([
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 0.2,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    };

    animate(dot1Opacity);
    setTimeout(() => animate(dot2Opacity), 150);
    setTimeout(() => animate(dot3Opacity), 300);

    const interval = setInterval(() => {
      animate(dot1Opacity);
      setTimeout(() => animate(dot2Opacity), 150);
      setTimeout(() => animate(dot3Opacity), 300);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Animated.View
        style={[
          styles.dot,
          { opacity: dot1Opacity, backgroundColor: dotColor },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          { opacity: dot2Opacity, backgroundColor: dotColor },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          { opacity: dot3Opacity, backgroundColor: dotColor },
        ]}
      />
    </View>
  );
};

interface IChatTypingIndicatorProps {
  role: ChatAuthor;
}

export const ChatTypingIndicator = (props: IChatTypingIndicatorProps) => {
  const { role } = props;

  const containerStyles = StyleSheet.create({
    container: {
      backgroundColor:
        role == ChatAuthor.Assistant
          ? 'rgba(230, 230, 230, 1)'
          : 'rgba(0, 122, 255, 1)',
      padding: 10,
      borderRadius: 10,
      alignSelf: role == ChatAuthor.Assistant ? 'flex-start' : 'flex-end',
      maxWidth: '70%',
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

  const dotColor = role == ChatAuthor.Assistant ? 'black' : 'white';

  return (
    <View style={containerStyles.container}>
      <TypingIndicator dotColor={dotColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
});
