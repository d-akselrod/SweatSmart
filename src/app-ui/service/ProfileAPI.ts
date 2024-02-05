import { API_AUTH, API_URL } from './config';

export const setPreferences = (username: string, userPreferences: Object) => {
  return fetch(
    `${API_URL}/ProfileService/UserPreferences?username=${username}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_AUTH,
      },
      body: JSON.stringify(userPreferences),
    },
  );
};