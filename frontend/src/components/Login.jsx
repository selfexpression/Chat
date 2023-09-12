import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import axios from 'axios';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import routes from '../utils/routes.js';
import { useAuth } from '../hooks/index.js';
import image from '../assets/login.jpeg';
import notify from '../utils/notify.js';

const schema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required(),
});

const Login = () => {
  const { t } = useTranslation();
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
      const response = await axios.post(routes.loginPath(), values)
        .catch((error) => {
          switch (error.code) {
            case 'ERR_BAD_REQUEST':
              setErrors({ auth: t('validation.wrongData') });
              break;
            case 'ERR_NETWORK': {
              notify('error', t, 'toast.networkError');
              break;
            }
            default: {
              notify('error', t, 'toast.requestError');
              break;
            }
          }

          return error;
        });

      auth.login(response.data);
      const userId = localStorage.getItem('userId');

      if (!userId) {
        navigate('/login');
        return;
      }

      navigate('/');
      setSubmitting(false);
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
              <Form
                className="col-12 col-md-6 mt-3 mt-md-0"
                onSubmit={formik.handleSubmit}
              >
                <h1 className="text-center mb-4">{t('login.title')}</h1>
                {Object.keys(formik.values).map((field) => (
                  <Form.Group key={field} className="form-floating mb-3">
                    <Form.Control
                      type={field !== 'username' ? 'password' : 'text'}
                      name={field}
                      id={field}
                      className={cn({
                        'form-control': true,
                        'is-invalid': formik.errors.auth ?? '',
                      })}
                      placeholder={t(`login.${field}Label`)}
                      onChange={formik.handleChange}
                      ref={inputRef}
                    />
                    {field === 'confirm' && formik.errors.auth
                      ? (<div className="invalid-tooltip">{formik.errors.auth}</div>)
                      : ''}
                    <label htmlFor={field} className="form-label">{t(`login.${field}Label`)}</label>
                  </Form.Group>
                ))}
                <Button
                  type="submit"
                  variant="outline-primary"
                  className="w-100 mb-3"
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  {t('login.loginButton')}
                </Button>
              </Form>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t('login.noAccount')}</span>
                {' '}
                <a href="/signup">{t('login.signUpLink')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
