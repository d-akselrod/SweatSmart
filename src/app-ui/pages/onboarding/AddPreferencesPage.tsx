import React, { useState, useEffect, useRef } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Pressable,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveUser } from '../../redux/slices/userSlice';
import { setPreferences } from '../../service/ProfileAPI';
import { AntDesign } from '@expo/vector-icons';
import {ProgressBar} from '../home/ProgressBar'


export const AddPreferencesPage = () => {
  const route = useRoute();
  // @ts-ignore
  const activeUser = route.params.activeUser;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const width = Dimensions.get('window').width;
  const slideRef = useRef<ScrollView | null>(null);
  const currentX = useRef(0)
  const [currentIdx, setCurrentIdx] = useState(1)

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

  const handleSlide = () => {
    if(currentX.current === width*4) return
    currentX.current+=width;
    slideRef.current?.scrollTo({x: currentX.current, animated: false});
    setCurrentIdx(prev => prev + 1)
  };
  
  const goBack = () => {
    if(currentX.current === 0) return
    currentX.current-=width;
    slideRef.current?.scrollTo({x: currentX.current, animated: false});
    setCurrentIdx(prev => prev - 1)
  }
  
  const Option = (props: {title: string, index: number}) => (
    <Pressable style = {[styles.option, {backgroundColor: props.index === +fitnessExperience ? '#4f538c' : 'white'}]} onPress = {() => setFitnessExperience(fitnessExperienceItems[props.index].value)}>
      <Text style = {[styles.optionText,{color: props.index === +fitnessExperience ? 'white' : '#6c6c6c'}]}>{props.title}</Text>
    </Pressable>
  )
  console.log(fitnessGoals)
  const renderFitnessLevelOptions = () => {
    return ["Beginner", "Intermediate", "Advanced"].map((val, index) => {
      return <Option title={val} key = {index} index = {index}/>
    })
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style = {{marginHorizontal: 20, gap: 10}}>
        <Pressable onPress = {goBack}>        
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
        <Text style = {{fontWeight: '500', color: '#808080'}}>Question {currentIdx} of 5</Text>
        <ProgressBar percent = {(currentIdx/5)*100} color = {'#2c41af'}/>
      </View>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator = {false} ref = {slideRef}>
        <View style = {[styles.pageContainer, {width}]}>
          <Text style = {styles.question}>What is your Fitness Level?</Text>
          <View style = {styles.optionContainer}>
            {renderFitnessLevelOptions()}
          </View>
        </View>
        <View style = {[styles.pageContainer, {width}]}>
          <Text style = {styles.question}>What is your goal?</Text>
        </View>
        <View style = {[styles.pageContainer, {width}]}>
          <Text style = {styles.question}>How often can you workout?</Text>
        </View>
        <View style = {[styles.pageContainer, {width}]}>
          <Text style = {styles.question}>What equipment do you have?</Text>
        </View>
        <View style = {[styles.pageContainer, {width}]}>
          <Text style = {styles.question}>How long can you workout?</Text>
        </View>
      </ScrollView>
      <TouchableOpacity style = {styles.button} onPress = {handleSlide}>
        <Text style = {{padding: 10, color: 'white', fontWeight: '600', fontSize: 16, textAlign: 'center'}}>{currentIdx < 5 ? "Next" : "Finish"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  button: {
    backgroundColor: '#1a2264',
    borderRadius: 20,
    marginHorizontal: 20
  },
  
  question: {
    fontSize: 18,
    fontWeight: '500'
  },
  
  pageContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  
  option: {
    width: '100%',
    borderColor: '#808080',
    justifyContent: 'center',
    borderRadius: 10,
    height: '15%'
  },
  
  optionContainer: {
    justifyContent: 'center',
    gap: 10,
    height: '100%',
  },
  
  optionText:{
    paddingLeft: 20, 
    fontWeight: '500', 
    fontSize: 17,
  }
});
