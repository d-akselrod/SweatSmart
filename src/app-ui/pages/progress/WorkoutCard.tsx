import React, { useState } from 'react';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IWorkout } from '../../typings/types';
//import { Picker } from '@react-native-picker/picker';

export interface IWorkoutCardProps extends IWorkout {
  [x: string]: any;
  exercises: string[];
  sets: number[];
  reps: number[];
  percentageOfOneRepMax: number[];
}

export function WorkoutCard(props: IWorkoutCardProps) {
  const {
    name,
    date,
    duration,
    exercises = [],
    sets = [],
    reps = [],
    percentageOfOneRepMax = [],
  } = props;
  const [expanded, setExpanded] = useState(false);

  const formattedDate =
    date instanceof Date
      ? date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '';

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.title}>{name}</Text>
        <View style={styles.details}>
          <FontAwesome5 name='clock' size={14} color='grey' />
          <Text style={styles.detailText}>{`${duration} min`}</Text>
        </View>
        <View style={styles.details}>
          <Ionicons name='barbell-outline' size={14} color='grey' />
          <Text
            style={styles.detailText}
          >{`${exercises.length} exercises`}</Text>
        </View>
        {expanded &&
          exercises.map((exercise, index) => (
            <Text key={index} style={styles.content}>
              {`${exercise} - ${sets[index]} sets of ${reps[index]} reps. Load: ${percentageOfOneRepMax[index]}% of 1RM`}
            </Text>
          ))}
      </View>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.expandButton}
      >
        <Ionicons
          name={expanded ? 'ios-chevron-up' : 'ios-chevron-down'}
          size={24}
          color='#007AFF'
        />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 12,
    color: 'grey',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
  },
  content: {
    fontSize: 10,
    marginTop: 4,
  },
  expandButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  expandButtonText: {
    fontSize: 14,
    color: '#007AFF',
  },
});
