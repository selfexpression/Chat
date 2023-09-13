import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth, useApi } from '../hooks/index.js';
import { messagesSelectors } from '../slices/messagesSlice.js';
import profanityFilter from '../utils/badWords.js';

const MessagesBox = ({ currentChannelMessages }) => (
  <div id="messages-box" className="chat-messages overflow-auto px-5 ">
    {currentChannelMessages.map(({ body, id, username }) => (
      <div key={id} className="text-break mb-2">
        <b>{username}</b>
        {': '}
        {body}
      </div>
    ))}
  </div>
);

const ChannelInfo = ({ currentChannelMessages, current }) => {
  const { t } = useTranslation();
  const messageCount = currentChannelMessages.length;

  return (
    <div className="bg-light mb-4 p-3 shadow-sm small">
      <p className="m-0">
        #
        {' '}
        <b>{current.name}</b>
      </p>
      <span className="text-muted">
        {t('channels.messageCount', { count: messageCount })}
      </span>
    </div>
  );
};

const Chat = ({ current }) => {
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
      const filteredWords = profanityFilter(body);
      const newMessage = {
        body: filteredWords,
        channelId: current.id,
        username: user,
      };

      sendMessage(newMessage);
      setSubmitting(false);
      resetForm();
    },
  });

  const messages = useSelector(messagesSelectors.selectAll);
  const currentChannelMessages = messages.filter((message) => message.channelId === current.id);

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <ChannelInfo currentChannelMessages={currentChannelMessages} current={current} />
        <MessagesBox messages={messages} currentChannelMessages={currentChannelMessages} />
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
