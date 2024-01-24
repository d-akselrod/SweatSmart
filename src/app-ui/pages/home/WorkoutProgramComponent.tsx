import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { IWorkout } from '../../typings/types';

interface IWorkoutProgramProps {
  workout: IWorkout;
}
export function WorkoutProgramComponent(props: IWorkoutProgramProps) {
  const { workout } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{workout.name}</Text>
      <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}>
        <Ionicons name='barbell-outline' size={12} color='black' />
        <Text style={{ fontSize: 8 }}>{workout.numOfExercises} Exercises</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}>
        <FontAwesome5 name='clock' size={12} color='black' />
        <Text style={{ fontSize: 8 }}>{workout.duration} min</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightgreen',
    width: '90%',
    height: 80,
    borderRadius: 10,
    padding: 10,
    gap: 5,
  },

  title: {
    fontWeight: '600',
    fontSize: 16,
  },
});
