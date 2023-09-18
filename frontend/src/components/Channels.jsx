/* eslint-disable no-confusing-arrow */
import axios from 'axios';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PlusSquare } from 'react-bootstrap-icons';
import {
  Button, Dropdown, ButtonGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import routes from '../utils/routes.js';
import Chat from './Chat.jsx';
import { useAuth } from '../hooks/index.js';
import ModalWindow from './ModalWindow.jsx';
import { getCurrentChannel, getModal, getChannelsInfo } from '../utils/selectors.js';
import { actions as channelsInfoActions } from '../slices/channelsInfoSlice';
import { actions as modalActions } from '../slices/modalSlice.js';
import notify from '../utils/notify.js';

const types = {
  newChannel: 'newChannel',
  removeChannel: 'removeChannel',
  renameChannel: 'renameChannel',
};

const Title = ({ handleShow }) => {
  const { t } = useTranslation();
  const { currentChannelId } = useSelector(getChannelsInfo);

  return (
    <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
      <b>{t('channels.title')}</b>
      <Button
        type="button"
        variant="group-vertical"
        className="p-0 text-primary"
        onClick={handleShow(types.newChannel, currentChannelId)}
      >
        <PlusSquare size={20} />
        <span className="visually-hidden">+</span>
      </Button>
    </div>
  );
};

const ChannelsBox = ({ handleShow }) => {
  const { channels, currentChannelId } = useSelector(getChannelsInfo);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const auth = useAuth();
  const variants = (id, currentId) => id === currentId ? 'info' : '';
  const typeNames = ['remove', 'rename'];

  const handleChannel = (id) => () => {
    dispatch(channelsInfoActions.setChannel(id));
  };

  return (
    <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
      {channels.map(({
        id, name, removable, owner,
      }) => (
        <li key={id} className="nav-item w-100">
          {removable && auth.user === owner
            ? (
              <Dropdown as={ButtonGroup} className="d-flex">
                <Button
                  className="w-100 rounded-0 text-start text-truncate"
                  variant={variants(id, currentChannelId)}
                  onClick={handleChannel(id)}
                >
                  <span className="me-1">#</span>
                  {name}
                </Button>
                <Dropdown.Toggle
                  split
                  className="flex-grow-0"
                  variant={variants(id, currentChannelId)}
                  id="dropdown-split-basic"
                >
                  <span className="visually-hidden">{t('channels.menu')}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {typeNames.map((type) => (
                    <Dropdown.Item
                      key={type}
                      onClick={handleShow(types[`${type}Channel`], id)}
                    >
                      {t(`channels.${type}Channel`)}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )
            : (
              <Button
                className="w-100 rounded-0 text-start"
                variant={variants(id, currentChannelId)}
                onClick={handleChannel(id)}
              >
                <span className="me-1">#</span>
                {name}
              </Button>
            )}
        </li>
      ))}
    </ul>
  );
};

const axiosError = (error, logout, t) => {
  switch (error.code) {
    case 'ERR_BAD_REQUEST':
      logout();
      notify('error', t, 'toast.requestError');
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

const Channels = () => {
  const { t } = useTranslation();
  const { isShow } = useSelector(getModal);
  const dispatch = useDispatch();
  const { logout, getAuthHeader } = useAuth();
  const currentChannel = useSelector(getCurrentChannel);

  useEffect(() => {
    const getAxiosData = async () => {
      const headers = getAuthHeader();
      const response = await axios.get(routes.dataPath(), { headers })
        .catch((error) => {
          axiosError(error, logout, t);
        });

      if (!response) {
        return;
      }

      dispatch(channelsInfoActions.addChannels(response.data));
    };

    getAxiosData();
  }, [dispatch, getAuthHeader, logout, t]);

  if (!currentChannel) return null;

  const handleShow = (type, id) => () => {
    dispatch(modalActions.modalShow({ type, id }));
  };

  return (
    <>
      {isShow ? <ModalWindow /> : ''}
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <Title handleShow={handleShow} />
            <ChannelsBox handleShow={handleShow} />
          </div>
          <Chat />
        </div>
      </div>
    </>
  );
};

export default Channels;
