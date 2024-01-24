import { IWorkoutCategory } from './types';

export const workoutData: IWorkoutCategory[] = [
  {
    image: require('../../app-ui/assets/images/chest.png'),
    imgWidth: 50,
    imgHeight: 50,
    categoryName: 'Chest',
    numOfExercises: 12,
  },
  {
    image: require('../../app-ui/assets/images/back.png'),
    imgWidth: 34,
    imgHeight: 48,
    categoryName: 'Back',
    numOfExercises: 15,
  },
  {
    image: require('../../app-ui/assets/images/biceps.png'),
    imgWidth: 30,
    imgHeight: 65,
    categoryName: 'Biceps',
    numOfExercises: 11,
  },
  {
    image: require('../../app-ui/assets/images/triceps.png'),
    imgWidth: 63,
    imgHeight: 34,
    categoryName: 'Triceps',
    numOfExercises: 10,
  },
  {
    image: require('../../app-ui/assets/images/shoulders.png'),
    imgWidth: 23,
    imgHeight: 64,
    categoryName: 'Shoulders',
    numOfExercises: 17,
  },
  {
    image: require('../../app-ui/assets/images/legs.png'),
    imgWidth: 37,
    imgHeight: 58,
    categoryName: 'Legs',
    numOfExercises: 13,
  },
  {
    image: require('../../app-ui/assets/images/core.png'),
    imgWidth: 68,
    imgHeight: 21,
    categoryName: 'Cardio & Core',
    numOfExercises: 20,
  },
];
