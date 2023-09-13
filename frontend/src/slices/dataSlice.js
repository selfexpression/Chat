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
      state.currentChannelId = payload.id;
    },
    removeChannel: (state, { payload }) => {
      const { id } = payload;
      const { channels } = state;
      const removed = channels.filter((channel) => channel.id !== id);
      state.channels = removed;
      state.currentChannelId = 1;
    },
    renameChannel: (state, { payload }) => {
      const { id, name } = payload;
      const { channels } = state;
      const current = channels.find((channel) => channel.id === id);
      current.name = name;
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
