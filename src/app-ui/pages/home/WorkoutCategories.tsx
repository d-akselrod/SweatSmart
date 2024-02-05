import { useEffect, useRef, useState } from 'react';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native';
import { getExercisesByMuscleGroup } from '../../service/WorkoutAPI';
import { IExercise, IWorkoutCategory } from '../../typings/types';
import { useNavigation } from '@react-navigation/native';

export function WorkoutCategories(props: IWorkoutCategory) {
  const { image, categoryName, imgHeight, imgWidth } = props;
  const muscleGroupExercises = useRef<IExercise[]>();

  const [exercises, setExercises] = useState<IExercise[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      const response = await getExercisesByMuscleGroup(categoryName);
      try {
        if (response.ok) {
          const data = await response.json();
          setExercises(data.body);
        } else {
          console.error(response);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadData();
  }, []);
  
  const handleNavigation = () => {
    // @ts-ignore
    navigation.navigate('ExerciseList', {name: categoryName, exerciseList: exercises})
  }

  return (
    <Pressable style={styles.container} onPress = {() => handleNavigation()}>
      <View style={styles.container2}>
        <View style={{ width: 68, alignItems: 'center' }}>
          <Image
            source={image}
            style={{ width: imgWidth, height: imgHeight }}
          />
        </View>
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
            {categoryName}
          </Text>
          <Text style={{ fontSize: 12 }}>
            {exercises.length > 0 ? `${exercises.length} Exercises` : ''}
          </Text>
        </View>
      </View>
      <AntDesign name="right" size={20} color="black" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 5,
    height: 80,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    gap: 10,
  },
});
