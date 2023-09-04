import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Login.jsx';
import NotFound from './NotFound.jsx';
import Channels from './Channels.jsx';
import { AuthContext } from '../contexts/index.js';

const ContextProvider = ({ children }) => {
  const currentUser = localStorage.getItem('user');
  const [user, setUser] = useState(currentUser ?? null);

  const login = (data) => {
    localStorage.setItem('user', data.username);
    setUser(currentUser);
  };

  return (
    <AuthContext.Provider value={{ login, user }}>
      {children}
    </AuthContext.Provider>
  );
};

const App = () => (
  <ContextProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Channels />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </ContextProvider>
);

export default App;
