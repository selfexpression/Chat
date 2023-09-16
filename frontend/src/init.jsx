import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { Provider } from 'react-redux';
import filter from 'leo-profanity';
import App from './components/App.jsx';
import store, { actions } from './slices/index.js';
import { ApiContext } from './contexts/index.js';
import resources from './locales/index.js';

const runApp = async () => {
  const socket = io();

  const socketAPI = {
    sendMessage: (payload) => new Promise((resolve, reject) => {
      socket.emit('newMessage', payload, (response, error) => {
        if (response.status === 'ok') {
          resolve(response.data);
        }

        reject(error);
      });
    }),
    removeChannel: (id) => new Promise((resolve, reject) => {
      socket.emit('removeChannel', { id }, (response, error) => {
        if (response.status === 'ok') {
          resolve(response.data);
        }

        reject(error);
      });
    }),
    createChannel: ({ name, owner }) => new Promise((resolve, reject) => {
      socket.emit('newChannel', { name, owner }, (response, error) => {
        if (response.status === 'ok') {
          resolve(response.data);
        }

        reject(error);
      });
    }),
    renameChannel: (id, name) => new Promise((resolve, reject) => {
      socket.emit('renameChannel', { id, name }, (response, error) => {
        if (response.status === 'ok') {
          resolve(response.data);
        }

        reject(error);
      });
    }),
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

  filter.add(filter.getDictionary('en'));
  filter.add(filter.getDictionary('fr'));
  filter.add(filter.getDictionary('ru'));

  const rollbarConfig = {
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    enabled: process.env.NODE_ENV === 'production',
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
