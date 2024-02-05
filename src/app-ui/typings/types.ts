import { MuscleGroup } from './WorkoutEnums';
export interface IProfile {
  uId: string;
  name?: string;
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
  duration: number;
}

export interface IWorkoutPlan {
  wID: string;
  eID: string;
  sets: number;
  reps: number;
  percentageOfOneRepMax: number;
}

export interface IFeaturedWorkout {
  duration: number;
  name: string;
  numOfExercies: number;
  image: any;
  type: string;
}

export interface IExercise {
  eId: number;
  muscleGroup: MuscleGroup;
  targetMuscle: string;
  name: string;
  level: string;
  equipment: string;
}

export interface IWorkoutExercise {
  exerciseId: number;
  muscleGroup: MuscleGroup;
  exerciseName: string;
  sets: number;
  reps: number;
}

export interface ExerciseListParams {
  exerciseList?: string; // Adjust the type according to your actual data type
}
