import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  APICreatePaymentReceipt,
  APISearchDebt,
  APISearchPaymentReceipt,
} from 'services/paymentReceipt';
import { RootState } from 'store';
import { ResponseDebtType } from 'types/paymentReceipt';
import {
  ParamSearch,
  ParamSearchDebt,
  ParamsCreate,
  PaymentReceiptListType,
} from 'types/paymentReceipt';

export interface StorePaymentReceipt {
  loading: boolean;
  paymentReceiptList: PaymentReceiptListType[];
  total: number;
  debt: ResponseDebtType[] ;
}

const initialState: StorePaymentReceipt = {
  loading: false,
  paymentReceiptList: [],
  total: 0,
  debt: [],
};

export const postPaymentReceiptCreate = createAsyncThunk(
  'createPaymentReceipt',
  async (body: ParamsCreate, { rejectWithValue }) => {
    const response = await APICreatePaymentReceipt(body);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const postPaymentReceiptSearch = createAsyncThunk(
  'searchPaymentReceipt',
  async (body: ParamSearch, { rejectWithValue }) => {
    const response = await APISearchPaymentReceipt(body);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const postDebtSearch = createAsyncThunk(
  'searchDebt',
  async (body: ParamSearchDebt, { rejectWithValue }) => {
    const response = await APISearchDebt(body);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

const paymentReceipt = createSlice({
  name: '@paymentReceipt',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(postPaymentReceiptCreate.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(postPaymentReceiptCreate.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(postPaymentReceiptCreate.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(postPaymentReceiptSearch.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(postPaymentReceiptSearch.fulfilled, (state, action) => {
      state.loading = false;
      state.paymentReceiptList = action.payload.data;
      state.total = action.payload.total;
    });
    builder.addCase(postPaymentReceiptSearch.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(postDebtSearch.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(postDebtSearch.fulfilled, (state, action) => {
      state.loading = false;
      state.debt = action.payload.data;
    });
    builder.addCase(postDebtSearch.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export const getPaymentReceiptList = (state: RootState) =>
  state.paymentReceipt.paymentReceiptList;
export const getPaymentReceiptTotal = (state: RootState) =>
  state.paymentReceipt.total;
export const getDebt = (state: RootState) => state.paymentReceipt.debt;
export default paymentReceipt.reducer;
