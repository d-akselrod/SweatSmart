import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { SettingsCard } from './SettingsCard';

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
        <SettingsCard
          label='Pause All'
          description='Temporarily pause all notifications'
          type={'switch'}
        />
        <Text style={styles.groupHeader}>{'Customize Alerts'}</Text>
        <SettingsCard
          label='Workout Reminders'
          description='Reminders before a workout'
          type={'switch'}
        />
        <SettingsCard
          label='Friend Activity'
          description='Keeping up with your fitness pals'
          type={'switch'}
        />
        <SettingsCard
          label='Motivation'
          description='Some daily encouragment'
          type={'switch'}
        />
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
