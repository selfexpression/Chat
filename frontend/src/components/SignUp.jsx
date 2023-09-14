import React, { useRef, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import routes from '../utils/routes.js';
import { useAuth } from '../hooks/index.js';
import image from '../assets/signup.jpg';
import notify from '../utils/notify.js';

const schema = (t) => Yup.object().shape({
  username: Yup
    .string()
    .required(t('validation.required'))
    .min(3, t('validation.usernameConstraints'))
    .max(20, t('validation.usernameConstraints')),
  password: Yup
    .string()
    .required(t('validation.required'))
    .min(6, t('validation.passwordMinLength')),
  confirm: Yup
    .string()
    .oneOf([Yup.ref('password')], t('validation.confirmPasswordMatch')),
});

const axiosError = (error, t, setState) => {
  switch (error.code) {
    case 'ERR_BAD_REQUEST':
      setState(true);
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
};

const SignUp = () => {
  const { t } = useTranslation();
  const [registrationFailed, setRegistrationFailed] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirm: '',
    },
    validationSchema: schema(t),
    onSubmit: async (values, { setSubmitting }) => {
      setRegistrationFailed(false);

      const response = await axios.post(routes.signupPath(), values)
        .catch((error) => {
          axiosError(error, t, setRegistrationFailed);
        });

      auth.login(response.data);
      navigate(routes.chatPagePath());
      setSubmitting(false);
    },
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img src={image} className="rounded-circle" alt="signup" />
              </div>
              <Form
                className="col-12 col-md-6 mt-3 mt-md-0"
                onSubmit={formik.handleSubmit}
              >
                <h1 className="text-center mb-4">{t('signUp.title')}</h1>
                {Object.keys(formik.values).map((field) => (
                  <Form.Group key={field} className="form-floating mb-3">
                    <Form.Control
                      type={field !== 'username' ? 'password' : 'text'}
                      name={field}
                      id={field}
                      isInvalid={(formik.errors[field] && formik.touched[field])
                        || registrationFailed}
                      placeholder={t(`signUp.${field}Label`)}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      required
                      ref={field === 'username' ? inputRef : null}
                      autoComplete="off"
                    />
                    {(formik.errors[field]
                      ? (<div className="invalid-tooltip">{formik.errors[field]}</div>)
                      : '')}
                    {(formik.errors.userExists && field === 'confirm'
                      ? (<div className="invalid-tooltip">{t('validation.userExists')}</div>)
                      : '')}
                    <label htmlFor={field} className="form-label">
                      {t(`signUp.${field}Label`)}
                    </label>
                  </Form.Group>
                ))}
                <Button
                  type="submit"
                  variant="outline-primary"
                  className="w-100 mb-3"
                  disabled={formik.isSubmitting}
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
