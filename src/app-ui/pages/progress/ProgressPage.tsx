import { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { IWorkoutCardProps, WorkoutCard } from './WorkoutCard';
import { getWorkouts } from '../../service/WorkoutAPI';
import { IUser } from '../../typings/types';
export function HistoryPage() {
    const activeUser: IUser = useSelector((state: any) => state.user);
    const [workouts, setWorkouts] = useState<IWorkoutCardProps[]>([]);

    useEffect(() => {
        const loadWorkouts = async () => {
            try {
                const response = await getWorkouts(activeUser.username);
                if (response.ok) {
                    const data = await response.json();
                    setWorkouts(data.body);
                } else {
                    console.error(response);
                }
            } catch (error) {
                console.log(error);
            }
        };

        loadWorkouts();
    }, []);

    const renderWorkouts = (item: IWorkoutCardProps) => {
        return <WorkoutCard {...item} />
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                <View>
                    <Text style={styles.header}>{activeUser.username}</Text>
                    <Text style={styles.title}>Past Workouts</Text>
                </View>
                <View style={styles.container}>
                    <FlatList
                        data={workouts}
                        renderItem={({item}) => renderWorkouts(item)}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
    
const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    header: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 16,
        fontStyle: 'italic'
    },
});