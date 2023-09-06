import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isShow: false,
};

const slice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    modalControl: (state, { payload }) => {
      state.isShow = payload;
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
