import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.jsx';

const runApp = () => {
  const mountNode = document.getElementById('chat');
  const root = ReactDOM.createRoot(mountNode);
  root.render(<App />);
};

export default runApp;
