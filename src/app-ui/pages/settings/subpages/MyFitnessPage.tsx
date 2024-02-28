import React, { useState, useEffect } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
  Button,
  KeyboardAvoidingView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { getPreferences, setPreferences } from '../../../service/ProfileAPI';
import { IUser } from '../../../typings/types';
import { FieldCard } from '../cards/FieldCard';
import { PickerCard } from '../cards/PickerCard'; // Ensure this import path is correct

export const MyFitnessPage = () => {
  const navigation = useNavigation();
  const activeUser: IUser = useSelector((state: any) => state.user);

  // useEffect(() => {
  //   const loadPreferences = async() => {
  //     try{
  //       const response = await getPreferences(activeUser.username)
  //       console.log(response.status)
  //       if(response.ok){
  //         const data = await response.json();
  //       }
  //       else{
  //         console.log("error occured")
  //       }
  //     }
  //     catch(error){
  //       console.log(error)
  //     }
  //   }
  //
  //   loadPreferences()
  // }, [isFocus]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackTitle: 'Settings',
      title: 'My Fitness',
    });
  }, [navigation]);

  interface IPreferenceItem {
    label: string;
    value: string; // Ensure this matches the expected type for your picker items
  }

  const fitnessExperienceItems: IPreferenceItem[] = [
    { label: 'Beginner', value: '0' },
    { label: 'Intermediate', value: '1' },
    { label: 'Advanced', value: '2' },
  ];

  const fitnessGoalItems: IPreferenceItem[] = [
    { label: 'Strength', value: '0' },
    { label: 'Endurance', value: '1' },
    { label: 'General Health', value: '2' },
  ];

  const workoutFrequencyItems: IPreferenceItem[] = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
  ];

  const equipmentAvailableItems: IPreferenceItem[] = [
    { label: 'None', value: '0' },
    { label: 'Dumbells', value: '1' },
    { label: 'Full', value: '2' },
  ];

  const [fitnessExperience, setFitnessExperience] = useState(
    fitnessExperienceItems[0].value,
  );
  const [fitnessGoals, setFitnessGoals] = useState(fitnessGoalItems[0].value);

  const [workoutFrequency, setWorkoutFrequency] = useState(
    workoutFrequencyItems[2].value,
  );
  const [equipmentAvailable, setEquipmentAvailable] = useState(
    equipmentAvailableItems[0].value,
  );
  const [duration, setDuration] = useState('');

  const handleSave = async () => {
    const requestBody = {
      goal: +fitnessGoals,
      experienceLevel: +fitnessExperience,
      frequency: +workoutFrequency,
      equipment: +equipmentAvailable,
      timeAvailable: +duration,
    };

    try {
      const response = await setPreferences(activeUser.username, requestBody);
      if (response.ok) {
        // @ts-ignore
        navigation.goBack();
      } else {
        console.log('Error saving preferences');
      }
    } catch (error) {
      console.log('Error saving preferences');
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <Text style={styles.groupHeader}>Personal Fitness Portfolio</Text>
        <PickerCard
          label='Fitness Experience'
          description='Your Experience'
          items={fitnessExperienceItems}
          onValueChange={(itemValue: any) => setFitnessExperience(itemValue)}
          selectedValue={fitnessExperience}
        />
        <View style={styles.gap} />
        <PickerCard
          label='Fitness Goals'
          description='Your Goals'
          items={fitnessGoalItems}
          onValueChange={(itemValue: any) => setFitnessGoals(itemValue)}
          selectedValue={fitnessGoals}
        />
        <View style={styles.gap} />
        <PickerCard
          label='Workout Frequency'
          description='Workouts per Week?'
          items={workoutFrequencyItems}
          onValueChange={(itemValue: any) => setWorkoutFrequency(itemValue)}
          selectedValue={workoutFrequency}
        />
        <View style={styles.gap} />
        <PickerCard
          label='Equipment Available'
          description='What do you have?'
          items={equipmentAvailableItems}
          onValueChange={(itemValue: any) => setEquipmentAvailable(itemValue)}
          selectedValue={equipmentAvailable}
        />
        <KeyboardAvoidingView behavior='padding'>
          <View style={styles.gap} />
          <FieldCard
            label={'Workout Duration'}
            description={'Duration in min'}
            keyboardType={'numeric'}
            value={duration}
            onChangeText={(text: string) => setDuration(text)}
          />
        </KeyboardAvoidingView>
        <Button title='Save' onPress={handleSave} />
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
  gap: {
    height: 130,
  },
});
