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
  name?: string;
  date?: Date;
  duration?: number;
  isGenerated?: number;
}

export interface IWorkoutPlan {
  wID: string;
  eID: string;
  sets: number;
  reps: number;
  percentageOfOneRepMax: number;
}

export interface IFeaturedWorkout {
  wId: number;
  duration: number;
  name: string;
  numOfExercies: number;
  image: any;
  type: string;
}

export interface IFeaturedExercises {
  eId: number;
  muscleGroup: string;
  exerciseName: string;
  targetMuscle: string;
  level: string;
  sets: { reps: number; weight: number }[];
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
  eId: number;
  muscleGroup: MuscleGroup;
  exerciseName: string;
  sets: { reps: number; weight: number }[];
}

export interface ExerciseListParams {
  exerciseList?: string; // Adjust the type according to your actual data type
}
