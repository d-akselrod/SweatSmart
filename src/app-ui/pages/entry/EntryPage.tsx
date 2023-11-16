import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { View, Animated, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { setActiveUser } from '../../redux/slices/userSlice';
import { IUser } from '../../typings/types';

export const EntryPage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [logoScale] = useState(new Animated.Value(2));
  const [logoRotation] = useState(new Animated.Value(0));

  const fetchUserData = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');

      return userJson ? (JSON.parse(userJson) as IUser) : null;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleAnimationCompletion = async () => {
    const activeUser = await fetchUserData();

    if (activeUser) {
      dispatch(setActiveUser(activeUser));
    } else {
      // @ts-ignore
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(logoRotation, {
          toValue: 1.5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(logoScale, {
        toValue: 2.8,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 3,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 2.8,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 3,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(handleAnimationCompletion);
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/images/Logo.png')}
        style={[
          styles.logo,
          {
            transform: [
              { scale: logoScale },
              {
                rotate: logoRotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 100,
    height: 100,
  },
});
