import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { IFeaturedWorkout } from '../../typings/types';

interface IFeaturedProgram {
  workout: IFeaturedWorkout;
  index: number;
  workouts: IFeaturedWorkout[];
}

const width = Dimensions.get('window').width;
export function FeaturedProgramComponent(props: IFeaturedProgram) {
  const { workout, index, workouts } = props;
  return (
    <View
      style={[
        styles.container,
        { marginRight: index === workouts.length - 1 ? 15 : 0 },
      ]}
    >
      <TouchableOpacity style={styles.play}>
        <Ionicons name='play' size={24} color='#e74341' />
      </TouchableOpacity>
      <Image
        source={workout.image}
        style={{ width: '100%', height: '50%', borderRadius: 20, opacity: 0.8 }}
      />
      <View style={{ padding: 15, justifyContent: 'space-between', flex: 1 }}>
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 25 }}>
            {workout.name}
          </Text>
        </View>
        <Text style={{ fontWeight: '500', fontSize: 14, color: 'grey' }}>
          {workout.type}
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={styles.timeContainer}>
            <FontAwesome5 name='clock' size={14} color='#fa8e00' />
            <Text style={{ fontSize: 11, color: '#fa8e00', fontWeight: '600' }}>
              {workout.duration} min
            </Text>
          </View>
          <View style={styles.exerciseContainer}>
            <Ionicons name='barbell-outline' size={14} color='#34a420' />
            <Text style={{ fontSize: 11, color: '#34a420', fontWeight: '600' }}>
              {workout.numOfExercies} Exercises
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
    width: (width * 70) / 100,
    height: 250,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    left: '75%',
    bottom: '40%',
    zIndex: 1,
  },
});
