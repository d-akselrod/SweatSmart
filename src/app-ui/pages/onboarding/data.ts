export interface IOnboardingSections {
  id: number;
  title: string;
  description: string;
  image: string;
}

export const data: IOnboardingSections[] = [
  {
    id: 1,
    title: 'SweatSmart',
    description: 'Get fit the smart, easy way ',
    image: require('../../assets/images/Logo.png'),
  },

  {
    id: 2,
    title: 'AI Workout Generator',
    description:
      'Create customized workouts tailored to your fitness level, goals, and preferences',
    image: require('../../assets/images/AI.png'),
  },

  {
    id: 3,
    title: 'Easy Progress Tracking',
    description:
      'Monitor your performance, see your improvements, and stay motivated',
    image: require('../../assets/images/Progress.png'),
  },

  {
    id: 4,
    title: 'Meet FitBot',
    description:
      'Say hello to your virtual fitness coach! Get guidance, motivation, and expert tips to ensure you stay on track with your fitness goals',
    image: require('../../assets/images/Chatbot.png'),
  },
];
