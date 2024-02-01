import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IWorkout } from '../../typings/types';

export interface IWorkoutCardProps extends IWorkout{
    exercises?: string[];
}

export function WorkoutCard(props: IWorkoutCardProps) {
    const { name, date, duration, numOfExercises, exercises, } = props;
    const formattedDate = date.toLocaleDateString();
    return (
        <View style={styles.container}>
            <Text style={styles.date}>{formattedDate}</Text>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.content}>{duration}</Text>
            <Text style={styles.content}>{numOfExercises}</Text>
        </View>
    )
}

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