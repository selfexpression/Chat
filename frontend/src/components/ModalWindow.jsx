import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Modal, Form, InputGroup, FormControl,
} from 'react-bootstrap';
import * as Yup from 'yup';
import cn from 'classnames';
import { useFormik } from 'formik';
import { actions as modalActions } from '../slices/modalSlice.js';
import { actions as dataActions } from '../slices/dataSlice.js';
import { getData, getModal, getLastChannelId } from '../selectors.js';

const getNewChannelId = (lastId) => lastId + 1;

const NewChannel = ({ handleClose }) => {
  const dispatch = useDispatch();
  const { channels } = useSelector(getData);
  const { id: lastChannelId } = useSelector(getLastChannelId);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().min(3, 'От 3 до 20 символов').max(20)
        .test('is-unique', 'Должно быть уникальным', (value) => {
          if (!value) return true;

          return !channels.some((channel) => channel.name === value);
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
      handleClose();
    },
  });

  return (
    <>
      <Modal.Header>
        <Modal.Title>Добавить канал</Modal.Title>
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
                onClick={handleClose}
              >
                Отменить
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="me-2"
                disabled={formik.isSubmitting}
              >
                Отправить
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </>
  );
};

const RemoveChannel = ({ handleRemove, handleClose }) => (
  <>
    <Modal.Header>
      <Modal.Title>Удалить канал</Modal.Title>
      <Button
        variant="close"
        type="button"
        aria-label="Close"
        data-bs-dismiss="modal"
        onClick={handleClose}
      />
    </Modal.Header>
    <Modal.Body>
      <p className="lead">Вы уверены?</p>
      <div className="d-flex justify-content-end">
        <Button
          variant="secondary"
          className="me-2"
          onClick={handleClose}
        >
          Отменить
        </Button>
        <Button
          variant="danger"
          type="submit"
          className="me-2"
          onClick={handleRemove}
        >
          Удалить
        </Button>
      </div>
    </Modal.Body>
  </>
);

const ModalWindow = () => {
  const dispatch = useDispatch();
  const { isShow, type } = useSelector(getModal);

  const handleClose = () => {
    dispatch(modalActions.modalControl(!isShow));
  };

  const handleRemove = (name) => () => {
    dispatch(dataActions.removeChannel(name));
    handleClose();
  };

  const mappingModals = {
    newChannel: <NewChannel
      handleClose={handleClose}
    />,
    removeChannel: <RemoveChannel
      handleRemove={handleRemove}
      andleClose={handleClose}
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
