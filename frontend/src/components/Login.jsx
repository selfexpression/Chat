import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import routes from '../routes.js';
import { useAuth } from '../hooks/index.js';
import image from '../assets/login.jpeg';

const schema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required(),
});

const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axios.post(routes.loginPath(), values);
        const userId = localStorage.getItem('userId');
        auth.login(response.data);

        if (!userId) {
          navigate('/login');
          return;
        }

        navigate('/');
        setSubmitting(false);
      } catch (error) {
        setErrors({ auth: error.message });
      }
    },
  });

  return (
    <div className="container-fluid h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src={image} className="rounded-circle" alt="login" />
              </div>
              <Form className="col-12 col-md-6 mt-3 mt-md-0" onSubmit={formik.handleSubmit}>
                <h1 className="text-center mb-4">Войти</h1>
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    type="text"
                    name="username"
                    id="username"
                    className={`form-control ${formik.errors.auth ? 'is-invalid' : ''}`}
                    placeholder="Ваш ник"
                    onChange={formik.handleChange}
                    ref={inputRef}
                  />
                  <label htmlFor="username" className="form-label">Ваш ник</label>
                </Form.Group>
                <Form.Group className="form-floating mb-4">
                  <Form.Control
                    type="password"
                    name="password"
                    id="password"
                    className={`form-control ${formik.errors.auth ? 'is-invalid' : ''}`}
                    placeholder="Пароль"
                    onChange={formik.handleChange}
                  />
                  {formik.errors.auth ? (<div className="invalid-tooltip">{formik.errors.auth}</div>) : null}
                  <label htmlFor="password" className="form-label">Пароль</label>
                </Form.Group>
                <Button
                  type="submit"
                  variant="outline-primary"
                  className="w-100 mb-3"
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  Войти
                </Button>
              </Form>
              <div className="card-footer p-4">
                <div className="text-center">
                  <span>Нет аккаунта?&nbsp;</span>
                  <a href="/signup">Регистрация</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
