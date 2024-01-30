import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { ProgressBar } from './ProgressBar';
import { IWorkout } from '../../typings/types';

interface IWorkoutProgramProps {
  workout: IWorkout;
}
const width = Dimensions.get('window').width;
export function WorkoutProgramComponent(props: IWorkoutProgramProps) {
  const { workout } = props;
  return (
    <TouchableOpacity style={styles.container}>
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
            {workout.numOfExercises && workout.numOfExercises > 0
              ? `${workout.numOfExercises} Exercises`
              : 'No Exercises'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}>
          <FontAwesome5 name='clock' size={14} color='grey' />
          <Text style={{ fontSize: 9, color: 'grey' }}>
            {workout.duration ? `${workout.duration} Minutes` : '0 Minutes'}
          </Text>
        </View>
      </View>
      <ProgressBar />
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
