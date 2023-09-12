import React, { useRef } from 'react';
import { useFormik } from 'formik';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth, useApi } from '../hooks/index.js';
import MessagesBox from './MessagesBox.jsx';

const Chat = ({ channel }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { sendMessage } = useApi();
  const inputRef = useRef(null);

  setTimeout(() => inputRef.current.focus());

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: ({ body }, { setSubmitting, resetForm }) => {
      const newMessage = {
        body,
        channelId: channel.id,
        username: user,
      };

      sendMessage(newMessage);
      setSubmitting(false);
      resetForm();
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
          <Form
            noValidate
            className="py-1 border"
            onSubmit={formik.handleSubmit}
          >
            <InputGroup className="rounded-2">
              <Form.Control
                name="body"
                id="body"
                type="text"
                aria-label="Новое сообщение"
                placeholder={t('chat.newMessagePlaceholder')}
                className="border-0 p-0 ps-2 rounded-2"
                onChange={formik.handleChange}
                value={formik.values.body}
                ref={inputRef}
              />
              <Button type="submit" variant="group-vertical">
                <ArrowRightSquare size={20} />
                <span className="visually-hidden">{t('chat.sendButton')}</span>
              </Button>
            </InputGroup>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
