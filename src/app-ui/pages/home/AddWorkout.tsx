import { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
  Modal,
} from 'react-native';
import { useSelector } from 'react-redux';
import { AddExercisesPage } from './AddExercisesPage';
import { getExerciseSortedList } from '../../service/ExerciseAPI';
import { generateWorkout, generateWorkoutPlan, getAllExercises } from '../../service/WorkoutAPI';
import { IExercise, IUser } from '../../typings/types';
import { getFrequency } from '../../service/ProfileAPI';

export function AddWorkout() {
  const activeUser: IUser = useSelector((state: any) => state.user);
  const [name, setName] = useState('');
  const [option, setOption] = useState(0);
  const [workoutType, setWorkoutType] = useState(0);
  const [frequency, setFrequency] = useState<number>(0);
  const [exercises, setExercises] = useState<IExercise[]>();
  const [show, setShow] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    getExercises();
    fetchUserFrequency();
  }, []);
  const handleApply = () => {
    // // @ts-ignore
    // navigation.navigate("AddExercisePage", {exercises: exercises, workoutName: name})
    if (option === 0) {
      setShow(true);
    } else if (option === 1) {
      handleGenerateWorkout();
    } else if (option === 2) {
      handleGenerateWorkoutPlan()
    }
  };

  const handleGenerateWorkout = async () => {
    try {
      const response = await generateWorkout(activeUser.username, workoutType);
      if (response.ok) {
        const data = await response.json();
        navigation.goBack();
      } else {
        const data = await response.json();
        console.log('ERROR HAS OCCURED!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUserFrequency = async () => {
    try {
      const response = await getFrequency(activeUser.uId);
      if (response.ok) {
        const data = await response.json();
        setFrequency(data.frequency);
      } else {
        console.log('ERROR HAS OCCURED!');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleGenerateWorkoutPlan = async () => {
    try {
      const response = await generateWorkoutPlan(activeUser.username, frequency);
      if (response.ok) {
        const data = await response.json();
        navigation.goBack();
      } else {
        const data = await response.json();
        console.log('ERROR HAS OCCURED!');
      }
    } catch (e) {
      console.error(e);
    }
  }

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

  const handleClose = () => {
    setShow(false);
  };

  const handleNavigation = (wId: string, name: string) => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F6F6' }}>
      <Modal
        animationType={'slide'}
        visible={show}
        onRequestClose={() => setShow(false)}
      >
        {exercises && (
          <AddExercisesPage
            exercises={exercises}
            close={() => handleClose()}
            workoutName={name}
            navigate={(wId: string, name: string) =>
              handleNavigation(wId, name)
            }
          />
        )}
      </Modal>

      <View style={styles.container}>
        <Text style={styles.title}>Build a new workout</Text>
        <TextInput
          placeholder={'Name of workout'}
          style={styles.input}
          onChangeText={text => setName(text)}
        />
        <View
          style={{
            width: '100%',
            height: '45%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Pressable
            style={[
              styles.button,
              { borderColor: option === 0 ? '#A9ABF1' : 'white' },
            ]}
            onPress={() => setOption(0)}
          >
            <Image
              style={{ height: '45%', width: '70%' }}
              source={require('../../assets/images/workout.png')}
            />
            <View style={{ alignItems: 'center', gap: 10 }}>
              <Text style={styles.text}>Add individual exercises</Text>
              <View style={styles.radioButton}>
                {option === 0 && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#A9ABF1',
                    }}
                  />
                )}
              </View>
            </View>
          </Pressable>
          <Pressable
            style={[
              styles.button,
              { borderColor: option === 1 ? '#A9ABF1' : 'white' },
            ]}
            onPress={() => setOption(1)}
          >
            <Image
              style={{ height: '45%', width: '70%' }}
              source={require('../../assets/images/generator.png')}
            />
            <View style={{ alignItems: 'center', gap: 10 }}>
              <Text style={styles.text}>Generate Workout</Text>
              <View style={styles.radioButton}>
                {option === 1 && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#A9ABF1',
                    }}
                  />
                )}
              </View>
            </View>
          </Pressable>
        </View>
        <Pressable
          style={{
            width: '100%',
            padding: 15,
            backgroundColor: '#7F87CD',
            borderRadius: 10,
          }}
          onPress={() => handleApply()}
        >
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 17,
              fontWeight: 'bold',
            }}
          >
            Continue
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginHorizontal: 30,
    height: '80%',
    // borderWidth: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textInput: {
    borderColor: '#4b6691',
    borderWidth: 2,
    width: '100%',
    fontSize: 20,
  },

  title: {
    fontSize: 25,
    fontStyle: 'italic',
  },

  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ababab',
    fontSize: 20,
    textAlign: 'center',
  },

  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 2,
  },

  text: {
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '200',
  },
});
