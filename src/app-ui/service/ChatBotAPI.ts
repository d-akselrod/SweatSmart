import { IChatMessage } from '../pages/chatbot/types';
import { API_URL } from './config';

export const sendPrompt = (history: IChatMessage[]) => {
  return fetch(`${API_URL}/ChatBot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(history),
  });
};
