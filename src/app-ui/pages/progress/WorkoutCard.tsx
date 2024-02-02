import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IWorkout } from '../../typings/types';
//import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export interface IWorkoutCardProps extends IWorkout{
    exercises: string[];
    sets: number[];
    reps: number[];
    PercentageOfOneRepMax: number[];
}

// export function WorkoutCard(props: IWorkoutCardProps) {
//     const { name, date, duration, exercises, sets, reps, PercentageOfOneRepMax } = props;
//     const numOfExercises = exercises.length;
//     const formattedDate = date.toLocaleDateString();
//     return (
//         <View style={styles.container}>
//             <Text style={styles.date}>{formattedDate}</Text>
//             <Text style={styles.title}>{name}</Text>
//             <Text style={styles.content}>{`${duration} minutes`}</Text>
//             {exercises.map((exercise, index) => (
//                 <Text key={index} style={styles.content}>
//                     {`${exercise} - ${sets[index]} sets of ${reps[index]} reps. Load: ${PercentageOfOneRepMax[index]}% of 1RM.`}
//                 </Text>
//             ))}
//         </View>
//     );
// }

export function WorkoutCard(props: IWorkoutCardProps) {
    const { name, date, duration, exercises, sets, reps, PercentageOfOneRepMax } = props;
    const [expanded, setExpanded] = useState(false);

    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <View style={styles.card}>
            <Text style={styles.date}>{formattedDate}</Text>
            <Text style={styles.title}>{name}</Text>
            <View style={styles.details}>
                <Ionicons name="ios-time-outline" size={16} color="black" />
                <Text style={styles.detailText}>{`${duration} min`}</Text>
                <Ionicons name="ios-fitness-outline" size={16} color="black" />
                <Text style={styles.detailText}>{`${exercises.length} exercises`}</Text>
            </View>
            {expanded && exercises.map((exercise, index) => (
                <Text key={index} style={styles.content}>
                    {`${exercise} - ${sets[index]} sets of ${reps[index]} reps. Load: ${PercentageOfOneRepMax[index]}% of 1RM`}
                </Text>
            ))}
            <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.expandButton}>
                <Ionicons name={expanded ? 'ios-chevron-up' : 'ios-chevron-down'} size={24} color="#007AFF" />
            </TouchableOpacity>
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
        fontSize: 12,
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