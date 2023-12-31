import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Navbar, Container, Button, NavDropdown,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/index.js';
import routes from '../utils/routes.js';

const NavBar = () => {
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate(routes.loginPagePath());
  };

  const handleLangSwitch = () => {
    const { language } = i18n;
    const lang = (language === 'en' ? 'ru' : 'en');
    i18n.changeLanguage(lang);
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <div className="d-flex align-items-center">
          <div className="mr-2">
            <NavDropdown title={t('lang.currentLang')} className="mx-2">
              <NavDropdown.Item
                onClick={handleLangSwitch}
              >
                {t('lang.changeLang')}
              </NavDropdown.Item>
            </NavDropdown>
          </div>
          <div className="mr-2" />
          <Navbar.Brand
            href={!auth.user
              ? routes.loginPagePath()
              : routes.chatPagePath()}
            className="mx-2"
          >
            <img
              alt={t('navBar.logoAlt')}
              src="./favicon.ico"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            {' '}
            {t('navBar.logoText')}
          </Navbar.Brand>
        </div>
        {!auth.user
          ? ''
          : (
            <Button
              type="button"
              className="btn-info"
              onClick={handleLogout}
            >
              {t('navBar.logoutButton')}
            </Button>
          )}
      </Container>
    </Navbar>
  );
};

export default NavBar;
