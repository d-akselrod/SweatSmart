import { IWorkoutCategory } from './types';

export const workoutData: IWorkoutCategory[] = [
  {
    image: require('../../app-ui/assets/images/chest.png'),
    imgWidth: 50,
    imgHeight: 50,
    categoryName: 'Chest',
  },
  {
    image: require('../../app-ui/assets/images/back.png'),
    imgWidth: 34,
    imgHeight: 48,
    categoryName: 'Back',
  },
  {
    image: require('../../app-ui/assets/images/biceps.png'),
    imgWidth: 30,
    imgHeight: 65,
    categoryName: 'Biceps',
  },
  {
    image: require('../../app-ui/assets/images/triceps.png'),
    imgWidth: 63,
    imgHeight: 34,
    categoryName: 'Triceps',
  },
  {
    image: require('../../app-ui/assets/images/shoulders.png'),
    imgWidth: 23,
    imgHeight: 64,
    categoryName: 'Shoulders',
  },
  {
    image: require('../../app-ui/assets/images/legs.png'),
    imgWidth: 37,
    imgHeight: 58,
    categoryName: 'Legs',
  },
  {
    image: require('../../app-ui/assets/images/core.png'),
    imgWidth: 68,
    imgHeight: 21,
    categoryName: 'Core',
  },
];
