import { createSlice } from '@reduxjs/toolkit';

const initialState = { channels: [], currentChannelId: null };

const slice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    addData: (state, { payload }) => {
      const { channels, currentChannelId } = payload;
      state.channels = channels;
      state.currentChannelId = currentChannelId;
    },
    setChannel: (state, { payload }) => {
      state.currentChannelId = payload;
    },
    addChannel: (state, { payload }) => {
      state.channels = [...state.channels, payload];
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
