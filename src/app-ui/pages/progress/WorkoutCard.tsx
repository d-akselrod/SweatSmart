import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IWorkout } from '../../typings/types';
//import { Picker } from '@react-native-picker/picker';

export interface IWorkoutCardProps extends IWorkout{
    exercises: string[];
    sets: number[];
    reps: number[];
}

export function WorkoutCard(props: IWorkoutCardProps) {
    const { name, date, duration, exercises, sets, reps } = props;
    const numOfExercises = exercises.length;
    const formattedDate = date.toLocaleDateString();
    return (
        <View style={styles.container}>
            <Text style={styles.date}>{formattedDate}</Text>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.content}>{`${duration} minutes`}</Text>
            {exercises.map((exercise, index) => (
                <Text key={index} style={styles.content}>
                    {`${exercise} - ${sets[index]} sets of ${reps[index]} reps`}
                </Text>
            ))}
        </View>
    );
}
            {/* <Picker
                selectedValue={numOfExercises}
                style={{ height: 50, width: 150 }}
            >
                {exercises.map((exercise, index) => (
                    <Picker.Item 
                        key={index} 
                        label={`${exercise} - ${sets[index]} sets of ${reps[index]} reps`} 
                        value={exercise} 
                    />
                ))}
            </Picker> */}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: 200,
    },
    
    date: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    
    content: {
        fontSize: 12,
    }
})