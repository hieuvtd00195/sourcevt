import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  APICreateOrderTransport,
  APIDetailOrderTransportById,
  APISearchOrderTransport,
  APISearchSaleOrderByCode,
  APIUpdateOrderTransport,
} from 'services/orderTransport';
import { RootState } from 'store';
import {
  dataOrderTransport,
  OrderTransportDetail,
  OrderTransportParams,
  saleOrders,
} from 'types/orderTransport';

export interface OrderTransport {
  orderTransportList: dataOrderTransport[];
  orderTransportDetail: OrderTransportDetail | null;
  SaleOrderByCodeList: saleOrders[];
  total: number;
  loading: boolean;
}

const initialState: OrderTransport = {
  orderTransportList: [],
  orderTransportDetail: null,
  SaleOrderByCodeList: [],
  total: 0,
  loading: false,
};

interface IError {
  error: {
    code: number | null;
    message: string;
  };
}

export interface UpdateOrderTransport {
  id: string;
}

export const getListOrderTransport = createAsyncThunk<any, any>(
  'orderTransportList',
  async (body: OrderTransportParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearchOrderTransport(params);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const postCreateOrderTransport = createAsyncThunk<any, any>(
  'createOrderTransportList',
  async (body: string[], { rejectWithValue }) => {
    const response = await APICreateOrderTransport(body);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getOrderTransportById = createAsyncThunk<any, any>(
  'detailOrderTransportList',
  async (body: string, { rejectWithValue }) => {
    const response = await APIDetailOrderTransportById(body);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getListSaleOrderByCode = createAsyncThunk<any, any>(
  'saleOrderByCode',
  async (body: OrderTransportParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearchSaleOrderByCode(params);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const putUpdateOrderTransport = createAsyncThunk<any, any>(
  'updateOrderTransport',
  async (body: OrderTransportParams, { rejectWithValue }) => {
    const id = body?.orderTransportId;

    const params = {
      ...body,
    };
    delete params?.orderTransportId;

    const response = await APIUpdateOrderTransport(id, params);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);

const storeOrderTransport = createSlice({
  name: '@orderTransport',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListOrderTransport.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getListOrderTransport.fulfilled, (state, action) => {
      state.orderTransportList = action.payload.data;
      state.total = action.payload.total;
      state.loading = false;
    });
    builder.addCase(getListOrderTransport.rejected, (state, action) => {
      state.loading = false;
    });

    // add
    builder.addCase(postCreateOrderTransport.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(postCreateOrderTransport.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(postCreateOrderTransport.rejected, (state, action) => {
      state.loading = false;
    });

    //detail by id
    builder.addCase(getOrderTransportById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getOrderTransportById.fulfilled, (state, action) => {
      state.orderTransportDetail = action.payload.data;
      state.loading = false;
    });
    builder.addCase(getOrderTransportById.rejected, (state, action) => {
      state.loading = false;
    });

    //Sale Order By Code
    builder.addCase(getListSaleOrderByCode.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getListSaleOrderByCode.fulfilled, (state, action) => {
      state.SaleOrderByCodeList = action.payload.data;
      state.loading = false;
    });
    builder.addCase(getListSaleOrderByCode.rejected, (state, action) => {
      state.loading = false;
    });
  },
});
export const getOrderTransportList = (state: RootState) =>
  state.orderTransport.orderTransportList;
export const getOrderTransportTotal = (state: RootState) =>
  state.orderTransport.total;
export const getOrderTransportDetail = (state: RootState) =>
  state.orderTransport.orderTransportDetail;
export const getSaleOrderByCodeList = (state: RootState) =>
  state.orderTransport.SaleOrderByCodeList;

export default storeOrderTransport.reducer;
