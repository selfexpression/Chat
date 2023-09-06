import React from 'react';
import { useSelector } from 'react-redux';
import { messagesSelectors } from '../slices/messagesSlice.js';

const Messages = () => {
  const messages = useSelector(messagesSelectors.selectAll);
  const { currentChannelId } = useSelector((state) => state.data);
  const current = messages.filter((message) => message.channelId === currentChannelId);

  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5 ">
      {current.map(({ body, id, username }) => (
        <div key={id} className="text-break mb-2">
          <b>{username}</b>
          {': '}
          {body}
        </div>
      ))}
    </div>
  );
};

export default Messages;
