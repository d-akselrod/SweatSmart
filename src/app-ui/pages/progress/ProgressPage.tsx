import { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { IWorkoutCardProps, WorkoutCard } from './WorkoutCard';
import { getWorkouts } from '../../service/WorkoutAPI';
import { IUser } from '../../typings/types';
import { getWorkoutPlanByWid } from '../../service/WorkoutPlanAPI';
import { getUserWorkoutByWid } from '../../service/UserWorkoutAPI';

export function ProgressPage() {
    const activeUser: IUser = useSelector((state: any) => state.user);
    const [workouts, setWorkouts] = useState<IWorkoutCardProps[]>([]);
    const [workoutPlan, setWorkoutPlan] = useState<IWorkoutCardProps[]>([]);
    const [joinedWorkouts, setJoinedWorkouts] = useState<IWorkoutCardProps[]>([]);
    // const activeUser = {username: 'testuser'}
    // for testing the UI without the need to login
    // const [joinedWorkouts, setJoinedWorkouts] = useState<IWorkoutCardProps[]>([
    //     {
    //         wId: "1",
    //         date: new Date(),
    //         duration: 60,
    //         name: 'Leg Day',
    //         exercises: [
    //             'Squats',
    //             'Deadlifts',
    //             'Lunges'
    //         ],
    //         sets: [4, 4, 4],
    //         reps: [10, 10, 10]
    //     },
    //     {
    //         wId: "2",
    //         date: new Date(),
    //         duration: 45,
    //         name: 'Chest Day',
    //         exercises: [
    //             'Bench Press',
    //             'Incline Bench Press',
    //             'Dumbbell Flys'
    //         ],
    //         sets: [4, 4, 4],
    //         reps: [10, 10, 10]
    //     },
    //     {
    //         wId: "3",
    //         date: new Date(),
    //         duration: 30,
    //         name: 'Back Day',
    //         exercises: [
    //             'Pullups',
    //             'Deadlifts',
    //             'Rows'
    //         ],
    //         sets: [4, 4, 4],
    //         reps: [10, 10, 10]
    //     },
    //     {
    //         wId: "4",
    //         date: new Date(),
    //         duration: 60,
    //         name: 'Arm Day',
    //         exercises: [
    //             'Bicep Curls',
    //             'Tricep Extensions',
    //             'Hammer Curls'
    //         ],
    //         sets: [4, 4, 4],
    //         reps: [10, 10, 10]
    //     }
        
    // ]);


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

useEffect(() => {
    if (workouts.length > 0) {
        const loadWorkoutPlan = async () => {
            try {
                const response = await getWorkoutPlanByWid(workouts[0].wId);
                if (response.ok) {
                    const data = await response.json();
                    setWorkoutPlan(data.body);
                } else {
                    console.error(response);
                }
            } catch (error) {
                console.log(error);
            }
        };

        loadWorkoutPlan();
    }
}, [workouts]);

useEffect(() => {
    if (workouts && workoutPlan) {
        const loadUserWorkouts = async () => {
            const joinedData = await Promise.all(workouts.map(async (workout) => {
                const correspondingPlan = workoutPlan.find(plan => plan.wId === workout.wId);
                const response = await getUserWorkoutByWid(workout.wId);
                if (response.ok) {
                    const data = await response.json();
                    return {
                        ...workout,
                        ...correspondingPlan,
                        status: data.body.status
                    };
                } else {
                    return null;
                }
            }));

            const completedWorkouts = joinedData.filter(workout => workout && workout.status === 'completed');
            setJoinedWorkouts(completedWorkouts as IWorkoutCardProps[]);
        };

        loadUserWorkouts();
    }
}, [workouts, workoutPlan]);

<FlatList
    data={joinedWorkouts}
    renderItem={({item}) => renderWorkouts(item)}
/>

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
                        data={ joinedWorkouts } 
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