import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  APISearchStoreApplication,
  typeResponseStore,
} from 'services/storeApplication';
import { RootState } from 'store';
import { dataSoreApplicationI } from 'types/storeApplication';

export interface StoreApplication {
  StoreApplicationList: dataSoreApplicationI[];
  total: number;
  loading: boolean;
}

const initialState: StoreApplication = {
  StoreApplicationList: [],
  total: 0,
  loading: false,
};

interface IError {
  error: {
    code: number | null;
    message: string;
  };
}

const getListStoreApplication = createAsyncThunk<any, any>(
  'storeApplication',
  async ({ rejectWithValue }) => {
    try {
      const res = await APISearchStoreApplication();

      if (!res) {
        return rejectWithValue(res);
      }
      return res;
    } catch (err) {
      const errors = err as IError;
      return rejectWithValue(errors.error.message);
    }
  }
);

const storeApplication = createSlice({
  name: '@storeApplication',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListStoreApplication.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getListStoreApplication.fulfilled, (state, action) => {
      state.StoreApplicationList = action.payload;
      state.total = action.payload.total;
      state.loading = false;
    });
    builder.addCase(getListStoreApplication.rejected, (state, action) => {
      state.loading = false;
    });
  },
});
export const getStoreApplicationList = (state: RootState) => state.storeApplication.StoreApplicationList;
export const getStoreApplicationTotal = (state: RootState) => state.storeApplication.total;

export default storeApplication.reducer;

export { getListStoreApplication };
