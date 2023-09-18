import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Modal, Form, FormControl,
} from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';
import { useApi, useAuth } from '../hooks/index.js';
import {
  getChannelsInfo, getModal, getChannelById,
} from '../utils/selectors.js';
import { actions as channelsInfoActions } from '../slices/channelsInfoSlice.js';
import { actions as modalActions } from '../slices/modalSlice.js';
import notify from '../utils/notify.js';

const schema = (t, channels) => Yup.object().shape({
  name: Yup
    .string()
    .min(3, t('validation.modalConstraints'))
    .max(20, t('validation.modalConstraints'))
    .test('is-unique', t('validation.unique'), (inputValue) => {
      if (!inputValue) return true;

      return !channels.some((channel) => channel.name === inputValue);
    }),
});

const NewChannel = ({ handleClose }) => {
  const { channels } = useSelector(getChannelsInfo);
  const { user: owner } = useAuth();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { createChannel } = useApi();
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus());
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: schema(t, channels),
    onSubmit: async ({ name }, { setSubmitting }) => {
      const data = await createChannel({ name, owner });
      dispatch(channelsInfoActions.setChannel(data.id));
      handleClose();
      setSubmitting(false);
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
          onClick={handleClose}
          aria-label="Close"
          data-bs-dismiss="modal"
        />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <div>
            <FormControl
              name="name"
              type="text"
              id="name"
              className="mb-2"
              onChange={formik.handleChange}
              aria-label={t('renameChannel.editChannelName')}
              isInvalid={formik.errors.name && formik.touched.name}
              value={formik.values.name}
              onBlur={formik.handleBlur}
              ref={inputRef}
              required
            />
            <label className="visually-hidden" htmlFor="name">{t('newChannel.channelName')}</label>
            {formik.errors.name
              ? (<div className="invalid-feedback">{formik.errors.name}</div>)
              : null}
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={handleClose}
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

const RemoveChannel = ({ handleClose }) => {
  const { t } = useTranslation();
  const { currentId } = useSelector(getModal);
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
          onClick={handleClose}
        />
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('removeChannel.confirmationText')}</p>
        <div className="d-flex justify-content-end">
          <Button
            variant="secondary"
            className="me-2"
            onClick={handleClose}
          >
            {t('removeChannel.cancelButton')}
          </Button>
          <Button
            variant="danger"
            className="me-2"
            onClick={async () => {
              await removeChannel(currentId);
              handleClose();
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

const RenameChannel = ({ handleClose }) => {
  const { currentId } = useSelector(getModal);
  const { channels } = useSelector(getChannelsInfo);
  const { t } = useTranslation();
  const { renameChannel } = useApi();
  const currentChannel = useSelector(getChannelById(currentId));
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.select());
  }, []);

  const formik = useFormik({
    initialValues: {
      name: currentChannel.name,
    },
    validationSchema: schema(t, channels),
    onSubmit: async ({ name }, { setSubmitting }) => {
      await renameChannel(currentId, name);
      setSubmitting(false);
      handleClose();
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
          onClick={handleClose}
          aria-label="Close"
          data-bs-dismiss="modal"
        />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <div>
            <FormControl
              name="name"
              type="text"
              id="name"
              className="mb-2"
              onChange={formik.handleChange}
              aria-label={t('renameChannel.editChannelName')}
              isInvalid={formik.errors.name && formik.touched.name}
              value={formik.values.name}
              onBlur={formik.handleBlur}
              ref={inputRef}
              required
            />
            <label className="visually-hidden" htmlFor="name">{t('renameChannel.channelName')}</label>
            {formik.errors.name
              ? (<div className="invalid-feedback">{formik.errors.name}</div>)
              : null}
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={handleClose}
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
  const { isShow, type } = useSelector(getModal);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(modalActions.modalClose());
  };

  const mappingModals = {
    newChannel: <NewChannel handleClose={handleClose} />,
    removeChannel: <RemoveChannel handleClose={handleClose} />,
    renameChannel: <RenameChannel handleClose={handleClose} />,
  };

  const ModalComponent = mappingModals[type];

  return (
    <Modal show={isShow} centered>
      {ModalComponent}
    </Modal>
  );
};

export default ModalWindow;
