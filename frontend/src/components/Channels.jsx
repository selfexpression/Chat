/* eslint-disable no-confusing-arrow */
import axios from 'axios';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PlusSquare } from 'react-bootstrap-icons';
import {
  Button, Dropdown, ButtonGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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

const Title = ({ values }) => {
  const { t } = useTranslation();
  const { handleSelectModal, currentChannelId } = values;

  return (
    <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
      <b>{t('channels.title')}</b>
      <Button
        type="button"
        variant="group-vertical"
        className="p-0 text-primary"
        onClick={handleSelectModal(types.newChannel, currentChannelId)}
      >
        <PlusSquare size={20} />
        <span className="visually-hidden">+</span>
      </Button>
    </div>
  );
};

const ChannelsBox = ({ values }) => {
  const {
    handleSelectModal, channels, currentChannelId,
  } = values;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const variants = (id, currentId) => id === currentId ? 'secondary' : '';
  const typeNames = ['remove', 'rename'];

  const handleChannel = (id) => () => {
    dispatch(channelsInfoActions.setChannel(id));
  };

  return (
    <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
      {channels.map(({ id, name, removable }) => (
        <li key={id} className="nav-item w-100">
          {removable
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
                      onClick={handleSelectModal(types[`${type}Channel`], id)}
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

const Channels = () => {
  const { t } = useTranslation();
  const { isShow } = useSelector(getModal);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useAuth();
  const currentChannel = useSelector(getCurrentChannel);
  const { channels, currentChannelId } = useSelector(getChannelsInfo);

  useEffect(() => {
    const getAxiosData = async () => {
      const headers = auth.getAuthHeader();
      const response = await axios.get(routes.dataPath(), { headers })
        .catch((error) => {
          const errorPath = error.code === 'ERR_NETWORK'
            ? t('toast.networkError')
            : t('toast.requestError');

          notify('error', t, errorPath);
        });

      dispatch(channelsInfoActions.addChannels(response.data));
    };

    getAxiosData();
  }, [auth, t, navigate, isShow, dispatch]);

  if (!currentChannel) return null;

  const handleShow = () => {
    dispatch(modalActions.modalShow());
  };

  const handleSelectModal = (type, id) => () => {
    dispatch(modalActions.modalSelect({ type, id }));
    handleShow();
  };

  return (
    <>
      {isShow ? <ModalWindow /> : ''}
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <Title values={{ handleSelectModal, currentChannelId }} />
            <ChannelsBox values={{ handleSelectModal, channels, currentChannelId }} />
          </div>
          <Chat current={currentChannel} />
        </div>
      </div>
    </>
  );
};

export default Channels;
