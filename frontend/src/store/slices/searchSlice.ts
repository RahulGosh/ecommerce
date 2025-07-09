// searchSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState = {
  search: '',
  showSearch: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setShowSearch: (state, action) => {
      state.showSearch = action.payload;
    },
  },
});

export const { setSearch, setShowSearch } = searchSlice.actions;
export const selectSearch = (state: RootState) => state.search.search;
export const selectShowSearch = (state: RootState) => state.search.showSearch;

export default searchSlice.reducer;
