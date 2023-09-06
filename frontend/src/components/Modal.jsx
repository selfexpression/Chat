import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Modal, Form, InputGroup, FormControl,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import { actions as modalActions } from '../slices/modalSlice.js';
import { actions as dataActions } from '../slices/dataSlice.js';

const getNewChannelId = (lastId) => lastId + 1;

const NewChannel = () => {
  const dispatch = useDispatch();
  const { isShow } = useSelector((state) => state.modal);
  const { id: lastChannelId } = useSelector((state) => state
    .data
    .channels)
    .at(-1);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleClose = () => {
    dispatch(modalActions.modalControl(!isShow));
  };

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: ({ name }, { setSubmitting }) => {
      const id = getNewChannelId(lastChannelId);

      const newChannel = {
        id,
        name,
        removable: false,
      };

      dispatch(dataActions.setChannel(id));
      dispatch(dataActions.addChannel(newChannel));
      setSubmitting(false);
      handleClose();
    },
  });

  return (
    <Modal
      show={isShow}
      centered
    >
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
        <Form
          onSubmit={formik.handleSubmit}
        >
          <div>
            <InputGroup>
              <FormControl
                name="name"
                type="text"
                className="mb-2"
                onChange={formik.handleChange}
                value={formik.values.name}
                ref={inputRef}
                disabled={formik.isSubmitting}
              />
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
    </Modal>
  );
};

export default NewChannel;
