import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

const getAuthHeader = () => {
  const userId = localStorage.getItem('userId');

  if (userId) {
    return { Authorization: `Bearer ${userId}` };
  }

  return {};
};

export const getDataAsync = () => createAsyncThunk(
  'data/getDataAsync',
  async () => {
    const header = getAuthHeader();
    const { Authorization } = header;
    const response = await axios.get(routes.dataPath(), { preValidation: [Authorization] });
    return response.data;
  },
);

const dataAdapter = createEntityAdapter();
const initialState = dataAdapter.getInitialState();

const slice = createSlice({
  name: 'data',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getDataAsync.fulfilled, dataAdapter.addMany);
  },
});

export const selectors = dataAdapter.getSelectors((state) => state.data);

export default slice.reducer;
