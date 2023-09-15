import { useTranslation } from 'react-i18next';
import React from 'react';
import image from '../assets/404.svg';
import routes from '../utils/routes.js';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <img src={image} className="img-fluid h-75" alt={t('notFound.title')} />
      <h1 className="h4 text-muted">{t('notFound.title')}</h1>
      <p className="text-muted">
        {t('notFound.message')}
        <a href={routes.loginPagePath()}>
          {t('notFound.link')}
        </a>
      </p>
    </div>
  );
};

export default NotFound;
