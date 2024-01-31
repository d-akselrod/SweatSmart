import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, Text } from 'react-native';

export const TimeSpentPage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackTitle: 'Settings',
      title: 'Time Spent',
    });
  });

  return <SafeAreaView />;
};
