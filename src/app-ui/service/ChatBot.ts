import { API_URL } from './config';
import { IChatMessage } from '../pages/chatbot/ChatBot';

export const sendPrompt = (history: IChatMessage[]) => {
  console.log('http://localhost:5042/ChatBot');
  return fetch('http://localhost:5042/ChatBot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(history),
  });
};
