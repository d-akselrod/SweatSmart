import { useEffect, useRef, useState } from 'react';
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
  PanResponder,
  Alert,
  TextInput,
  Button,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AddExercisesPage } from './AddExercisesPage';
import { StartWorkoutPage } from './StartWorkoutPage';
import { start } from '../../redux/slices/workoutSlice';
import { deleteExerciseFromWorkout } from '../../service/ExerciseAPI';
import { deleteWorkoutByWid } from '../../service/UserWorkoutAPI';
import {
  IExercise,
  IFeaturedExercises,
  IUser,
  IWorkout,
  IWorkoutExercise,
} from '../../typings/types';

interface IExerciseProps {
  exercise: IFeaturedExercises;
  index: number;
}
export function FeaturedExercisesPage() {
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const width = Dimensions.get('window').width;
  // @ts-ignore
  const workoutName = route.params?.workoutName
  // @ts-ignore
  const exercises = route.params?.exercises
  // @ts-ignore
  const wId = route.params?.wId

 

  useEffect(() => {
    navigation.setOptions({
      title: workoutName,
      headerBackTitle: 'Home',
    });
  }, []);
  
  const handleNavigation = (exercise: IFeaturedExercises) => {
    // @ts-ignore
    navigation.navigate('ExerciseDetails', { exerciseData: exercise, wId: wId });
  };

 
  const ExerciseList = (props: IExerciseProps) => (
    <View>
      <TouchableHighlight
        style={{ borderBottomWidth: 0.4, borderColor: '#c2c2c2' }}
        activeOpacity={0.8}
        underlayColor='#efefef'
        onPress={() => handleNavigation(props.exercise)}
      >
        <View style={[styles.exerciseContainer]}>
          <View style={{ gap: 5 }}>
            <Text style={styles.exerciseName}>
              {props.exercise.exerciseName}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 13 }}>{props.exercise.muscleGroup}</Text>
              <Entypo name='dot-single' size={15} color='black' />
              <Text style={{ fontSize: 13 }}>
                {props.exercise.sets.length} Sets
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
  

  const startWorkout = () => {
    const activeWorkout: IWorkout = {
      wId: wId,
    };
    dispatch(start(activeWorkout));

    // @ts-ignore
    navigation.navigate('StartWorkout', { exercises: exercises });
  };

  return (
    <View>
      <ScrollView
        style={{ paddingLeft: 20, height: '100%' }}
        contentContainerStyle={{ paddingBottom: 70 }}
      >
        <Text style={styles.header}>{exercises.length} Exercises</Text>
        {exercises.map((val: IFeaturedExercises, index: number) => (
        <ExerciseList exercise={val} index={index} key={index} />
      ))}
      </ScrollView>
      <TouchableOpacity
        style={{
          backgroundColor: '#be4949',
          borderRadius: 10,
          position: 'absolute',
          bottom: 10,
          width: width - 40,
          alignSelf: 'center',
        }}
        onPress={() => startWorkout()}
      >
        <Text
          style={{
            color: 'white',
            padding: 10,
            fontSize: 18,
            fontWeight: '700',
            textAlign: 'center',
          }}
        >
          Start Workout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: '700',
    fontStyle: 'italic',
    marginVertical: 20,
  },

  exerciseContainer: {
    width: '100%',
    height: 75,
    paddingVertical: 20,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#efefef',
  },
  exerciseName: {
    fontWeight: '700',
    fontSize: 15,
    color: '#4d4d4d',
  },
  box: {
    height: 150,
    width: 150,
    backgroundColor: 'blue',
    borderRadius: 5,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    width: '60%',
  },
  input: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
});
