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
  getAllExercises,
  getExercisesByWId,
  updateWorkoutName,
} from '../../service/WorkoutAPI';
import {
  IExercise,
  IUser,
  IWorkout,
  IWorkoutExercise,
} from '../../typings/types';


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
  const activeWorkout: any = useSelector((state: any) => state.workout);
  const isFocused = useIsFocused();
  // @ts-ignore
  const [workoutName, setWorkoutName] = useState(route.params?.workoutName);
  // @ts-ignore
  const wId = route.params?.id;
  const width = Dimensions.get('window').width;
  const [visible, setVisibility] = useState(false);
  const [name, setName] = useState('');

  console.log(activeWorkout)

  const createDeleteAlert = () =>
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Delete', onPress: () => deleteWorkout() },
      ],
    );

  const changeWorkoutName = async () => {
    setWorkoutName(name);
    try {
      const response = await updateWorkoutName(wId, name);
      if (response.ok) {
        setVisibility(false);
      } else {
        console.log('Not Working');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteWorkout = async () => {
    try {
      const response = await deleteWorkoutByWid(wId);
      if (response.ok) {
        navigation.goBack();
      } else {
        console.log('Error deleting workout');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: workoutName,
      headerBackTitle: 'Home',
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 10, marginRight: 20 }}>
          <TouchableOpacity onPress={() => setVisibility(true)}>
            <AntDesign name='edit' size={24} color='black' />
          </TouchableOpacity>
          <TouchableOpacity onPress={createDeleteAlert}>
            <MaterialIcons name='delete-outline' size={24} color='black' />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [workoutName]);

  useEffect(() => {
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
  }, [isFocused, showPage, name]);

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
    // @ts-ignore
    navigation.navigate('ExerciseDetails', {
      exerciseData: exercise,
      wId: wId,
    });
  };

  const deleteExercise = async (eId: number) => {
    const exercises = workoutExercises.filter(e => e.eId != eId);
    setWorkoutExercises(exercises);
    try {
      const response = await deleteExerciseFromWorkout(wId, eId);
      if (response.ok) {
        return;
      } else if (response.status == 404) {
        setWorkoutExercises([]);
      } else {
        console.log('Couldnt delete exercise');
      }
    } catch (e) {
      console.log('couldt delete');
    }
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
          <TouchableOpacity onPress={() => deleteExercise(props.exercise.eId)}>
            <MaterialIcons name='delete-outline' size={24} color='black' />
          </TouchableOpacity>
        </View>
      </TouchableHighlight>
    </View>
  );

  const filterExercises = () => {
    const exerciseIds = workoutExercises.map(
      workoutExercise => workoutExercise.eId,
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
      <Modal transparent={true} visible={visible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>
              New Workout Name
            </Text>
            <TextInput
              style={styles.input}
              placeholder='New Workout...'
              onChangeText={(text: string) => setName(text)}
              maxLength={12}
              value={name}
            />
            <Button title='Submit' onPress={() => changeWorkoutName()} />
          </View>
        </View>
      </Modal>
      <ScrollView
        style={{ paddingLeft: 20, height: '100%' }}
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
