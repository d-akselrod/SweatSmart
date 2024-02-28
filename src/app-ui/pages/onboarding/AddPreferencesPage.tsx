import React, { useState, useEffect } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
  Button,
  KeyboardAvoidingView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../App';
import { setActiveUser } from '../../redux/slices/userSlice';
import { setPreferences } from '../../service/ProfileAPI';
import { IUser } from '../../typings/types';
import { FieldCard } from '../settings/cards/FieldCard';
import { PickerCard } from '../settings/cards/PickerCard'; // Ensure this import path is correct

export const AddPreferencesPage = () => {
  const route = useRoute();
  // @ts-ignore
  const activeUser = route.params.activeUser;
  const dispatch = useDispatch();

  interface IPreferenceItem {
    label: string;
    value: string; // Ensure this matches the expected type for your picker items
  }
  console.log(activeUser);

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
    console.log(activeUser.username, requestBody);
    try {
      const response = await setPreferences(activeUser.username, requestBody);
      console.log(response.ok);
      if (response.ok) {
        dispatch(setActiveUser(activeUser));
      } else {
        console.log('Error saving preferences');
      }
    } catch (error) {
      console.log('Error saving preferences');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 100 }}>
        <Text style={styles.groupHeader}>Please fill out form below!</Text>
        <PickerCard
          label='Fitness Experience'
          description='Your Experience'
          items={fitnessExperienceItems}
          onValueChange={(itemValue: any) => setFitnessExperience(itemValue)}
          selectedValue={fitnessExperience}
        />
        <PickerCard
          label='Fitness Goals'
          description='Your Goals'
          items={fitnessGoalItems}
          onValueChange={(itemValue: any) => setFitnessGoals(itemValue)}
          selectedValue={fitnessGoals}
        />
        <PickerCard
          label='Workout Frequency'
          description='Workouts per Week?'
          items={workoutFrequencyItems}
          onValueChange={(itemValue: any) => setWorkoutFrequency(itemValue)}
          selectedValue={workoutFrequency}
        />
        <PickerCard
          label='Equipment Available'
          description='What do you have?'
          items={equipmentAvailableItems}
          onValueChange={(itemValue: any) => setEquipmentAvailable(itemValue)}
          selectedValue={equipmentAvailable}
        />
        <KeyboardAvoidingView behavior='padding'>
          <FieldCard
            label={'Workout Duration'}
            description={'Duration in min'}
            keyboardType={'numeric'}
            value={duration}
            onChangeText={(text: string) => setDuration(text)}
          />
        </KeyboardAvoidingView>
        <Button title='Finish' onPress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 5,
    alignContent: 'center',
    marginLeft: 20,
  },
  groupHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    width: '100%',
    marginTop: 15,
  },
  gap: {
    height: 130,
  },
});
