import { API_AUTH, API_URL } from './config';

export const getExerciseByEid = (eid: number) => {
  return fetch(`${API_URL}/Exercise/${eid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
  });
};
