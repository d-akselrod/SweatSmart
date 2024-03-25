import { API_AUTH, API_URL } from './config';

export const getWorkoutPlanByWid = (wid: string) => {
  return fetch(`${API_URL}/WorkoutPlan/${wid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
  });
};

export const addSetToExercise = (wId: string, eId: number, reps: number, weight: number) => {
  console.log(wId, eId, reps, weight)
  return fetch(`${API_URL}/WorkoutService/AddSet?wId=${wId}&eId=${eId}&reps=${reps}&weight=${weight}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
  });
}

export const updateSetOfExercise = (wId: string, eId: number, setNum: number, reps: number, weight: number) => {
  console.log(wId, eId, setNum, reps, weight)
  return fetch(`${API_URL}/WorkoutService/UpdateSet?wId=${wId}&eId=${eId}&setNum=${setNum}&newReps=${reps}&newWeight=${weight}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
  });
}

export const deleteSetFromExercise = (wId: string, eId: number, setNum: number) => {
  return fetch(`${API_URL}/WorkoutService/DeleteSet?wId=${wId}&eId=${eId}&setNum=${setNum}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
  });
}
