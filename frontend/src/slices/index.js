import { configureStore } from '@reduxjs/toolkit';
import dataSlice, { actions as dataActions } from './dataSlice';
import messagesSlice, { actions as messagesActions } from './messagesSlice';
import modalSlice, { actions as modalActions } from './modalSlice';

export const actions = {
  ...dataActions,
  ...messagesActions,
  ...modalActions,
};

export default configureStore({
  reducer: {
    data: dataSlice,
    messages: messagesSlice,
    modal: modalSlice,
  },
});
