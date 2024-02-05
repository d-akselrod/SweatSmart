import { AntDesign, Entypo, Feather, Fontisto } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native';
import {View, Text, SafeAreaView, StyleSheet, Pressable, TextInput, ScrollView, TouchableOpacity, TouchableHighlight} from 'react-native';
import Timer from '../../components/Timer';
import {useEffect, useRef, useState } from 'react';
import { IWorkoutExercise } from '../../typings/types';

interface IExerciseProps {
  exercise: IWorkoutExercise;
  index: number;
}
export function StartWorkoutPage(){
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  let interval = useRef(0);
  const navigation = useNavigation();
  const route = useRoute()
  // @ts-ignore
  const exercises = route.params?.exercises

  useEffect(() => {

    if (isRunning) {
      interval.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(interval.current);
    }

  }, [isRunning]);
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return formattedTime;
  };

  const handleNavigation = (exercise: IWorkoutExercise) => {
    // @ts-ignore
    navigation.navigate("ExerciseDetails", {exerciseData: exercise})
  }

  const ExerciseList = (props : IExerciseProps) => (
      <TouchableHighlight style={{borderBottomWidth: 0.4, borderColor: '#c2c2c2'}} activeOpacity={0.5} underlayColor="#efefef" onPress={() => handleNavigation(props.exercise)}>
        <View style={[styles.exerciseContainer]}>
          <View style={{gap: 5}}>
            <Text style={styles.exerciseName}>{props.exercise.exerciseName}</Text>
            <Text style={{fontSize: 13}}>{props.exercise.muscleGroup}</Text>
            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 13}}>{props.exercise.sets} sets</Text>
              <Entypo name="dot-single" size={15} color="black" />
              <Text style={{fontSize: 13}}>{props.exercise.reps} reps</Text>
            </View>
          </View>
          <AntDesign name="ellipsis1" size={20} color="black"/>
        </View>
      </TouchableHighlight>
  )
  
  return(
    <SafeAreaView style = {{flex: 1}}>
      <ScrollView style = {{marginHorizontal: 20}}>
        <View style = {{flexDirection: 'row', gap: 5, alignItems: 'center', width: '100%', justifyContent: 'center', height: '30%'}}>
          <Fontisto name="stopwatch" size={20} color="black" />
          <Text style={styles.timerText}>{formatTime(seconds)}</Text>
        </View>
        <Text style = {styles.header}>{exercises.length} Exercises</Text>
        {exercises.map((val: IWorkoutExercise, index: number) => <ExerciseList exercise={val} index={index} key = {index}/>)}
      </ScrollView>
      <TouchableOpacity style = {styles.stopButton} onPress = {() => navigation.goBack()}>
        <Entypo name="controller-stop" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  timerText: {
    fontSize: 30,
    fontWeight: "600",
    fontStyle: 'italic'
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    fontStyle: 'italic',
    marginVertical: 20
  },

  exerciseContainer: {
    width: '100%',
    height: 75,
    paddingVertical: 20,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: "#efefef",
  },
  exerciseName: {
    fontWeight: '700',
    fontSize: 15,
    color: '#4d4d4d'
  },
  
  stopButton: {
    backgroundColor: '#be4949', 
    height: 70, 
    width: 70, 
    borderRadius: 35, 
    justifyContent: 'center',
    alignItems: 'center', 
    position: 'absolute',
    bottom: '10%',
    alignSelf: 'center'
  }
})
