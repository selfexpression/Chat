export const getData = (state) => state.data;

export const getModal = (state) => state.modal;

export const getLastChannelId = (state) => state
  .data
  .channels
  .at(-1);

export const getChannelById = (id) => (state) => state
  .data
  .channels
  .find((channel) => channel.id === id);
