export const getChannelsInfo = (state) => state.channelsInfo;

export const getModal = (state) => state.modal;

export const getLastChannelId = (state) => state
  .channelsInfo
  .channels
  .at(-1);

export const getChannelById = (id) => (state) => state
  .channelsInfo
  .channels
  .find((channel) => channel.id === id);

export const getCurrentChannel = (state) => {
  const { channels, currentChannelId } = state.channelsInfo;
  return channels.find((channel) => channel.id === currentChannelId);
};
