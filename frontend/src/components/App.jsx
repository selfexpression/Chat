import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './Login.jsx';
import NotFound from './NotFound.jsx';
import Chat from './Chat.jsx';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Chat />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
