import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import store, { actions } from './slices/index.js';
import { ApiContext } from './contexts/index.js';
import resources from './locales/index.js';

const runApp = async () => {
  const socket = io();

  const socketAPI = {
    sendMessage: (payload) => socket.emit('newMessage', payload),
    removeChannel: (id) => socket.emit('removeChannel', { id }),
    addChannel: (name) => socket.emit('newChannel', { name }),
    renameChannel: (id, name) => socket.emit('renameChannel', { id, name }),
  };

  socket.on('newMessage', (payload) => {
    store.dispatch(actions.addMessage(payload));
  });

  socket.on('removeChannel', (payload) => {
    store.dispatch(actions.removeChannel(payload));
  });

  socket.on('newChannel', (payload) => {
    store.dispatch(actions.addChannel(payload));
  });

  socket.on('renameChannel', (payload) => {
    store.dispatch(actions.renameChannel(payload));
  });

  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    // .use(LanguageDetector)
    .init({
      resources,
      fallbackLng: 'ru',
      interpolation: {
        escapeValue: false,
      },
    });

  const rollbarConfig = {
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
  };

  const mountNode = document.getElementById('chat');
  const root = ReactDOM.createRoot(mountNode);

  root.render(
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <ApiContext.Provider value={socketAPI}>
            <I18nextProvider i18n={i18n}>
              <App />
            </I18nextProvider>
          </ApiContext.Provider>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>,
  );
};

export default runApp;
