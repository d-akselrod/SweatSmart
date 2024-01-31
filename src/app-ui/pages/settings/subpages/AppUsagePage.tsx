import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { DisplayCard } from '../cards/DisplayCard';

export const AppUsagePage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackTitle: 'Settings',
      title: 'App Usage',
    });
  });

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <Text style={styles.groupHeader}>{'App Usage'}</Text>
        <DisplayCard
          label={'Total App Usage'}
          displayMessage={'10 Hours'}
          description={'Total time spent on the app'}
        />
        <DisplayCard
          label={'Total Workout Duration'}
          displayMessage={'8 Hours'}
          description={'Total time spent working out'}
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
