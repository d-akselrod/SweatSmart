import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { PastWorkoutsHeader } from './PastWorkoutsHeader';
import { StatisticsHeader } from './StatisticsHeader';
import { IWorkoutCardProps, WorkoutCard } from './WorkoutCard';
import { getExerciseByEid } from '../../service/ExerciseAPI';
//import { getUserWorkoutByWid } from '../../service/UserWorkoutAPI';
import { getCompletedWorkouts } from '../../service/WorkoutAPI';
import { getWorkoutPlanByWid } from '../../service/WorkoutPlanAPI';
import { IUser } from '../../typings/types';
import React from 'react';

export function ProgressPage() {
  const activeUser: IUser = useSelector((state: any) => state.user);
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
          console.log('Workouts data:', data.body);
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
      const loadWorkoutPlans = async () => {
        try {
          const plansPromises = workouts.map(async workout => {
            const response = await getWorkoutPlanByWid(workout.wId);
            if (response.ok) {
              const data = await response.json();
              console.log(`Workout plan for ${workout.wId}:`, data.body);
              return data.body;
            } else {
              console.error(`Full response:`, response.status);
              return null;
            }
          });

          const plans = await Promise.all(plansPromises);
          console.log('All workout plans:', plans);
          setWorkoutPlan(plans.filter(plan => plan !== null));
        } catch (error) {
          console.error('Error while loading workout plans:', error);
        }
      };

      loadWorkoutPlans();
    }
  }, [workouts]);

  useEffect(() => {
    if (workouts && workoutPlan) {
      const flatWorkoutPlan = workoutPlan.flat();

      const joinedDataPromises = workouts.map(async workout => {
        const correspondingPlans = flatWorkoutPlan.filter(
          plan => plan.wId === workout.wId,
        );

        const exerciseNames = await Promise.all(
          correspondingPlans.map(async plan => {
            const response = await getExerciseByEid(plan.eId);
            const exercise = await response.json();
            return exercise.name;
          }),
        );

        return {
          wId: workout.wId,
          date: new Date(workout.date),
          duration: workout.duration / 60,
          name: workout.name,
          exercises: exerciseNames,
          sets: correspondingPlans.flatMap(plan => plan.sets),
          reps: correspondingPlans.flatMap(plan => plan.reps),
          percentageOfOneRepMax: correspondingPlans.flatMap(
            plan => plan.percentageOfOneRepMax,
          ),
        };
        
      });

      Promise.all(joinedDataPromises).then(joinedData => {
        console.log('Joined Date:', joinedData);
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
      });
    } else {
      setJoinedWorkouts([]);
      setWorkoutsCompleted(0);
      setTotalCompletedExercises(0);
    }
  }, [workouts, workoutPlan]);

  <FlatList
    data={joinedWorkouts}
    renderItem={({ item }) => renderWorkouts(item)}
  />;

  const renderWorkouts = (item: IWorkoutCardProps) => {
    return <WorkoutCard {...item} />;
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
        data={joinedWorkouts}
        renderItem={({ item }) => renderWorkouts(item)}
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
