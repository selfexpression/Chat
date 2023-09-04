import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import store from './slices/index.js';
import { ApiContext } from './contexts/index.js';
import { actions } from './slices/messagesSlice.js';

const runApp = async () => {
  const socket = io();

  socket.on('newMessage', (message) => {
    store.dispatch(actions.addMessage(message));
  });

  const sendMessage = (messageInfo) => {
    socket.emit('newMessage', messageInfo);
  };

  const mountNode = document.getElementById('chat');
  const root = ReactDOM.createRoot(mountNode);

  root.render(
    <Provider store={store}>
      <ApiContext.Provider value={{ sendMessage }}>
        <App />
      </ApiContext.Provider>
    </Provider>,
  );
};

export default runApp;
