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
