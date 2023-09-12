import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import store from './slices/index.js';
import { ApiContext } from './contexts/index.js';
import { actions } from './slices/messagesSlice.js';
import resources from './locales/index.js';

const runApp = async () => {
  const socket = io();

  socket.on('newMessage', (message) => {
    store.dispatch(actions.addMessage(message));
  });

  const sendMessage = (messageInfo) => {
    socket.emit('newMessage', messageInfo);
  };

  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources,
      fallbackLng: 'ru',
      interpolation: {
        escapeValue: false,
      },
    });

  const mountNode = document.getElementById('chat');
  const root = ReactDOM.createRoot(mountNode);

  root.render(
    <Provider store={store}>
      <ApiContext.Provider value={{ sendMessage }}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </ApiContext.Provider>
    </Provider>,
  );
};

export default runApp;
