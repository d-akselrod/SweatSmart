import { useEffect, useState } from 'react';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { ProgressBar } from './ProgressBar';
import { getExercisesByWId } from '../../service/WorkoutAPI';
import { IWorkout } from '../../typings/types';

interface IWorkoutProgramProps {
  workout: IWorkout;
  index: number;
  workouts: IWorkout[];
}
const width = Dimensions.get('window').width;
export function WorkoutProgramComponent(props: IWorkoutProgramProps) {
  const { workout, index, workouts } = props;
  const navigation = useNavigation();
  const [numOfExercises, setNumOfExercises] = useState(0);
  const isFocused = useIsFocused();
  const handleNavigtion = () => {
    // @ts-ignore
    navigation.navigate('WorkoutExerciseList', {
      workoutName: workout.name,
      id: workout.wId,
    });
  };

  useEffect(() => {
    const getExercises = async () => {
      try {
        const response = await getExercisesByWId(workout.wId);
        if (response.ok) {
          const data = await response.json();
          setNumOfExercises(data.body.length);
        } else {
          console.log('NO RESPONSE');
        }
      } catch (error) {
        console.error(error);
      }
    };

    getExercises();
  }, [isFocused]);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { marginRight: index === workouts.length - 1 ? 15 : 0 },
      ]}
      onPress={() => handleNavigtion()}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={styles.title}>{workout.name}</Text>
        <TouchableOpacity>
          <Feather name='info' size={20} color='black' />
        </TouchableOpacity>
      </View>
      <View>
        <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}>
          <Ionicons name='barbell-outline' size={14} color='grey' />
          <Text style={{ fontSize: 9, color: 'grey' }}>
            {numOfExercises && numOfExercises > 0
              ? `${numOfExercises} Exercises`
              : 'No Exercises'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}>
          <FontAwesome5 name='clock' size={14} color='grey' />
          <Text style={{ fontSize: 9, color: 'grey' }}>
            {workout.duration
              ? `${Math.floor(workout.duration / 60)} Minutes`
              : '0 Minutes'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: width / 2.4,
    height: 100,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-between',
    marginLeft: 15,
  },

  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  durationContainer: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
  },
});
