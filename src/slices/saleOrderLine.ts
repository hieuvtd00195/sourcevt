import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  APISearchSaleOrderLine,
  APIUpdatePriceSaleOrderLine,
} from 'services/saleOrderLine';
import { RootState } from 'store';
import { SaleOrderLineParams, saleOrderLine } from 'types/saleOrderLine';

export interface SaleOrderLine {
  saleOrderLineList: saleOrderLine[];
  total: number;
  loading: boolean;
}

const initialState: SaleOrderLine = {
  saleOrderLineList: [],
  total: 0,
  loading: false,
};

interface IError {
  error: {
    code: number | null;
    message: string;
  };
}

export const getListSaleOrderLine = createAsyncThunk<any, any>(
  'saleOrderLineList',
  async (body: SaleOrderLineParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearchSaleOrderLine(params);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const updatePriceSaleOrderLine = createAsyncThunk<any, any>(
  'saleOrderLineUpadtePrice',
  async (body: SaleOrderLineParams, { rejectWithValue }) => {
    const saleOrderLineId = body?.saleOrderLineId;
    const params = {
      suggestPrice: body?.suggestPrice,
    };
    const response = await APIUpdatePriceSaleOrderLine(saleOrderLineId, params);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

const storeSaleOrderLine = createSlice({
  name: '@saleOrderLine',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListSaleOrderLine.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getListSaleOrderLine.fulfilled, (state, action) => {
      state.saleOrderLineList = action.payload.data;
      state.total = action.payload.total;
      state.loading = false;
    });
    builder.addCase(getListSaleOrderLine.rejected, (state, action) => {
      state.loading = false;
    });

    // Update price
    builder.addCase(updatePriceSaleOrderLine.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updatePriceSaleOrderLine.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(updatePriceSaleOrderLine.rejected, (state, action) => {
      state.loading = false;
    });
  },
});
export const getSaleOrderLineList = (state: RootState) =>
  state.saleOrderLine.saleOrderLineList;
export const getSaleOrderLineTotal = (state: RootState) =>
  state.saleOrderLine.total;

export default storeSaleOrderLine.reducer;
