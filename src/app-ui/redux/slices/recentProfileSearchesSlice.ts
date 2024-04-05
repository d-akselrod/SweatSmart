import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProfile } from '../../typings/types';

type RecentProfileSearches = IProfile[];

const recentProfileSearches = createSlice({
  name: 'recentProfileSearches',
  initialState: [] as RecentProfileSearches,
  reducers: {
    setRecentSearches: (state, action: PayloadAction<IProfile[]>) =>
      action.payload,
    clear: () => [],
  },
});

export const { setRecentSearches, clear } = recentProfileSearches.actions;
export default recentProfileSearches.reducer;
