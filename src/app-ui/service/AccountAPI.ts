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

export const loginAccount = (
    usernameOrEmail: string,
    password: string,
) => {

  const loginBody = {
    Username: usernameOrEmail.includes('@') ? null : usernameOrEmail,
    Email: usernameOrEmail.includes('@') ? usernameOrEmail : null,
    Password: password
  }

  return fetch(`${API_URL}/AccountService/Login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
    body: JSON.stringify(loginBody),
  });
};

