import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, FlatList, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import {getAllExercises, getExercisesByWId } from '../../service/WorkoutAPI';
import { AntDesign, Entypo } from '@expo/vector-icons';
import {IExercise, IWorkoutExercise } from '../../typings/types';
import { AddExercisesPage } from './AddExercisesPage';

interface IExerciseProps {
  exercise: IWorkoutExercise;
  index: number;
}
export function WorkoutExercisesPage(){
  const route = useRoute();
  const navigation = useNavigation();
  const [workoutExercises, setWorkoutExercises] = useState<IWorkoutExercise[]>([])
  const [exercises, setExercises] = useState<IExercise[]>([])
  const [showPage, setShow] = useState<boolean>(false)
  // @ts-ignore
  const workoutName = route.params?.workoutName;
  // @ts-ignore
  const wId = route.params?.id
  const width = Dimensions.get('window').width
  
  useEffect(() => {
    navigation.setOptions({
      title: workoutName,
      headerBackTitle: 'Home'
    });

    const getWorkoutExercises = async () => {
      try{
        const response = await getExercisesByWId(wId)
        if(response.ok){
          const data = await response.json();
          setWorkoutExercises(data.body)
        }
        else{
          console.log("NO RESPONSE")
        }
      }
      catch (error){
        console.error(error)
      }
    }

    getWorkoutExercises();
  }, [showPage]);

  const getExercises = async() => {
    try{
      const response = await getAllExercises();
      if(response.ok){
        const data = await response.json();
        setExercises(data)
      }
      else{
        const data = await response.json();
        console.log("ERROR HAS OCCURED!")
      }
    }
    catch(error){
      console.error(error)
    }
  }
  
  const openModal = () => {
    getExercises();
    setShow(true)
  }

  const ExerciseList = (props : IExerciseProps) => (
    <View>
      <TouchableHighlight style={{borderBottomWidth: 0.4, borderColor: '#c2c2c2'}} activeOpacity={0.8} underlayColor="#efefef" onPress={() => console.log('hi')}>
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
    </View>
  )
  
  const filterExercises = () => {
    const exerciseIds = workoutExercises.map(workoutExercise => workoutExercise.exerciseId)
    const filtered = exercises.filter(exercise => {
      return !exerciseIds.includes(exercise.eId)
    })
    
    return filtered
  }
  
  return(
    <View>
      <ScrollView style = {{marginLeft: 20, height: '100%'}}>
        <Modal animationType = {"slide"} onRequestClose={() => setShow(false)} visible = {showPage}>
          {exercises && <AddExercisesPage exercises={filterExercises()} close={() => setShow(false)} wId = {wId}/>}
        </Modal>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style = {styles.header}>{workoutExercises.length} Exercises</Text>
          <TouchableOpacity onPress = {() => openModal()}>
            <AntDesign name="plus" size={24} color="black" style = {{paddingRight: 20}}/>
          </TouchableOpacity>
        </View>
        {workoutExercises.map((val, index) => <ExerciseList exercise={val} index={index} key = {index}/>)}
      </ScrollView>
      <TouchableOpacity style = {{backgroundColor: '#f14343', borderRadius: 10, position: 'absolute', bottom: '3%', width: '80%', left: '50%', transform: [{translateX: -width/2.5}]}}>
        <Text style = {{color: 'white', padding: 10, fontSize: 18, fontWeight: '700', textAlign: 'center'}}>Start Workout</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  
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
})
