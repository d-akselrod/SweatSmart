import {MuscleGroup } from './WorkoutEnums';
export interface IProfile {
  uId: string;
  firstName?: string;
  lastName?: string;
  username: string;
}

export interface IUser extends IProfile {
  email: string;
  password: string;
}

export interface IWorkoutCategory {
  image: any;
  imgWidth: number;
  imgHeight: number;
  categoryName: string;
}

export interface IWorkout {
  wId: string;
  name: string;
  date: Date;
  duration?: number;
  numOfExercises?: number;
}

export interface IFeaturedWorkout {
  duration: number;
  name: string;
  numOfExercies: number;
  image: any;
  type: string;
}

export interface IExercise {
  eId: string;
  muscleGroup: MuscleGroup;
  TargetMuscle: string;
  name: string;
}
