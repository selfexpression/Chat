import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import routes from '../routes.js';
import { useAuth } from '../hooks/index.js';
import image from '../assets/signup.jpg';

const SignUp = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const schema = Yup.object().shape({
    username: Yup
      .string()
      .required(t('validation.required'))
      .min(3, t('validation.usernameMinLength'))
      .max(20),
    password: Yup
      .string()
      .required(t('validation.required'))
      .min(6, t('validation.passwordMinLength')),
    confirm: Yup
      .string()
      .required(t('validation.required'))
      .oneOf([Yup.ref('password')], t('validation.confirmPasswordMatch')),
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirm: '',
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axios.post(routes.signupPath(), values);
        auth.login(response.data);
        navigate('/');
        setSubmitting(false);
      } catch (error) {
        if (error.response.status === 409) {
          setErrors({ userExists: t('validation.userExists') });
          return;
        }

        throw error;
      }
    },
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img src={image} className="rounded-circle" alt="signup" />
              </div>
              <Form className="col-12 col-md-6 mt-3 mt-md-0" onSubmit={formik.handleSubmit}>
                <h1 className="text-center mb-4">{t('signUp.title')}</h1>
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    type="text"
                    name="username"
                    id="username"
                    className={`form-control ${formik.errors.username || formik.errors.userExists ? 'is-invalid' : ''}`}
                    placeholder={t('signUp.usernameLabel')}
                    onChange={formik.handleChange}
                    ref={inputRef}
                  />
                  {formik.errors.username ? (<div className="invalid-tooltip">{formik.errors.username}</div>) : ''}
                  <label htmlFor="username" className="form-label">{t('signUp.usernameLabel')}</label>
                </Form.Group>
                <Form.Group className="form-floating mb-4">
                  <Form.Control
                    type="password"
                    name="password"
                    id="password"
                    className={`form-control ${formik.errors.password || formik.errors.userExists ? 'is-invalid' : ''}`}
                    placeholder={t('signUp.passwordLabel')}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.password ? (<div className="invalid-tooltip">{formik.errors.password}</div>) : ''}
                  <label htmlFor="password" className="form-label">{t('signUp.passwordLabel')}</label>
                </Form.Group>
                <Form.Group className="form-floating mb-4">
                  <Form.Control
                    type="password"
                    name="confirm"
                    id="confirm"
                    className={`form-control ${formik.errors.confirm || formik.errors.userExists ? 'is-invalid' : ''}`}
                    placeholder={t('signUp.confirmPasswordLabel')}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.confirm ? (<div className="invalid-tooltip">{formik.errors.confirm}</div>) : ''}
                  {formik.errors.userExists ? (<div className="invalid-tooltip">{formik.errors.userExists}</div>) : ''}
                  <label htmlFor="password" className="form-label">{t('signUp.confirmPasswordLabel')}</label>
                </Form.Group>
                <Button
                  type="submit"
                  variant="outline-primary"
                  className="w-100 mb-3"
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  {t('signUp.signUpButton')}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
