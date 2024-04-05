import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import userReducer from '../redux/slices/userSlice';
import workoutReducer from '../redux/slices/workoutSlice';

const logger = createLogger({
  collapsed: false,
  stateTransformer: state => JSON.stringify(state, null, 2),
  actionTransformer: action => JSON.stringify(action, null, 2),
});

export const debugstore = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
});

export const store = configureStore({
  reducer: {
    user: userReducer,
    workout: workoutReducer,
  },
});
