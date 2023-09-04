import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const dataAdapter = createEntityAdapter({
  selectId: (channel) => channel.currentChannelId,
});
const initialState = dataAdapter.getInitialState();

const slice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    addData: dataAdapter.addOne,
  },
});

export const dataSelectors = dataAdapter.getSelectors((state) => state.data);
export const { actions } = slice;
export default slice.reducer;
