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
