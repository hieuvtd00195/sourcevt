import { RootState } from 'store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { OrderTransportType, StoreType } from 'types/saleOrderTransport';
import { APICreateTransport, APISearchOrderTransportList, APIgetListCustomer, APIgetStoreList } from 'services/saleOrderTransport';
import { AnimationType } from 'devextreme/animation/fx';


interface SearchParams {
  [key: string]: any;
}
export interface SaleOrderTransportState {
  StoreList: StoreType[];
  CustomerList: StoreType[];
  OrderTransportList: OrderTransportType[];
  loading: boolean;
  errorMessage: any;
  status: string;
  total: number;
}

const initialState: SaleOrderTransportState = {
  StoreList: [],
  CustomerList: [],
  OrderTransportList: [],
  loading: false,
  errorMessage: '',
  status: 'idle',
  total: 0,
};

export const getListStore = createAsyncThunk<any, any>(
  'saleOrderTransport/getStore',
  async ({ rejectWithValue }) => {
    const response = await APIgetStoreList();
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getListCustomer = createAsyncThunk<any, any>(
  'saleOrderTransport/getCustomer',
  async (body: SearchParams, { rejectWithValue }) => {
    const response = await APIgetListCustomer(body);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);


export const createTransport = createAsyncThunk<any, any>(
  'saleOrderTransport/createTransport',
  async (body: SearchParams, { rejectWithValue }) => {
    const response = await APICreateTransport(body);

    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getListOrderTransport = createAsyncThunk<any, any>(
  'saleOrderTransport/getListOrderTransport',
  async (body: SearchParams, { rejectWithValue }) => {
    const response = await APISearchOrderTransportList(body);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const saleOrderSlice = createSlice({
  name: '@saleOrderTransport',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListStore.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
    });

    builder.addCase(getListStore.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.StoreList = action.payload;
    });
    builder.addCase(getListStore.rejected, (state, action) => {
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });
    builder.addCase(getListOrderTransport.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
    });

    builder.addCase(getListOrderTransport.fulfilled, (state, action) => {


      console.log('action', action);

      state.status = 'succeeded';
      state.loading = false;
      state.OrderTransportList = action.payload.data;
      state.total = action.payload.total;
    });
    builder.addCase(getListOrderTransport.rejected, (state, action) => {
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });

    builder.addCase(getListCustomer.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
    });

    builder.addCase(getListCustomer.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.CustomerList = action.payload.data;
    });
    builder.addCase(getListCustomer.rejected, (state, action) => {
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });


    builder.addCase(createTransport.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
    });
    builder.addCase(createTransport.fulfilled,
      (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.errorMessage = null;
      }
    );

    builder.addCase(createTransport.rejected,
      (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.errorMessage = action.error;
      }
    );
  },
});

export const { } = saleOrderSlice.actions;

export const getStoreList = (state: RootState) =>
  state.saleOrderTransport.StoreList;

export const getCustomerListAll = (state: RootState) =>
  state.saleOrderTransport.CustomerList;

export const getOrderTransport = (state: RootState) =>
  state.saleOrderTransport.OrderTransportList;

export const getOrderTransportTotal = (state: RootState) =>
  state.saleOrderTransport.total;


export default saleOrderSlice.reducer;
