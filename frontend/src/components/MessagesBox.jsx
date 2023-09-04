import React from 'react';
import { useSelector } from 'react-redux';
import { dataSelectors } from '../slices/dataSlice.js';

const MessagesBox = () => {
  const data = useSelector(dataSelectors.selectAll);
  const messages = data.flatMap((item) => item.messages);

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
