import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import {IFeaturedExercises, IFeaturedWorkout } from '../../typings/types';
import { useNavigation } from '@react-navigation/native';

interface IFeaturedProgram {
  workout: IFeaturedWorkout;
  index: number;
  workouts: IFeaturedWorkout[];
  exercises: IFeaturedExercises[][];
}

const width = Dimensions.get('window').width;
export function FeaturedProgramComponent(props: IFeaturedProgram) {
  const { workout, index, workouts, exercises } = props;
  const navigation = useNavigation();

  const handleNavigtion = () => {
    // @ts-ignore
    navigation.navigate('FeaturedExerciseList', {
      workoutName: workout.name,
      id: workout.wId,
      exercises: exercises[index]
    });
  };
  
  return (
    <Pressable
      style={[
        styles.container,
        { marginRight: index === workouts.length - 1 ? 15 : 0 },
      ]}
      onPress = {() => handleNavigtion()}
    >
      <TouchableOpacity style={styles.play}>
        <Ionicons name='play' size={20} color='#e74341' />
      </TouchableOpacity>
      <Image
        source={workout.image}
        style={{ width: '100%', height: '45%', borderRadius: 20, opacity: 0.8 }}
      />
      <View style={{ padding: 15, justifyContent: 'space-between', flex: 1 }}>
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
            {workout.name}
          </Text>
        </View>
        <Text style={{ fontWeight: '500', fontSize: 12, color: 'grey' }}>
          {workout.type}
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={styles.timeContainer}>
            <FontAwesome5 name='clock' size={12} color='#fa8e00' />
            <Text style={{ fontSize: 11, color: '#fa8e00', fontWeight: '600' }}>
              {workout.duration} min
            </Text>
          </View>
          <View style={styles.exerciseContainer}>
            <Ionicons name='barbell-outline' size={12} color='#34a420' />
            <Text style={{ fontSize: 11, color: '#34a420', fontWeight: '600' }}>
              {workout.numOfExercies} Exercises
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
    width: width / 1.7,
    height: 200,
    borderRadius: 20,
    marginLeft: 15,
  },

  timeContainer: {
    flexDirection: 'row',
    gap: 3,
    padding: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: '#fff2e7',
    borderColor: '#fa8e00',
    borderRadius: 20,
  },

  exerciseContainer: {
    flexDirection: 'row',
    gap: 3,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: '#efffec',
    borderColor: '#34a420',
    borderRadius: 20,
  },

  play: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    left: '75%',
    bottom: '45%',
    zIndex: 1,
  },
});
