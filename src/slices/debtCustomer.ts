import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  APISearchDebtCustomer,
  APITotalDebtCustomer,
} from 'services/debtCustomer';
import { RootState } from 'store';
import {
  DebtCustomerParams,
  dataDebtCustomer,
  TotalDebtCustomer,
} from 'types/debtCustomer';

export interface DebtCustomer {
  debtCustomerList: dataDebtCustomer[];
  debtCustomerTotal: TotalDebtCustomer | null;
  total: number;
  loading: boolean;
}

const initialState: DebtCustomer = {
  debtCustomerList: [],
  debtCustomerTotal: null,
  total: 0,
  loading: false,
};

interface IError {
  error: {
    code: number | null;
    message: string;
  };
}

export const getListDebtCustomer = createAsyncThunk<any, any>(
  'debtCustomerList',
  async (body: DebtCustomerParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearchDebtCustomer(params);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getTotalDebtCustomer = createAsyncThunk<any, any>(
  'debtCustomerTotal',
  async (body: DebtCustomerParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APITotalDebtCustomer(params);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

const storeDebtCustomer = createSlice({
  name: '@debtCustomer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListDebtCustomer.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getListDebtCustomer.fulfilled, (state, action) => {
      state.debtCustomerList = action.payload.data;
      state.total = action.payload.total;
      state.loading = false;
    });
    builder.addCase(getListDebtCustomer.rejected, (state, action) => {
      state.loading = false;
    });
    // Total
    builder.addCase(getTotalDebtCustomer.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTotalDebtCustomer.fulfilled, (state, action) => {
      state.debtCustomerTotal = action.payload;
      state.loading = false;
    });
    builder.addCase(getTotalDebtCustomer.rejected, (state, action) => {
      state.loading = false;
    });
  },
});
export const getDebtCustomerList = (state: RootState) =>
  state.debtCustomer.debtCustomerList;
export const getDebtCustomerTotalList = (state: RootState) =>
  state.debtCustomer.total;
export const getDebtCustomerTotal = (state: RootState) =>
  state.debtCustomer.debtCustomerTotal;

export default storeDebtCustomer.reducer;
