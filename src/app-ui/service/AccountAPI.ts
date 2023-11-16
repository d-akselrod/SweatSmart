import { API_AUTH, API_URL } from './config';

export const registerAccount = (
  username: string,
  email: string,
  password: string,
) => {
  const requestBody = {
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
    body: JSON.stringify(requestBody),
  });
};

export const loginAccount = (usernameOrEmail: string, password: string) => {
  const isEmail = usernameOrEmail.includes('@');

  const requestBody = {
    username: isEmail ? null : usernameOrEmail,
    email: isEmail ? usernameOrEmail : null,
    password,
  };

  return fetch(`${API_URL}/AccountService/Login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
    body: JSON.stringify(requestBody),
  });
};
