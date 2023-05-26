import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { PriceTable, PriceTableParams } from 'types/priceTable';
import { APICreatePriceTable, APISearchPriceTable, APIUpdatePriceTable } from 'services/priceTable';

export interface PriceTableState {
  PriceTableList: PriceTable[];
  loading: boolean;
  errorMessage: any;
  status: string;
  total: number;
}

const initialState: PriceTableState = {
  PriceTableList: [],
  loading: false,
  errorMessage: '',
  status: 'idle',
  total: 0,
};

export const getListPriceTable = createAsyncThunk(
  'getListPriceTable',
  async (body: PriceTableParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearchPriceTable(params);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const createPriceTable = createAsyncThunk(
  'createPriceTable',
  async (body: PriceTableParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APICreatePriceTable(params);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);


export const updatePriceTable = createAsyncThunk(
  'createPriceTable',
  async (body: PriceTableParams, { rejectWithValue }) => {
    const { id } = body;
    const params = {
      ...body,
    };
    const response = await APIUpdatePriceTable(id, params);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const detailPriceTable = {};

export const priceTableSlice = createSlice({
  name: '@priceTable',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListPriceTable.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
    });

    builder.addCase(getListPriceTable.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.total = action.payload.total;
      state.PriceTableList = action.payload.data;
    });
    builder.addCase(getListPriceTable.rejected, (state, action) => {
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });
  },
});

export const getAllListPriceTable = (state: RootState) => state.priceTable.PriceTableList;
export const priceTableTotal = (state: RootState) => state.priceTable.total;

export default priceTableSlice.reducer;
