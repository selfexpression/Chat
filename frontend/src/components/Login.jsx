import React from 'react';
import {
  Formik, Form, Field,
} from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import image from '../assets/login.jpeg';
import routes from '../routes.js';

const schema = Yup.object().shape({
  username: Yup.string()
    .required(),
  password: Yup.string()
    .required(),
});

const LoginForm = () => {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          const response = await axios.post(routes.loginPath(), values);
          const { token } = response.data;
          localStorage.setItem('userId', token);

          const userId = localStorage.getItem('userId');

          if (!userId) {
            navigate('/login');
            return;
          }

          navigate('/');
          setSubmitting(false);
        } catch (error) {
          setErrors({ auth: error.message });
        }
      }}
    >
      {({ errors }) => (
        <Form className="col-12 col-md-6 mt-3 mt-mb-0">
          <h1 className="text-center mb-4">Войти</h1>
          <div className="form-floating mb-3">
            <Field
              type="text"
              name="username"
              id="username"
              className={`form-control ${errors.auth ? 'is-invalid' : ''}`}
              placeholder="Ваш ник"
            />
            <label htmlFor="username" className="form-label">Ваш ник</label>
          </div>
          <div className="form-floating mb-4">
            <Field
              type="password"
              name="password"
              id="password"
              className={`form-control ${errors.auth ? 'is-invalid' : ''}`}
              placeholder="Пароль"
            />
            {errors.auth ? (<div className="invalid-tooltip">{errors.auth}</div>) : null}
            <label htmlFor="password" className="form-label">Пароль</label>
          </div>
          <button type="submit" className="w-100 mb-3 btn btn-outline-primary">Войти</button>
        </Form>
      )}
    </Formik>
  );
};

const Footer = () => (
  <div className="card-footer p-4">
    <div className="text-center">
      <span>Нет аккаунта?&nbsp;</span>
      <a href="/signup">Регистрация</a>
    </div>
  </div>
);

const Login = () => (
  <div className="container-fluid h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-12 col-md-8 col-xxl-6">
        <div className="card shadow-sm">
          <div className="card-body row p-5">
            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
              <img src={image} className="rounded-circle" alt="login" />
            </div>
            <LoginForm />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  </div>
);

export default Login;
