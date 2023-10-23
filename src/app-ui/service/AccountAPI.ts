import { API_URL, API_AUTH } from './config';

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
    },
    body: JSON.stringify(userInfo),
  });
};
