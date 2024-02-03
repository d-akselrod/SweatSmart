import { API_AUTH, API_URL } from './config';
import { IWorkout } from '../typings/types';
export const getWorkouts = (username: string) => {
  return fetch(`${API_URL}/WorkoutService/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
  });
};

export const getCompletedWorkouts = (username: string) => {
  return fetch(`${API_URL}/WorkoutService/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
  });
};


export const postWorkout = (username: string, workout: Object) => {
  return fetch(`${API_URL}/WorkoutService`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
    body: JSON.stringify({ username, workout }),
  });
};

export const getExercisesByMuscleGroup = (muscleGroup: string) => {
  return fetch(`${API_URL}/WorkoutService/MuscleGroup/${muscleGroup}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
  });
};
