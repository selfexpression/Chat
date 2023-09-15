/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isShow: false,
  type: null,
};

const slice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    modalSelect: (state, { payload }) => {
      state.type = payload;
    },
    modalShow: (state) => {
      state.isShow = true;
    },
    modalClose: (state) => {
      state.isShow = false;
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
