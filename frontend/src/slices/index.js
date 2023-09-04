import { configureStore } from '@reduxjs/toolkit';
import dataSlice from './dataSlice';
import messagesSlice from './messagesSlice';

export default configureStore({
  reducer: {
    data: dataSlice,
    messages: messagesSlice,
  },
});
