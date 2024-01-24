import React, { useRef, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

interface ISlidingPageProps {
  isVisible: boolean;
  onClose?: () => void;
  pageHeader: string;
  children: JSX.Element;
}

export const SlidingPage = (props: ISlidingPageProps) => {
  const { isVisible, onClose, pageHeader, children } = props;
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;

  useEffect(() => {
    if (isVisible) {
      slideIn();
    } else {
      slideOut();
    }
  }, [isVisible]);

  const slideIn = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const slideOut = () => {
    Animated.timing(slideAnim, {
      toValue: screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose && onClose());
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <AntDesign name='left' size={24} color='black' />
          </TouchableOpacity>
          <Text style={styles.headerLabel}>{pageHeader}</Text>
        </View>
        {children}
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    zIndex: 10,
    bottom: 0,
    left: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  headerLabel: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
});
