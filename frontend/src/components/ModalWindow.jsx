import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Button, Modal, Form, InputGroup, FormControl,
} from 'react-bootstrap';
import * as Yup from 'yup';
import cn from 'classnames';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';
import { useApi } from '../hooks/index.js';
import {
  getData, getModal, getChannelById,
} from '../utils/selectors.js';
import { handleClose } from '../controllers/index.js';
import notify from '../utils/notify.js';

const schema = (t, channels) => Yup.object().shape({
  name: Yup.string().min(3, t('validation.minLength')).max(20)
    .test('is-unique', t('validation.unique'), (inputValue) => {
      if (!inputValue) return true;

      return !channels.some((channel) => channel.name === inputValue);
    }),
});

const NewChannel = ({ values }) => {
  const { isShow, channels, t } = values;
  const { addChannel } = useApi();
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    });
  }, [isShow]);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: schema(t, channels),
    onSubmit: ({ name }, { setSubmitting }) => {
      addChannel(name);
      setSubmitting(false);
      handleClose(isShow)();
      notify('success', t, 'toast.createChannel');
    },
  });

  return (
    <>
      <Modal.Header>
        <Modal.Title>{t('newChannel.modalTitle')}</Modal.Title>
        <Button
          variant="close"
          type="button"
          onClick={handleClose(isShow)}
          aria-label="Close"
          data-bs-dismiss="modal"
        />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <div>
            <InputGroup>
              <FormControl
                name="name"
                type="text"
                className={cn('mb-2', { 'is-invalid': !formik.isValid })}
                onChange={formik.handleChange}
                value={formik.values.name}
                ref={inputRef}
                disabled={formik.isSubmitting}
              />
              {formik.errors.name
                ? (<div className="invalid-feedback">{formik.errors.name}</div>)
                : null}
            </InputGroup>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={handleClose(isShow)}
              >
                {t('newChannel.cancelButton')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="me-2"
                disabled={formik.isSubmitting}
              >
                {t('newChannel.submitButton')}
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </>
  );
};

const RemoveChannel = ({ values }) => {
  const { id, isShow, t } = values;
  const { removeChannel } = useApi();

  return (
    <>
      <Modal.Header>
        <Modal.Title>{t('removeChannel.modalTitle')}</Modal.Title>
        <Button
          variant="close"
          type="button"
          aria-label="Close"
          data-bs-dismiss="modal"
          onClick={handleClose(isShow)}
        />
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('removeChannel.confirmationText')}</p>
        <div className="d-flex justify-content-end">
          <Button
            variant="secondary"
            className="me-2"
            onClick={handleClose(isShow)}
          >
            {t('removeChannel.cancelButton')}
          </Button>
          <Button
            variant="danger"
            className="me-2"
            onClick={() => {
              removeChannel(id);
              handleClose(isShow)();
              notify('success', t, 'toast.removeChannel');
            }}
          >
            {t('removeChannel.deleteButton')}
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};

const RenameChannel = ({ values }) => {
  const {
    id, isShow, channels, t,
  } = values;
  const { renameChannel } = useApi();
  const currentChannel = useSelector(getChannelById(id));
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.select();
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: currentChannel.name,
    },
    validationSchema: schema(t, channels),
    onSubmit: ({ name }, { setSubmitting }) => {
      renameChannel(id, name);
      setSubmitting(false);
      handleClose(isShow)();
      notify('success', t, 'toast.renameChannel');
    },
  });

  return (
    <>
      <Modal.Header>
        <Modal.Title>{t('renameChannel.modalTitle')}</Modal.Title>
        <Button
          variant="close"
          type="button"
          onClick={handleClose(isShow)}
          aria-label="Close"
          data-bs-dismiss="modal"
        />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <div>
            <InputGroup>
              <FormControl
                name="name"
                type="text"
                className={cn('mb-2', { 'is-invalid': !formik.isValid })}
                onChange={formik.handleChange}
                value={formik.values.name}
                ref={inputRef}
                disabled={formik.isSubmitting}
              />
              {formik.errors.name
                ? (<div className="invalid-feedback">{formik.errors.name}</div>)
                : null}
            </InputGroup>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={handleClose(isShow)}
              >
                {t('renameChannel.cancelButton')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="me-2"
                disabled={formik.isSubmitting}
              >
                {t('renameChannel.submitButton')}
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </>
  );
};

const ModalWindow = () => {
  const { t } = useTranslation();
  const { isShow, type, currentId } = useSelector(getModal);
  const { channels } = useSelector(getData);

  const mappingModals = {
    newChannel: <NewChannel values={{
      isShow, channels, t,
    }}
    />,
    removeChannel: <RemoveChannel values={{
      id: currentId, isShow, t,
    }}
    />,
    renameChannel: <RenameChannel values={{
      id: currentId, isShow, channels, t,
    }}
    />,
  };

  const ModalComponent = mappingModals[type];

  return (
    <Modal show={isShow} centered>
      {ModalComponent}
    </Modal>
  );
};

export default ModalWindow;
