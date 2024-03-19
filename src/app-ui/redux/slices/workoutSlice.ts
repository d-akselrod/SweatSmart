import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {IExercise, IWorkout } from '../../typings/types';

interface LogType{
  exercise: string,
  isLoggedList: boolean[]
}
interface WorkoutState {
  workout: IWorkout | null;
  loggedExercises: { [key: string]: boolean[] }; // Changed to object
}

const initialState: WorkoutState = {
  workout: null,
  loggedExercises: {},
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    start: (state, action: PayloadAction<IWorkout>) => {
      state.workout = action.payload;
      state.loggedExercises = {}; // Reset logged exercises when starting a new workout
    },
    end: (state)=> {
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

export const { start, end, addLoggedExercise } = workoutSlice.actions;
export default workoutSlice.reducer;
