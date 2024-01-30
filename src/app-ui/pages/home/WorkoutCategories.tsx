import { useEffect, useRef } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getExercisesByMuscleGroup } from '../../service/WorkoutAPI';
import { IExercise, IWorkoutCategory } from '../../typings/types';
import { useNavigation } from '@react-navigation/native';
import {ExerciseListParams} from '../../typings/types'

export function WorkoutCategories(props: IWorkoutCategory) {
  const { image, categoryName, imgHeight, imgWidth } = props;
  const muscleGroupExercises = useRef<IExercise[]>();

  const navigation = useNavigation();
  const handleArrowClick = () => {
    // Navigate to the WorkoutList or another screen when the arrow is clicked
    // @ts-ignore
    navigation.navigate('ExerciseList', {name: categoryName, exerciseList: muscleGroupExercises.current})
  };

  useEffect(() => {
    const loadData = async () => {
      const response = await getExercisesByMuscleGroup(categoryName);
      try {
        if (response.ok) {
          const data = await response.json();
          muscleGroupExercises.current = data.body;
        } else {
          console.error(response);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadData();
  }, []);

  return (
    <View style={styles.container}>
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
            {muscleGroupExercises.current?.length} Exercises
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: '#d3dcff',
          justifyContent: 'center',
          alignItems: 'center',
          width: 24,
          height: 24,
          borderRadius: 12,
        }}
        onPress = {() => handleArrowClick()}
      >
        <FontAwesome5 name='arrow-right' size={15} color='black' />
      </TouchableOpacity>
    </View>
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
