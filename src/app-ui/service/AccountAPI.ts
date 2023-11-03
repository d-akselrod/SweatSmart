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

  console.log(`${API_URL}/AccountService/Register`);
  console.log(API_AUTH);

  return fetch(
    `https://sweatsmart-service.azurewebsites.net/AccountService/Register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_AUTH,
      },
      body: JSON.stringify(userInfo),
    },
  );
};
