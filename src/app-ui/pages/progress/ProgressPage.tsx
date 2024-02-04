import { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { IWorkoutCardProps, WorkoutCard } from './WorkoutCard';
import { getCompletedWorkouts } from '../../service/WorkoutAPI';
import { IUser } from '../../typings/types';
import { getWorkoutPlanByWid } from '../../service/WorkoutPlanAPI';
import { getUserWorkoutByWid } from '../../service/UserWorkoutAPI';
import { PastWorkoutsHeader } from './PastWorkoutsHeader'; 
import { StatisticsHeader } from './StatisticsHeader'; 

export function ProgressPage() {
    const activeUser: IUser = useSelector((state: any) => state.user);
    const [workouts, setWorkouts] = useState<IWorkoutCardProps[]>([]);
    const [workoutsCompleted, setWorkoutsCompleted] = useState<number>(0);
    const [workoutPlan, setWorkoutPlan] = useState<IWorkoutCardProps[]>([]);
    const [joinedWorkouts, setJoinedWorkouts] = useState<IWorkoutCardProps[]>([]);
    const [totalCompletedExercises, setTotalCompletedExercises] = useState<number>(0);
    // const activeUser = {username: 'testuser'}
    // //for testing the UI without the need to login
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
    //         reps: [10, 10, 10],
    //         PercentageOfOneRepMax: [60, 70, 80]
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
    //         reps: [10, 10, 10],
    //         PercentageOfOneRepMax: [60, 70, 80]
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
    //         reps: [10, 10, 10],
    //         PercentageOfOneRepMax: [60, 70, 80]
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
    //         reps: [10, 10, 10],
    //         PercentageOfOneRepMax: [60, 70, 80]
    //     }
        
    // ]);
    
    useEffect(() => {
        const loadWorkouts = async () => {
            try {
                const response = await getCompletedWorkouts(activeUser.username);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Workouts data:", data.body);
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

    // useEffect(() => {
    //     if (workouts.length > 0) {
    //         const loadWorkoutPlan = async () => {
    //             try {
    //                 const response = await getWorkoutPlanByWid(workouts[0].wId);
    //                 if (response.ok) {
    //                     const data = await response.json();
    //                     setWorkoutPlan(data.body);
    //                 } else {
    //                     console.error(response);
    //                 }
    //             } catch (error) {
    //                 console.log(error);
    //             }
    //         };
    //         loadWorkoutPlan();
    //     }
    // }, [workouts]);

    useEffect(() => {
        if (workouts.length > 0) {
            const loadWorkoutPlans = async () => {
                try {
                    const plansPromises = workouts.map(async (workout) => {
                        const response = await getWorkoutPlanByWid(workout.wId);
                        if (response.ok) {
                            const data = await response.json();
                            console.log(`Workout plan for ${workout.wId}:`, data.body);
                            return data.body;
                        } else {
                            console.log(`Error for ${workout.wId}:`, response.status, response.statusText);
                            //console.error(response);
                            return null;
                        }
                    });

                    const plans = await Promise.all(plansPromises);
                    console.log("All workout plans:", plans);
                    setWorkoutPlan(plans.filter(plan => plan !== null));
                } catch (error) {
                    console.log(error);
                }
            };

            loadWorkoutPlans();
        }
    }, [workouts]);

    useEffect(() => {
        if (workouts && workoutPlan) {
            const joinedData = workouts.map(workout => {
                const correspondingPlan = workoutPlan.find(plan => plan.wId === workout.wId);
                return {
                    ...workout,
                    ...correspondingPlan,
                };
            });
    
            setJoinedWorkouts(joinedData as IWorkoutCardProps[]);
            setWorkoutsCompleted(joinedData.length);
    
            const totalCompletedExercises = joinedData.reduce((total, workout) => {
                if (workout && workout.exercises) {
                    return total + workout.exercises.length;
                } else {
                    return total;
                }
            }, 0);
            setTotalCompletedExercises(totalCompletedExercises);
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
        
        <SafeAreaView style={styles.safeArea}>
            <StatisticsHeader workouts={workoutsCompleted} exercises={totalCompletedExercises} />
            <PastWorkoutsHeader username={activeUser.username} onAddWorkout={function (): void { //need to implement this clickable function, should navigate to log page
                throw new Error('Function not implemented.');
            } } />
            <FlatList
                data={joinedWorkouts}
                renderItem={({ item }) => renderWorkouts(item)} 
            />
        </SafeAreaView>
    );
}
    
const styles = StyleSheet.create({
    safeArea: {
        flex: 1
      },
    container: {
        marginTop: 10,
    },
    header: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    title: {
        fontSize: 16,
        fontStyle: 'italic'
    },
});