import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isShow: false,
  type: null,
};

const slice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    modalControl: (state, { payload }) => {
      const { value, type } = payload;
      state.isShow = value;
      state.type = type;
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
