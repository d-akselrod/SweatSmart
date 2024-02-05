import { API_AUTH, API_URL } from './config';

export const getUserWorkoutByWid = (wid: string) => {
  return fetch(`${API_URL}/UserWorkoutController/${wid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
  });
};
