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

export const getFriends = (username: string) => {
  return fetch(`${API_URL}/SocialService/Friends?username=${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
  });
};

export const getFriendshipState = (
  username: string,
  friendUsername: string,
) => {
  return fetch(
    `${API_URL}/SocialService/FriendshipState?friend1=${username}&friend2=${friendUsername}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_AUTH,
      },
    },
  );
};

export const sendFriendRequest = (originFriend: string, newFriend: string) => {
  return fetch(
    `${API_URL}/SocialService/SendRequest?originFriend=${originFriend}&newFriend=${newFriend}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_AUTH,
      },
    },
  );
};

export const acceptFriendRequest = (
  originFriend: string,
  newFriend: string,
) => {
  return fetch(
    `${API_URL}/SocialService/AcceptRequest?originFriend=${originFriend}&newFriend=${newFriend}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_AUTH,
      },
    },
  );
};

export const getRecentActivity = (username: string) => {
  return fetch(`${API_URL}/SocialService/RecentActivity?username=${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
  });
};
