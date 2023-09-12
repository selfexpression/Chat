import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PlusSquare } from 'react-bootstrap-icons';
import {
  Button, Dropdown, ButtonGroup,
} from 'react-bootstrap';
import { actions as dataActions } from '../slices/dataSlice.js';
import { actions as modalActions } from '../slices/modalSlice.js';
import routes from '../routes.js';
import ChatBox from './ChatBox.jsx';
import { useAuth } from '../hooks/index.js';
import ModalWindow from './ModalWindow.jsx';
import { getData, getModal } from '../selectors.js';

const ChannelsBox = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const { isShow } = useSelector(getModal);
  const auth = useAuth();
  const dispatch = useDispatch();
  const data = useSelector(getData);

  useEffect(() => {
    const getAxiosData = async () => {
      const headers = auth.getAuthHeader();
      const response = await axios.get(routes.dataPath(), { headers });
      dispatch(dataActions.addData(response.data));
      setDataLoaded(true);
    };

    getAxiosData();
  }, [auth, dispatch]);

  if (!dataLoaded) {
    return null;
  }

  const { channels, currentChannelId } = data;
  const currentChannel = channels.find((channel) => channel.id === currentChannelId);

  const handleChannel = (id) => () => {
    dispatch(dataActions.setChannel(id));
  };

  const handleShow = (type, value) => () => {
    dispatch(modalActions.modalControl({ value: !value, type }));
  };

  const handleCurrentModal = (type, value, id) => () => {
    dispatch(modalActions.modalControl({ value: !value, type, currentId: id }));
  };

  const types = {
    newChannel: 'newChannel',
    removeChannel: 'removeChannel',
    renameChannel: 'renameChannel',
  };

  return (
    <>
      {isShow ? <ModalWindow handleChannel={handleChannel} /> : ''}
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>Каналы</b>
              <Button
                type="button"
                variant="group-vertical"
                className="p-0 text-primary"
                onClick={handleShow(types.newChannel, isShow)}
              >
                <PlusSquare size={20} />
                <span className="visually-hidden">+</span>
              </Button>
            </div>
            <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
              {channels.map(({ id, name, removable }) => (
                <li key={id} className="nav-item w-100">
                  {removable
                    ? (
                      <Dropdown as={ButtonGroup} className="d-flex">
                        <Button
                          className="w-100 rounded-0 text-start text-truncate"
                          variant={id === currentChannelId ? 'secondary' : ''}
                          onClick={handleChannel(id)}
                        >
                          <span className="me-1">#</span>
                          {name}
                        </Button>
                        <Dropdown.Toggle
                          split
                          className="flex-grow-0"
                          variant={id === currentChannelId ? 'secondary' : ''}
                          id="dropdown-split-basic"
                        />
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={handleCurrentModal(types.removeChannel, isShow, id)}
                          >
                            Удалить
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={handleCurrentModal(types.renameChannel, isShow, id)}
                          >
                            Переименовать
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )
                    : (
                      <Button
                        className="w-100 rounded-0 text-start"
                        variant={id === currentChannelId ? 'secondary' : ''}
                        onClick={handleChannel(id)}
                      >
                        <span className="me-1">#</span>
                        {name}
                      </Button>
                    )}
                </li>
              ))}
            </ul>
          </div>
          <ChatBox channel={currentChannel} />
        </div>
      </div>
    </>
  );
};

export default ChannelsBox;
