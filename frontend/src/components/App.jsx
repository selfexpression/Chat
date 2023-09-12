import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Login.jsx';
import NotFound from './NotFound.jsx';
import ChannelsBox from './ChannelsBox.jsx';
import NavBar from './NavBar.jsx';
import SignUp from './SignUp.jsx';
import { AuthContext } from '../contexts/index.js';

const ContextProvider = ({ children }) => {
  const currentUser = localStorage.getItem('user');
  const [user, setUser] = useState(currentUser ?? null);

  const values = useMemo(() => {
    const login = (data) => {
      localStorage.setItem('user', data.username);
      localStorage.setItem('userId', data.token);
      setUser(currentUser);
    };

    const getAuthHeader = () => {
      const userId = localStorage.getItem('userId');

      if (userId) {
        return { Authorization: `Bearer ${userId}` };
      }

      return {};
    };

    const logout = () => {
      localStorage.setItem('user', '');
      localStorage.setItem('userId', '');
      setUser(null);
    };

    return {
      login, user, getAuthHeader, logout,
    };
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
      <NavBar />
      <Routes>
        <Route path="/" element={<ChannelsBox />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </ContextProvider>
);

export default App;
