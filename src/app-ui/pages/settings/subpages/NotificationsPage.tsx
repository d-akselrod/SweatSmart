import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { SwitchCard } from '../cards/SwitchCard';

export const NotificationsPage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackTitle: 'Settings',
      title: 'Notifications',
    });
  });

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <Text style={styles.groupHeader}>{'Push Notifications'}</Text>
        <SwitchCard
          label='Pause All'
          description='Temporarily pause all notifications'
        />
        <Text style={styles.groupHeader}>{'Customize Alerts'}</Text>
        <SwitchCard
          label='Workout Reminders'
          description='Reminders before a workout'
        />
        <SwitchCard
          label='Friend Activity'
          description='Keeping up with your fitness pals'
        />
        <SwitchCard label='Motivation' description='Some daily encouragment' />
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  groupHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    width: '100%',
    marginLeft: 20,
    marginTop: 15,
  },
});
