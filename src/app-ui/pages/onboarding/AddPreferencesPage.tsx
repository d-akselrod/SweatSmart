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
  Image
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveUser } from '../../redux/slices/userSlice';
import { setPreferences } from '../../service/ProfileAPI';
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import {ProgressBar} from '../home/ProgressBar'
import Slider from '@react-native-community/slider';
import WheelPicker from '../../components/WheelPicker'


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
    workoutFrequencyItems[3].value,
  );
  const [equipmentAvailable, setEquipmentAvailable] = useState(
    equipmentAvailableItems[0].value,
  );
  const [duration, setDuration] = useState(60);

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
    if(currentX.current === width*4){
      handleSave()
      return
    }
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
  
  const FitnessLevelOption = (props: {title: string, index: number}) => (
    <Pressable style = {[styles.option, {borderColor: props.index === +fitnessExperience ? '#376cf8' : 'white', backgroundColor: props.index === +fitnessExperience ? '#bfdeff40' : 'white'}]} onPress = {() => setFitnessExperience(fitnessExperienceItems[props.index].value)}>
      <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20}}>
        <Text style = {[styles.optionText,{color: props.index === +fitnessExperience ? '#376cf8' : 'black'}]}>{props.title}</Text>
        <MaterialCommunityIcons name={props.title === 'Beginner' ? "walk" : props.title === 'Intermediate' ? "run" : "run-fast"} size={40} color={props.index === +fitnessExperience ? '#376cf8' : "black"} />
      </View>
    </Pressable>
  )

  const GoalOption = (props: {title: string, index: number}) => (
    <Pressable style = {[styles.option, {borderColor: props.index === +fitnessGoals ? '#376cf8' : 'white', backgroundColor: props.index === +fitnessGoals ? '#bfdeff40' : 'white'}]} onPress = {() => setFitnessGoals(fitnessGoalItems[props.index].value)}>
      <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20}}>
        <Text style = {[styles.optionText,{color: props.index === +fitnessGoals ? '#376cf8' : 'black'}]}>{props.title}</Text>
        {
          props.title === 'Strength' ? <MaterialIcons name="fitness-center" size={40} color={props.index === +fitnessGoals ? '#376cf8' : "black"} /> 
          : props.title === 'Endurance' ? <Ionicons name="fitness" size={40} color={props.index === +fitnessGoals ? '#376cf8' : "black"} />
          : <MaterialCommunityIcons name="google-fit" size={40} color={props.index === +fitnessGoals ? '#376cf8' : "black"} />
        }
      </View>
    </Pressable>
  )

  const EquipmentOption = (props: {title: string, index: number}) => {
    return (
      <Pressable style = {[styles.option, {borderColor: props.index === +equipmentAvailable ? '#376cf8' : 'white', backgroundColor: props.index === +equipmentAvailable ? '#bfdeff40' : 'white'}]} onPress = {() => setEquipmentAvailable(equipmentAvailableItems[props.index].value)}>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20}}>
          <Text style = {[styles.optionText,{color: props.index === +equipmentAvailable ? '#376cf8' : 'black'}]}>{props.title}</Text>
          {
            props.index === 0 ? <Image source = {require(`../../assets/images/bodyweight.png`)} style = {{width: 50, height: 50}}/> :
              props.index === 1 ? <Image source = {require(`../../assets/images/dumbells.png`)} style = {{width: 50, height: 50}}/> :
                <Image source = {require(`../../assets/images/fullgym.png`)} style = {{width: 50, height: 50}}/>
          }
        </View>
      </Pressable>
    )
  }
  
  console.log(equipmentAvailable)
  const renderFitnessLevelOptions = () => {
    return ["Beginner", "Intermediate", "Advanced"].map((val, index) => {
      return <FitnessLevelOption title={val} key = {index} index = {index}/>
    })
  }

  const renderEquipmentOptions = () => {
    return ["None, Bodyweight Only", "Dumbbells Only", "Full Equipment"].map((val, index) => {
      return <EquipmentOption title={val} key = {index} index = {index}/>
    })
  }
  const renderGoalOptions = () => {
    return ["Strength", "Endurance", "General Health"].map((val, index) => {
      return <GoalOption title={val} key = {index} index = {index}/>
    })
  }

  const renderCalendarImage = () => {
    const imagePaths: any = {
      1: require('../../assets/calendarImages/onetime.png'),
      2: require('../../assets/calendarImages/twotimes.png'),
      3: require('../../assets/calendarImages/threetimes.png'),
      4: require('../../assets/calendarImages/fourtimes.png'),
      5: require('../../assets/calendarImages/fivetimes.png'),
      6: require('../../assets/calendarImages/sixtimes.png'),
      7: require('../../assets/calendarImages/seventimes.png'),
    };
    const image = imagePaths[+workoutFrequency] || null;
    return (
      <View style = {{width: '100%', height: '40%', gap: 40}}>
        <Image source={image} style={{ width: '50%', height: '70%', alignSelf: 'center' }} />
        <Text style = {{fontSize: 25, fontWeight: 'bold', fontFamily: 'Apple SD Gothic Neo', textAlign: 'center'}}>{workoutFrequency} {+workoutFrequency == 1 ? "time" : "times"} / week</Text>
        <Slider step = {1} lowerLimit = {0} maximumValue ={6} value = {4} onValueChange = {(val) => setWorkoutFrequency(workoutFrequencyItems[val].value)}></Slider>
      </View>
    ) 
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
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator = {false} ref = {slideRef} scrollEnabled = {false}>
        <View style = {[styles.pageContainer, {width}]}>
          <Text style = {styles.question}>What's your fitness level?</Text>
          <View style = {{backgroundColor: '#bfdeff40', borderRadius: 20}}>
            <Text style = {{fontSize: 15, color: '#444444', padding: 20, fontWeight: '400', lineHeight: 20, fontFamily: 'Apple SD Gothic Neo'}}>We're eager to calibrate your workouts precisely to your abilities to ensure that each session is challenging yet achievable.</Text>
          </View>
          {renderFitnessLevelOptions()}
        </View>
        <View style = {[styles.pageContainer, {width}]}>
          <Text style = {styles.question}>What's your goal?</Text>
          <View style = {{backgroundColor: '#bfdeff40', borderRadius: 20}}>
            <Text style = {{fontSize: 15, color: '#444444', padding: 20, fontWeight: '400', lineHeight: 20, fontFamily: 'Apple SD Gothic Neo'}}>We're here to customize and curate a program perfectly tailored to your aspirations and fitness objectives.</Text>
          </View>
          {renderGoalOptions()}
        </View>
        <View style = {[styles.pageContainer, {width}]}>
          <Text style = {styles.question}>How much equipment?</Text>
          <View style = {{backgroundColor: '#bfdeff40', borderRadius: 20}}>
            <Text style = {{fontSize: 15, color: '#444444', padding: 20, fontWeight: '400', lineHeight: 20, fontFamily: 'Apple SD Gothic Neo'}}>Gear up for success! Share the extent of your gym equipment collection, so we'll be aware of what you can use in your workout programs.</Text>
          </View>
          {renderEquipmentOptions()}
        </View>
        <View style = {[styles.pageContainer, {width}]}>
          <Text style = {styles.question}>How often would you workout?</Text>
          {renderCalendarImage()}
          <View/>
        </View>
        <View style = {[styles.pageContainer, {width}]}>
          <Text style = {styles.question}>How long can you workout?</Text>
          <View style = {{gap: 20}}>
            <Text style = {{fontSize: 50, fontWeight: 'bold', fontFamily: 'Apple SD Gothic Neo', textAlign: 'center'}}>{duration} min</Text>
            <Slider step = {1} lowerLimit = {20} maximumValue ={180} value = {60} onValueChange = {(val) => setDuration(val)}></Slider>
          </View>
          <View/>
        </View>
      </ScrollView>
      <TouchableOpacity style = {styles.button} onPress = {handleSlide}>
        <Text style = {{padding: 15, color: 'white', fontWeight: '600', fontSize: 20, textAlign: 'center'}}>{currentIdx < 5 ? "Next" : "Finish"}</Text>
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
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Apple SD Gothic Neo'
  },
  
  pageContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  
  option: {
    width: '100%',
    justifyContent: 'center',
    borderRadius: 20,
    height: '20%',
    borderWidth: 2,
  },
  
  optionText:{
    fontWeight: 'bold', 
    fontSize: 20,
    fontFamily: 'Apple SD Gothic Neo'
  }
});
