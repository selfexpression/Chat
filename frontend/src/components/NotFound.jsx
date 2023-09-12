import { useTranslation } from 'react-i18next';
import React from 'react';
import image from '../assets/404.svg';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <img src={image} className="img-fluid h-75" alt="Страница не найдена" />
      <h1 className="h4 text-muted">{t('notFound.title')}</h1>
      <p className="text-muted">
        {t('notFound.message')}
        <a href="/login">
          {t('notFound.link')}
        </a>
      </p>
    </div>
  );
};

export default NotFound;
