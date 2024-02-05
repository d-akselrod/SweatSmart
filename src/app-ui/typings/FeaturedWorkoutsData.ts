import { IFeaturedWorkout } from './types';
export const featuredWorkouts: IFeaturedWorkout[] = [
  {
    name: 'Body Building',
    type: 'Full Body Workout',
    duration: 30,
    numOfExercies: 5,
    image: require('../assets/images/fullbody.jpg'),
  },
  {
    name: 'Six-Pack Heat',
    type: 'Full Body Workout',
    duration: 60,
    numOfExercies: 8,
    image: require('../assets/images/abs.png'),
  },
  {
    name: 'High Intensity',
    type: 'Cario Workout',
    duration: 70,
    numOfExercies: 8,
    image: require('../assets/images/cardio.jpg'),
  },
];
