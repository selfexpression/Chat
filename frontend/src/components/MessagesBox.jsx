import React from 'react';
import { useSelector } from 'react-redux';
import { messagesSelectors } from '../slices/messagesSlice.js';

const MessagesBox = () => {
  const messages = useSelector(messagesSelectors.selectAll);

  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5 ">
      {messages.map(({ body, id, username }) => (
        <div key={id} className="text-break mb-2">
          <b>{username}</b>
          {': '}
          {body}
        </div>
      ))}
    </div>
  );
};

export default MessagesBox;
