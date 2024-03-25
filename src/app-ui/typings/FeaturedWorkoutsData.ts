import {IFeaturedExercises, IFeaturedWorkout } from './types';
export const featuredWorkouts: IFeaturedWorkout[] = [
  {
    wId: 1,
    name: 'Six-Pack Heat',
    type: 'Full Body Workout',
    duration: 30,
    numOfExercies: 4,
    image: require('../assets/images/abs.png'),
  },
  {
    wId: 2,
    name: 'Body Building',
    type: 'Full Body Workout',
    duration: 30,
    numOfExercies: 4,
    image: require('../assets/images/fullbody.jpg'),
  },
  {
    wId: 3,
    name: 'High Intensity',
    type: 'Cario Workout',
    duration: 60,
    numOfExercies: 4,
    image: require('../assets/images/cardio.jpg'),
  },
];

export const featuredExercises: IFeaturedExercises[][] = [
  [
    {
      eId: 23,
      muscleGroup: "Core",
      exerciseName: "Crunch",
      targetMuscle: "Upper",
      level: "B",
      sets: [
        {reps: 15, weight: 5}, {reps: 20, weight: 5}, {reps: 10, weight: 10}
      ]
    },
    {
      eId: 26,
      muscleGroup: "Core",
      exerciseName: "Heel Touch",
      targetMuscle: "Upper",
      level: "B",
      sets: [
        {reps: 20, weight: 0}, {reps: 15, weight: 0}, {reps: 10, weight: 0}
      ]
    },
    {
      eId: 3,
      muscleGroup: "Core",
      exerciseName: "Lying Hip Thrust",
      targetMuscle: "Lower",
      level: "A",
      sets: [
        {reps: 15, weight: 0}, {reps: 20, weight: 0}, {reps: 10, weight: 0}
      ]
    },
    {
      eId: 8,
      muscleGroup: "Core",
      exerciseName: "Decline Cross Sit-Up",
      targetMuscle: "Obliques",
      level: "A",
      sets: [
        {reps: 15, weight: 5}, {reps: 20, weight: 5}, {reps: 10, weight: 10}
      ]
    },
  ],
  [
    {
      eId: 48,
      muscleGroup: "Biceps",
      exerciseName: "Barbell Curl",
      targetMuscle: "Biceps",
      level: "B",
      sets: [
        {reps: 15, weight: 5}, {reps: 20, weight: 5}, {reps: 10, weight: 10}
      ]
    },
    {
      eId: 86,
      muscleGroup: "Chest",
      exerciseName: "Chest Press",
      targetMuscle: "Pectoralis",
      level: "B",
      sets: [
        {reps: 20, weight: 0}, {reps: 15, weight: 0}, {reps: 10, weight: 0}
      ]
    },
    {
      eId: 169,
      muscleGroup: "Shoulders",
      exerciseName: "Barbell Shoulder Press",
      targetMuscle: "Delts/Traps",
      level: "A",
      sets: [
        {reps: 15, weight: 0}, {reps: 20, weight: 0}, {reps: 10, weight: 0}
      ]
    },
    {
      eId: 8,
      muscleGroup: "Core",
      exerciseName: "Decline Cross Sit-Up",
      targetMuscle: "Obliques",
      level: "A",
      sets: [
        {reps: 15, weight: 5}, {reps: 20, weight: 5}, {reps: 10, weight: 10}
      ]
    },
  ],
  [
    {
      eId: 23,
      muscleGroup: "Core",
      exerciseName: "Crunch",
      targetMuscle: "Upper",
      level: "B",
      sets: [
        {reps: 15, weight: 5}, {reps: 20, weight: 5}, {reps: 10, weight: 10}
      ]
    },
    {
      eId: 26,
      muscleGroup: "Core",
      exerciseName: "Heel Touch",
      targetMuscle: "Upper",
      level: "B",
      sets: [
        {reps: 20, weight: 0}, {reps: 15, weight: 0}, {reps: 10, weight: 0}
      ]
    },
    {
      eId: 3,
      muscleGroup: "Core",
      exerciseName: "Lying Hip Thrust",
      targetMuscle: "Lower",
      level: "A",
      sets: [
        {reps: 15, weight: 0}, {reps: 20, weight: 0}, {reps: 10, weight: 0}
      ]
    },
    {
      eId: 8,
      muscleGroup: "Core",
      exerciseName: "Decline Cross Sit-Up",
      targetMuscle: "Obliques",
      level: "A",
      sets: [
        {reps: 15, weight: 5}, {reps: 20, weight: 5}, {reps: 10, weight: 10}
      ]
    },
  ]
]
