import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IWorkout } from '../../typings/types';

type WorkoutState = IWorkout | null;

const workoutSlice = createSlice({
  name: 'workout',
  initialState: null as WorkoutState,
  reducers: {
    start: (state, action: PayloadAction<IWorkout>) => action.payload,
    end: () => null,
  },
});

export const { start, end } = workoutSlice.actions;
export default workoutSlice.reducer;
