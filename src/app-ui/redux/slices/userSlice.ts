import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../typings/types';

type UserState = IUser | null;

const userSlice = createSlice({
  name: 'user',
  initialState: null as UserState,
  reducers: {
    setActiveUser: (state, action: PayloadAction<IUser>) => action.payload,
    logout: () => null,
  },
});

export const { setActiveUser, logout } = userSlice.actions;
export default userSlice.reducer;
