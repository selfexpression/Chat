import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors, getDataAsync } from '../slices/dataSlice.js';

const Chat = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectors.selectAll);

  useEffect(() => {
    dispatch(getDataAsync());
  }, [dispatch]);

  return (
    <div>{data}</div>
  );
};

export default Chat;
