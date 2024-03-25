import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IExercise, IWorkout } from '../../typings/types';

interface LogType {
  exercise: string;
  isLoggedList: boolean[];
}

interface PreviousWorkouts{
  workout: IWorkout | null;
  duration: number
}
interface WorkoutState {
  workout: IWorkout | null;
  loggedExercises: { [key: string]: boolean[] }; // Changed to object
  previousWorkouts: {workout: IWorkout | null, exercisesLogged: number, duration: number}[]
}

const initialState: WorkoutState = {
  workout: null,
  loggedExercises: {},
  previousWorkouts: []
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    start: (state, action: PayloadAction<IWorkout>) => {
      state.workout = action.payload;
      state.loggedExercises = {}; // Reset logged exercises when starting a new workout
    },
    end: state => {
      state.workout = null;
      state.loggedExercises = {}; // Reset logged exercises when starting a new workout
    },
    recordWorkout: (state, action: PayloadAction<PreviousWorkouts>) => {
      const {workout, duration} = action.payload
      state.previousWorkouts.push({workout: workout, exercisesLogged: Object.keys(state.loggedExercises).length, duration: duration})
      state.workout = null;
      state.loggedExercises = {}; // Reset logged exercises when starting a new workout
    },
    addLoggedExercise: (state, action: PayloadAction<LogType>) => {
      const { exercise, isLoggedList } = action.payload;
      // Update logged exercises object
      state.loggedExercises[exercise] = isLoggedList;
    },
  },
});

export const { start, end, addLoggedExercise, recordWorkout } = workoutSlice.actions;
export default workoutSlice.reducer;
