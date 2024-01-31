import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, Text } from 'react-native';

export const EditProfilePage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackTitle: 'Settings',
      title: 'Edit Profile',
    });
  });

  return <SafeAreaView />;
};
