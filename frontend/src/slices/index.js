import { configureStore } from '@reduxjs/toolkit';
import dataSlice from './dataSlice';
import messagesSlice from './messagesSlice';
import modalSlice from './modalSlice';

export default configureStore({
  reducer: {
    data: dataSlice,
    messages: messagesSlice,
    modal: modalSlice,
  },
});
