import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const slice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
  },
});

export const messagesSelectors = messagesAdapter.getSelectors((state) => state.messages);
export const { actions } = slice;
export default slice.reducer;
