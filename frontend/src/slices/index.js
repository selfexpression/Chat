import { configureStore } from '@reduxjs/toolkit';
import channelsInfoSlice, { actions as channelsInfoActions } from './channelsInfoSlice';
import messagesSlice, { actions as messagesActions } from './messagesSlice';
import modalSlice, { actions as modalActions } from './modalSlice';

export const actions = {
  ...channelsInfoActions,
  ...messagesActions,
  ...modalActions,
};

export default configureStore({
  reducer: {
    channelsInfo: channelsInfoSlice,
    messages: messagesSlice,
    modal: modalSlice,
  },
});
