import { useEffect, useState } from 'react';
import { AntDesign, Entypo } from '@expo/vector-icons';
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
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AddExercisesPage } from './AddExercisesPage';
import { StartWorkoutPage } from './StartWorkoutPage';
import { start } from '../../redux/slices/workoutSlice';
import { getAllExercises, getExercisesByWId } from '../../service/WorkoutAPI';
import { IExercise, IUser, IWorkout, IWorkoutExercise } from '../../typings/types';

interface IExerciseProps {
  exercise: IWorkoutExercise;
  index: number;
}
export function WorkoutExercisesPage() {
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const [workoutExercises, setWorkoutExercises] = useState<IWorkoutExercise[]>(
    [],
  );
  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [showPage, setShow] = useState<boolean>(false);
  const [showStartWorkout, setStartWorkout] = useState<boolean>(false);
  const activeWorkout: any = useSelector((state: any) => state.workout);
  console.log(activeWorkout)
  const isFocused = useIsFocused();
  // @ts-ignore
  const workoutName = route.params?.workoutName;
  // @ts-ignore
  const wId = route.params?.id;
  const width = Dimensions.get('window').width;

  useEffect(() => {
    navigation.setOptions({
      title: workoutName,
      headerBackTitle: 'Home',
    });

    const getWorkoutExercises = async () => {
      try {
        const response = await getExercisesByWId(wId);
        if (response.ok) {
          const data = await response.json();
          setWorkoutExercises(data.body);
        } else {
          console.log('NO RESPONSE');
        }
      } catch (error) {
        console.error(error);
      }
    };

    getWorkoutExercises();
    getExercises();
  }, [isFocused, showPage]);

  const getExercises = async () => {
    try {
      const response = await getAllExercises();
      if (response.ok) {
        const data = await response.json();
        setExercises(data);
      } else {
        const data = await response.json();
        console.log('ERROR HAS OCCURED!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = () => {
    const exercises = filterExercises();
    // @ts-ignore
    // navigation.navigate("AddExercisePage", {exercises: exercises, wId: wId})
    setShow(true);
  };

  const handleNavigation = (exercise: IWorkoutExercise) => {
    console.log(exercise);
    // @ts-ignore
    navigation.navigate('ExerciseDetails', { exerciseData: exercise });
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
              <Text style={{ fontSize: 13 }}>{props.exercise.sets} sets</Text>
              <Entypo name='dot-single' size={15} color='black' />
              <Text style={{ fontSize: 13 }}>{props.exercise.reps} reps</Text>
            </View>
          </View>
          <AntDesign name='ellipsis1' size={20} color='black' />
        </View>
      </TouchableHighlight>
    </View>
  );

  const filterExercises = () => {
    const exerciseIds = workoutExercises.map(
      workoutExercise => workoutExercise.exerciseId,
    );
    const filtered = exercises.filter(exercise => {
      return !exerciseIds.includes(exercise.eId);
    });

    return filtered;
  };

  const startWorkout = () => {
    const activeWorkout: IWorkout = {
      wId: wId,
    };
    dispatch(start(activeWorkout));

    // @ts-ignore
    navigation.navigate('StartWorkout', { exercises: workoutExercises });
  };

  return (
    <View>
      <ScrollView
        style={{ marginLeft: 20, height: '100%' }}
        contentContainerStyle={{ paddingBottom: 70 }}
      >
        <Modal
          animationType={'slide'}
          onRequestClose={() => setShow(false)}
          visible={showPage}
        >
          {exercises && (
            <AddExercisesPage
              exercises={filterExercises()}
              close={() => setShow(false)}
              wId={wId}
            />
          )}
        </Modal>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={styles.header}>{workoutExercises.length} Exercises</Text>
          <TouchableOpacity onPress={() => openModal()}>
            <AntDesign
              name='plus'
              size={24}
              color='black'
              style={{ paddingRight: 20 }}
            />
          </TouchableOpacity>
        </View>
        {workoutExercises.map((val, index) => (
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
});
