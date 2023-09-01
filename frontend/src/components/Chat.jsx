import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors, getAxiosData } from '../slices/dataSlice.js';

const Chat = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectors.selectAll);

  useEffect(() => {
    dispatch(getAxiosData());
  });

  console.log(data);
};

export default Chat;
