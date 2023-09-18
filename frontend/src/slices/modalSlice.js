/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isShow: false,
  type: null,
  currentId: null,
};

const slice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    modalShow: (state, { payload }) => {
      const { type, id } = payload;
      state.type = type;
      state.currentId = id;
      state.isShow = true;
    },
    modalClose: (state) => {
      state.isShow = false;
      state.type = null;
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
