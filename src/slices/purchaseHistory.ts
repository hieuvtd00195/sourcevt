import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Endpoints } from 'constants/endpoints';
import { APISearchPurchaseHistory } from 'services/purchaseHistory';
import { IParamsSearchPurchaseHistory } from 'types/purchaseHistory';

export interface IInitialState {
  loading: boolean;
  total: number;
  PurchaseHistory: any[];
  totalMoney: number;
}

const initialState: IInitialState = {
  loading: false,
  total: 0,
  PurchaseHistory: [],
  totalMoney: 0,
};

export const getPurchaseHistory = createAsyncThunk(
  Endpoints.purchaseHistory.search,
  async (body: IParamsSearchPurchaseHistory, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearchPurchaseHistory(params);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const purchaseHistorySlice = createSlice({
  name: '@purchaseHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPurchaseHistory.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getPurchaseHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.total = action.payload.total;
      state.PurchaseHistory = action.payload.data;
      state.totalMoney = action.payload.totalMoney;
    });
    builder.addCase(getPurchaseHistory.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export default purchaseHistorySlice.reducer;
