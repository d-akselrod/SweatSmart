import { API_AUTH, API_URL } from './config';

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
  return fetch(`${API_URL}/WorkoutService/CompletedWorkouts/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
  });
};

export const postWorkout = (username: string, workout: Object) => {
  return fetch(`${API_URL}/WorkoutService/CreateWorkout`, {
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

export const getAllExercises = () => {
  return fetch(`${API_URL}/Exercise`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
  });
};

export const getExercisesByWId = (wId: string) => {
  return fetch(`${API_URL}/WorkoutService/GetExercises/${wId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
  });
};

export const postExercises = (exerciseIdList: number[], workoutId: string) => {
  return fetch(`${API_URL}/WorkoutPlan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
    body: JSON.stringify({ workoutId, exerciseIdList }),
  });
};

export const generateWorkout = (username: string, workoutType: number) => {
  const requestBody = {
    username,
    workoutType,
  };

  console.log(requestBody);

  return fetch(`${API_URL}/WorkoutPlannerService/GenerateWorkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
    body: JSON.stringify(requestBody),
  });
};

export const completeWorkout = (username: string, wId: string) => {
  return fetch(
    `${API_URL}/WorkoutService/CompleteWorkout?username=${username}&wId=${wId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_AUTH,
      },
    },
  );
};
