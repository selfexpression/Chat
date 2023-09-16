/* eslint-disable no-confusing-arrow */
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import filter from 'leo-profanity';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import {
  Button, Form, InputGroup, OverlayTrigger, Popover,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth, useApi } from '../hooks/index.js';
import { messagesSelectors, actions } from '../slices/messagesSlice.js';

const MessagesBox = ({ currentChannelMessages }) => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const colorName = (username) => auth.user === username ? 'text-dark' : 'text-muted';
  const trigger = (username) => auth.user === username ? 'focus' : '';

  const handleRemove = (id) => () => {
    dispatch(actions.removeMessage(id));
  };

  const popover = (id) => (
    <Popover id="popover-basic">
      <Button variant="outline-secondary" className="small-button">Изменить</Button>
      <Button variant="outline-danger" onClick={handleRemove(id)} className="small-button">Удалить</Button>
    </Popover>
  );

  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5 ">
      {currentChannelMessages.map(({ body, id, username }) => (
        <div key={id} className="text-break mb-2">
          <OverlayTrigger key={id} trigger={trigger(username)} placement="top" overlay={popover(id)}>
            <div
              role="button"
              tabIndex="0"
              className={`message-bg rounded-3 p-2 ${
                auth.user === username ? 'bg-user' : 'bg-info'
              }`}
              style={{ marginLeft: auth.user === username ? '50px' : '0' }}
            >
              <b className={colorName(username)}>{username}</b>
              <span className={colorName(username)}>:</span>
              {' '}
              <span className={colorName(username)}>{body}</span>
            </div>
          </OverlayTrigger>
        </div>
      ))}
    </div>
  );
};

const ChannelInfo = ({ currentChannelMessages, currentChannel }) => {
  const { t } = useTranslation();
  const messageCount = currentChannelMessages.length;

  return (
    <div className="bg-light mb-4 p-3 shadow-sm small">
      <p className="m-0">
        #
        {' '}
        <b>{currentChannel.name}</b>
      </p>
      <span className="text-muted">
        {t('channels.messageCount', { count: messageCount })}
      </span>
    </div>
  );
};

const Chat = ({ currentChannel }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { sendMessage } = useApi();
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus());
  }, []);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: ({ body }, { setSubmitting, resetForm }) => {
      const filteredWords = filter.clean(body);
      const newMessage = {
        body: filteredWords,
        channelId: currentChannel.id,
        username: user,
      };

      sendMessage(newMessage);
      setSubmitting(false);
      resetForm();
    },
  });

  const messages = useSelector(messagesSelectors.selectAll);
  const currentChannelMessages = messages
    .filter((message) => message.channelId === currentChannel.id);

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <ChannelInfo
          currentChannelMessages={currentChannelMessages}
          currentChannel={currentChannel}
        />
        <MessagesBox
          messages={messages}
          currentChannelMessages={currentChannelMessages}
        />
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
