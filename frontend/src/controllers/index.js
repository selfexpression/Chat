import store from '../slices/index.js';
import { actions as channelsInfoActions } from '../slices/channelsInfoSlice.js';
import { actions as modalActions } from '../slices/modalSlice.js';

export const handleChannel = (id) => () => {
  store.dispatch(channelsInfoActions.setChannel(id));
};

export const handleShow = (type, value) => () => {
  store.dispatch(modalActions.modalControl({ value: !value, type }));
};

export const handleCurrentModal = (type, value, id) => () => {
  store.dispatch(modalActions.modalControl({ value: !value, type, currentId: id }));
};

export const handleClose = (value) => () => {
  store.dispatch(modalActions.modalControl(!value));
};

export const handleLoadingData = (data) => {
  store.dispatch(channelsInfoActions.addChannels(data));
};
