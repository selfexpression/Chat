/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isShow: false,
  type: null,
  currentlId: null,
};

const slice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    modalControl: (state, { payload }) => {
      const { value, type, currentId } = payload;
      state.isShow = value;
      state.type = type;
      state.currentId = currentId;
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
