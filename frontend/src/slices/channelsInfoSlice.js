/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = { channels: [], currentChannelId: null, newId: null };
const defaultChannelId = 1;

const slice = createSlice({
  name: 'channelsInfo',
  initialState,
  reducers: {
    addChannels: (state, { payload }) => {
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
      state.newId = payload.id;
    },
    removeChannel: (state, { payload }) => {
      const { id } = payload;
      const { channels } = state;
      const removed = channels.filter((channel) => channel.id !== id);
      state.channels = removed;

      if (state.currentChannelId === id) {
        state.currentChannelId = defaultChannelId;
      }
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
