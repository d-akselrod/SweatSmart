import { useState, useEffect } from 'react';
import React from 'react';
import { SafeAreaView, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { PastWorkoutsHeader } from './PastWorkoutsHeader';
import { StatisticsHeader } from './StatisticsHeader';
import { IWorkoutCardProps, WorkoutCard } from './WorkoutCard';
import { getExerciseByEid } from '../../service/ExerciseAPI';
//import { getUserWorkoutByWid } from '../../service/UserWorkoutAPI';
import { getCompletedWorkouts } from '../../service/WorkoutAPI';
import { getWorkoutPlanByWid } from '../../service/WorkoutPlanAPI';
import { IUser, IWorkout } from '../../typings/types';

export function ProgressPage() {
  const activeUser: IUser = useSelector((state: any) => state.user);
  const activeWorkout: any = useSelector((state: any) => state.workout);

  const [workouts, setWorkouts] = useState<IWorkoutCardProps[]>([]);
  const [workoutsCompleted, setWorkoutsCompleted] = useState<number>(0);
  const [workoutPlan, setWorkoutPlan] = useState<IWorkoutCardProps[]>([]);
  const [joinedWorkouts, setJoinedWorkouts] = useState<IWorkoutCardProps[]>([]);
  const [totalCompletedExercises, setTotalCompletedExercises] =
    useState<number>(0);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const response = await getCompletedWorkouts(activeUser.username);
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
  }, [activeWorkout]);

  const renderWorkouts = (duration: number, exercisesLogged: number, workout: string) => {
    return <WorkoutCard duration = {duration} name = {workout} numOfExercises = {exercisesLogged}  />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatisticsHeader
        workouts={workoutsCompleted}
        exercises={totalCompletedExercises}
      />
      <PastWorkoutsHeader
        username={activeUser.username}
        onAddWorkout={function (): void {
          //need to implement this clickable function, should navigate to log page
          throw new Error('Function not implemented.');
        }}
      />
      <FlatList
        data={activeWorkout.previousWorkouts}
        renderItem={({ item }) => renderWorkouts(item.duration, item.exercisesLogged, item.workout)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    marginTop: 10,
  },
  header: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});
