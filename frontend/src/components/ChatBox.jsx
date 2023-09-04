import React from 'react';
import {
  Formik, Form, Field, useFormik,
} from 'formik';
import { Button } from 'react-bootstrap';
import { useAuth, useApi } from '../hooks/index.js';
import MessagesBox from './MessagesBox.jsx';

const ChatBox = ({ channel }) => {
  const { user } = useAuth();
  const { sendMessage } = useApi();

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: async ({ body }, { setSubmitting }) => {
      const newMessage = {
        body,
        channelId: channel.id,
        username: user,
      };

      sendMessage(newMessage);
      setSubmitting(false);
    },
  });

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b />
          </p>
          <span className="text-muted" />
        </div>
        <MessagesBox />
        <div className="mt-auto px-5 py-3">
          <Formik>
            <Form noValidate className="py-1 border rounded-2" onSubmit={formik.handleSubmit}>
              <div className="input-group has-validation">
                <Field
                  name="body"
                  aria-label="Новое сообщение"
                  placeholder="Введите новое сообщение..."
                  className="border-0 p-0 ps-2 form-control"
                  onChange={formik.handleChange}
                  value={formik.values.text}
                />
                <Button
                  type="submit"
                  className="btn btn-group-vertical"
                >
                  <span className="visually-hidden">Отправить</span>
                </Button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
