import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Login.jsx';
import NotFound from './NotFound.jsx';
import Channels from './ChannelsBox.jsx';
import { AuthContext } from '../contexts/index.js';

const ContextProvider = ({ children }) => {
  const currentUser = localStorage.getItem('user');
  const [user, setUser] = useState(currentUser ?? null);

  const values = useMemo(() => {
    const login = (data) => {
      localStorage.setItem('user', data.username);
      setUser(currentUser);
    };

    const getAuthHeader = () => {
      const userId = localStorage.getItem('userId');

      if (userId) {
        return { Authorization: `Bearer ${userId}` };
      }

      return {};
    };

    return { login, user, getAuthHeader };
  }, [currentUser, user]);

  return (
    <AuthContext.Provider value={values}>
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
