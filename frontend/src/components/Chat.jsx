import axios from 'axios';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions as dataActions, selectors } from '../slices/dataSlice.js';
import routes from '../routes.js';

const getAuthHeader = () => {
  const userId = localStorage.getItem('userId');

  if (userId) {
    return { Authorization: `Bearer ${userId}` };
  }

  return {};
};

const Chat = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getAxiosData = async () => {
      const headers = getAuthHeader();
      const response = await axios.get(routes.dataPath(), { headers });
      dispatch(dataActions.addData(response.data));
    };

    getAxiosData();
  });

  const data = useSelector(selectors.selectAll);
  const channels = data.flatMap((entity) => entity.channels);

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>Каналы</b>
            <button type="button" className="p-0 text-primary btn btn-group-vertical">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width={20} height={20} fill="currentColor" />
              <span className="visually-hidden">+</span>
            </button>
          </div>
          <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
            {channels.map(({ id, name }) => (
              <li key={id} className="nav-item w-100">
                <button type="button" className="w-100 rounded-0 text-start btn">
                  <span className="me-1">#</span>
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Chat;
