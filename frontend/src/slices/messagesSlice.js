/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { actions as channelsInfoActions } from './channelsInfoSlice';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const slice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    removeMessages: messagesAdapter.removeMany,
  },
  extraReducers: (builder) => {
    builder.addCase(channelsInfoActions.removeChannel, (state, action) => {
      const { payload: channelId } = action;
      const allMessages = Object.values(state.entities);
      const currentMessagesIds = allMessages
        .filter((message) => message.channelId === channelId)
        .map(({ id }) => id);

      messagesAdapter.removeMany(state, currentMessagesIds);
    });
  },
});

export const messagesSelectors = messagesAdapter.getSelectors((state) => state.messages);
export const { actions } = slice;
export default slice.reducer;
