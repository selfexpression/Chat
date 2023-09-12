import store from '../slices/index.js';
import { actions as dataActions } from '../slices/dataSlice.js';
import { actions as modalActions } from '../slices/modalSlice.js';

export const handleChannel = (id) => () => {
  store.dispatch(dataActions.setChannel(id));
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

export const handleRemove = (id, value) => () => {
  store.dispatch(dataActions.removeChannel(id));
  handleChannel(1)();
  handleClose(value)();
};

export const handleRename = (name, id) => () => {
  store.dispatch(dataActions.renameChannel({ id, name }));
};
