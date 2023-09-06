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
    removeChannel: (state, { payload }) => {
      const { channels } = state;
      const removed = channels.filter((channel) => channel.id !== payload);
      state.channels = removed;
    },
    renameChannel: (state, { payload }) => {
      const { currentId, name } = payload;
      const { channels } = state;
      const current = channels.find((channel) => channel.id === currentId);
      current.name = name;
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
