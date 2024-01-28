import { API_AUTH, API_URL } from './config';

export const getFilteredUsers = (username: string, filter: string) => {
  return fetch(`${API_URL}/SocialService/Filter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
    body: JSON.stringify({
      username,
      filter,
    }),
  });
};
