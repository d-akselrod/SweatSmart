import { useState, useEffect } from 'react';
import React from 'react';
import { SafeAreaView, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { PastWorkoutsHeader } from './PastWorkoutsHeader';
import { StatisticsHeader } from './StatisticsHeader';
import { IWorkoutCardProps, WorkoutCard } from './WorkoutCard';
import { getExerciseByEid } from '../../service/ExerciseAPI';
//import { getUserWorkoutByWid } from '../../service/UserWorkoutAPI';
import {
  getCompletedWorkouts,
  getWorkoutByWId,
} from '../../service/WorkoutAPI';
import { getWorkoutPlanByWid } from '../../service/WorkoutPlanAPI';
import { IUser, IWorkout } from '../../typings/types';

export function ProgressPage() {
  const activeUser: IUser = useSelector((state: any) => state.user);
  const activeWorkout: any = useSelector((state: any) => state.workout);

  const [workouts, setWorkouts] = useState<IWorkoutCardProps[]>([]);
  const [workoutsCompleted, setWorkoutsCompleted] = useState<number>(0);
  const [workoutPlan, setWorkoutPlan] = useState<IWorkoutCardProps[]>([]);
  const [totalCompletedExercises, setTotalCompletedExercises] =
    useState<number>(0);

  const renderWorkout = (
    duration: number,
    exercisesLogged: number,
    wId: string,
  ) => {
    return (
      <WorkoutCard
        duration={duration}
        wId={wId}
        numOfExercises={exercisesLogged}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatisticsHeader
        workouts={activeWorkout.previousWorkouts.length}
        exercises={activeWorkout.previousWorkouts.reduce(
          (curr: any, prev: any) => curr + prev.exercisesLogged,
          0,
        )}
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
        renderItem={({ item }) =>
          renderWorkout(item.duration, item.exercisesLogged, item.workout)
        }
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
