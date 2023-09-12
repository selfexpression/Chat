import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useAuth } from '../hooks/index.js';

const NavBar = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const userId = localStorage.getItem('userId');

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt=""
            src="./favicon.ico"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          {' '}
          Hexlet Chat
        </Navbar.Brand>
        {userId !== ''
          ? (
            <Button
              type="button"
              className="btn-primary"
              onClick={handleLogout}
            >
              Выйти
            </Button>
          )
          : ''}
      </Container>
    </Navbar>
  );
};

export default NavBar;
