import { FontAwesome5 } from '@expo/vector-icons';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { IWorkoutCategory } from '../../typings/types';

export function WorkoutCategories(props: IWorkoutCategory) {
  const { numOfExercises, image, categoryName, imgHeight, imgWidth } = props;
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
          <Text style={{ fontSize: 12 }}>{numOfExercises} Exercises</Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: '#4ABAD2',
          justifyContent: 'center',
          alignItems: 'center',
          width: 24,
          height: 24,
          borderRadius: 12,
        }}
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
    borderRadius: 2,
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
