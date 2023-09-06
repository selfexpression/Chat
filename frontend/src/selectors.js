export const getData = (state) => state.data;

export const getModal = (state) => state.modal;

export const getLastChannelId = (state) => state
  .data
  .channels
  .at(-1);
