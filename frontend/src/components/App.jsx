import React, { useState } from 'react';
import {
  BrowserRouter as Router, Routes, Route, Navigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoginForm from './Login.jsx';
import NotFound from './NotFound.jsx';
import Channels from './Channels.jsx';
import NavBar from './NavBar.jsx';
import SignUp from './SignUp.jsx';
import { AuthContext } from '../contexts/index.js';
import { useAuth } from '../hooks/index.js';
import routes from '../utils/routes.js';

const AuthContextProvider = ({ children }) => {
  const currentUser = localStorage.getItem('user');
  const [user, setUser] = useState(currentUser ?? '');

  const login = (data) => {
    localStorage.setItem('user', data.username);
    localStorage.setItem('userId', data.token);
    setUser(data.username);
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

  return (
    <AuthContext.Provider value={{
      login, logout, getAuthHeader, user,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const AuthRoute = ({ children }) => {
  const auth = useAuth();

  return !auth.user
    ? <Navigate to={routes.loginPagePath()} />
    : children;
};

const App = () => (
  <AuthContextProvider>
    <Router>
      <div className="d-flex flex-column h-100">
        <NavBar />
        <Routes>
          <Route path={routes.chatPagePath()} element={<AuthRoute><Channels /></AuthRoute>} />
          <Route path={routes.loginPagePath()} element={<LoginForm />} />
          <Route path={routes.signupPagePath()} element={<SignUp />} />
          <Route path={routes.badPagePath()} element={<NotFound />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  </AuthContextProvider>
);

export default App;
