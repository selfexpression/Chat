import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Modal, Form, InputGroup, FormControl,
} from 'react-bootstrap';
import * as Yup from 'yup';
import cn from 'classnames';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';
import { actions as dataActions } from '../slices/dataSlice.js';
import {
  getData, getModal, getLastChannelId, getChannelById,
} from '../utils/selectors.js';
import { handleClose, handleRemove, handleRename } from '../controllers/index.js';
import notify from '../utils/notify.js';

const getNewChannelId = (lastId) => lastId + 1;

const NewChannel = ({ value }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { channels } = useSelector(getData);
  const { id: lastChannelId } = useSelector(getLastChannelId);
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    });
  }, [value]);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().min(3, t('validation.minLength')).max(20)
        .test('is-unique', t('validation.unique'), (inputValue) => {
          if (!inputValue) return true;

          return !channels.some((channel) => channel.name === inputValue);
        }),
    }),
    onSubmit: ({ name }, { setSubmitting }) => {
      const id = getNewChannelId(lastChannelId);

      const newChannel = {
        id,
        name,
        removable: true,
      };

      dispatch(dataActions.setChannel(id));
      dispatch(dataActions.addChannel(newChannel));
      setSubmitting(false);
      handleClose(value)();
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
          onClick={handleClose(value)}
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
                onClick={handleClose(value)}
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

const RemoveChannel = ({ id, value }) => {
  const { t } = useTranslation();

  return (
    <>
      <Modal.Header>
        <Modal.Title>{t('removeChannel.modalTitle')}</Modal.Title>
        <Button
          variant="close"
          type="button"
          aria-label="Close"
          data-bs-dismiss="modal"
          onClick={handleClose(value)}
        />
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('removeChannel.confirmationText')}</p>
        <div className="d-flex justify-content-end">
          <Button
            variant="secondary"
            className="me-2"
            onClick={handleClose(value)}
          >
            {t('removeChannel.cancelButton')}
          </Button>
          <Button
            variant="danger"
            className="me-2"
            onClick={() => {
              handleRemove(id, value)();
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

const RenameChannel = ({ id, value }) => {
  const { t } = useTranslation();
  const currentChannel = useSelector(getChannelById(id));
  const { channels } = useSelector(getData);
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
    validationSchema: Yup.object().shape({
      name: Yup.string().min(3, t('validation.minLength')).max(20)
        .test('is-unique', t('validation.unique'), (inputValue) => {
          if (!inputValue) return true;

          return !channels.some((channel) => channel.name === inputValue);
        }),
    }),
    onSubmit: ({ name }, { setSubmitting }) => {
      handleRename(name, id)();
      setSubmitting(false);
      handleClose(value)();
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
          onClick={handleClose(value)}
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
                onClick={handleClose(value)}
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
  const { isShow, type, currentId } = useSelector(getModal);

  const mappingModals = {
    newChannel: <NewChannel value={isShow} />,
    removeChannel: <RemoveChannel id={currentId} value={isShow} />,
    renameChannel: <RenameChannel id={currentId} value={isShow} />,
  };

  const ModalComponent = mappingModals[type];

  return (
    <Modal show={isShow} centered>
      {ModalComponent}
    </Modal>
  );
};

export default ModalWindow;
