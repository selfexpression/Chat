import React from 'react';
import image from '../assets/404.svg';

const NotFound = () => (
  <div className="text-center">
    <img src={image} className="img-fluid h-75" alt="Страница не найдена" />
    <h1 className="h4 text-muted">Страница не найдена</h1>
    <p className="text-muted">
      Но вы можете перейти на&nbsp;
      <a href="/login">
        главную страницу
      </a>
    </p>
  </div>
);

export default NotFound;
