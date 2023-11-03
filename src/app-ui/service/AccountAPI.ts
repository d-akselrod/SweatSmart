import { API_AUTH, API_URL } from './config';

export const registerAccount = (
  username: string,
  email: string,
  password: string,
) => {
  const userInfo = {
    username,
    email,
    password,
  };

  return fetch(`${API_URL}/AccountService/Register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
    body: JSON.stringify(userInfo),
  });
};
