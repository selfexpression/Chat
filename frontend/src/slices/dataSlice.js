import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

const getAuthHeader = () => {
  const userId = localStorage.getItem('userId');

  if (userId) {
    return { Authorization: `Bearer ${userId}` };
  }

  return {};
};

export const getAxiosData = async () => {
  const headers = getAuthHeader();
  const response = await axios.get(routes.dataPath(), { headers });
  return response.data;
};

const dataAdapter = createEntityAdapter();
const initialState = dataAdapter.getInitialState();

const slice = createSlice({
  name: 'data',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAxiosData.fulfilled, dataAdapter.addMany);
  },
});

export const selectors = dataAdapter.getSelectors((state) => state.data);

export default slice.reducer;
