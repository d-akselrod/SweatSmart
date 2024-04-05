import { useEffect, useRef, useState } from 'react';
import { AntDesign, Entypo, Feather, Fontisto } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ProgressBar } from './ProgressBar';
import Timer from '../../components/Timer';
import { end, recordWorkout } from '../../redux/slices/workoutSlice';
import { completeWorkout } from '../../service/WorkoutAPI';
import { addSetToExercise } from '../../service/WorkoutPlanAPI';
import { IUser, IWorkout, IWorkoutExercise } from '../../typings/types';

interface IExerciseProps {
  exercise: IWorkoutExercise;
  index: number;
}
export function StartWorkoutPage() {
  const activeUser: IUser = useSelector((state: any) => state.user);
  const activeWorkout: any = useSelector((state: any) => state.workout);
  const dispatch = useDispatch();
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const interval = useRef(0);
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const exercises = route.params?.exercises;
  useEffect(() => {
    if (isRunning) {
      interval.current = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(interval.current);
    }
  }, [isRunning]);

  const createTwoButtonAlert = () =>
    Alert.alert(
      'Incomplete Workout',
      'You have not logged all of your sets. Are you sure you want to finish?',
      [
        {
          text: 'Resume',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Finish', onPress: () => handleCompleteWorkout() },
      ],
    );
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(
      minutes,
    ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return formattedTime;
  };

  const handleNavigation = (exercise: IWorkoutExercise) => {
    // @ts-ignore
    navigation.navigate('ExerciseLogger', { exerciseData: exercise });
  };

  const handleCompleteWorkout = async () => {
    console.log(activeUser.username, activeWorkout.wId);
    try {
      await completeWorkout(activeUser.username, activeWorkout.workout.wId);
      dispatch(
        recordWorkout({
          workout: activeWorkout.workout.wId,
          duration: seconds,
        }),
      );
    } catch (error) {
      console.log(error);
    } finally {
      navigation.goBack();
    }
  };

  const handleCancelWorkout = () => {
    console.log(activeWorkout);
    dispatch(end());
    navigation.goBack();
  };

  const ExerciseList = (props: IExerciseProps) => {
    const someCompleted = !activeWorkout.loggedExercises.hasOwnProperty(
      props.exercise.exerciseName,
    )
      ? false
      : activeWorkout.loggedExercises[props.exercise.exerciseName].every(
          (val: boolean) => !val,
        )
      ? false
      : true;
    return (
      <TouchableHighlight
        style={{ borderBottomWidth: 0.4, borderColor: '#c2c2c2' }}
        activeOpacity={0.5}
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
            {someCompleted && (
              <Text
                style={{ fontSize: 13, fontWeight: '600', color: '#258a21' }}
              >
                {activeWorkout.loggedExercises[
                  props.exercise.exerciseName
                ].filter((val: boolean) => val).length + ' of '}
                {activeWorkout.loggedExercises[props.exercise.exerciseName]
                  .length + ' Logged'}
              </Text>
            )}
          </View>
          <AntDesign name='ellipsis1' size={20} color='black' />
        </View>
      </TouchableHighlight>
    );
  };

  const createAlert = () =>
    Alert.alert(
      'Cancel Workout',
      'Are you sure you want to exit? The progress will not be saved',
      [
        {
          text: 'Resume',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'End', onPress: () => handleCancelWorkout() },
      ],
    );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity onPress={createAlert} style={{ padding: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: '600' }}>Cancel</Text>
      </TouchableOpacity>
      <ScrollView
        style={{ marginLeft: 20 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View
          style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center',
            height: 100,
          }}
        >
          <Fontisto name='stopwatch' size={20} color='black' />
          <Text style={styles.timerText}>{formatTime(seconds)}</Text>
        </View>
        <Text style={styles.header}>{exercises.length} Exercises</Text>
        {exercises.map((val: IWorkoutExercise, index: number) => (
          <ExerciseList exercise={val} index={index} key={index} />
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.stopButton}
        onPress={createTwoButtonAlert}
      >
        <Entypo name='controller-stop' size={30} color='white' />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  timerText: {
    fontSize: 30,
    fontWeight: '600',
    fontStyle: 'italic',
  },
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

  stopButton: {
    backgroundColor: '#be4949',
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
});
