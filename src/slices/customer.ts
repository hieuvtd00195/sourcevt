import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Endpoints } from 'constants/endpoints';
import {
  APIAllCustomerByCustomerType,
  APICustomerSearchByNameOrPhone,
  APISearchCustomer,
} from 'services/customer';
import {
  ICustomer,
  ICustomerByType,
  ICustomerSelect,
  IResSearchCustomer,
  ISearchCustomer,
} from 'types/customer';
import { RootState } from 'store';

interface IInitialState {
  customerList: ICustomerSelect[];
  loading: boolean;
  customers: ICustomer[];
  allCustomersByType: ICustomerByType[];
  total: number;
}

const initialState: IInitialState = {
  customerList: [],
  loading: false,
  customers: [],
  allCustomersByType: [],
  total: 0,
};

const getCustomerSelectApi = createAsyncThunk<any, any>(
  Endpoints.customer.getCustomerSelectApi,
  async (nameOrPhone: string, { rejectWithValue }) => {
    try {
      const res = await APICustomerSearchByNameOrPhone(nameOrPhone);

      if (!res) {
        return rejectWithValue(res);
      }
      return res as ICustomerSelect[];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const getCustomerListApi = createAsyncThunk(
  Endpoints.customer.getCustomerListApi,
  async (filters: ISearchCustomer, { rejectWithValue }) => {
    try {
      const res = await APISearchCustomer(filters);

      if (!res) {
        return rejectWithValue(res);
      }
      return res as IResSearchCustomer;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllCustomerByTypeApi = createAsyncThunk(
  'allCustomerByType',
  async (body: number, { rejectWithValue }) => {
    const params = body;
    const response = await APIAllCustomerByCustomerType(params);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);

const customerSlice = createSlice({
  name: '@customer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCustomerSelectApi.pending, (state) => {});

    builder.addCase(
      getCustomerSelectApi.fulfilled,
      (state, action: PayloadAction<ICustomerSelect[]>) => {
        state.customerList = action.payload;
      }
    );
    builder.addCase(getCustomerSelectApi.rejected, (state, action) => {});

    builder.addCase(getCustomerListApi.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      getCustomerListApi.fulfilled,
      (state, action: PayloadAction<IResSearchCustomer>) => {
        state.loading = false;
        state.customers = action.payload.data;
        state.total = action.payload.total;
      }
    );
    builder.addCase(getCustomerListApi.rejected, (state, action) => {
      state.loading = false;
    });

    // get all customer by type
    builder.addCase(getAllCustomerByTypeApi.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllCustomerByTypeApi.fulfilled, (state, action) => {
      state.allCustomersByType = action.payload.data;
      state.loading = false;
    });
    builder.addCase(getAllCustomerByTypeApi.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export const CustomerSearchByNameOrPhone = (state: RootState) =>
  state.customer.customerList;

export const getAllCustomerByType = (state: RootState) =>
  state.customer.allCustomersByType;

export default customerSlice.reducer;

export { getCustomerSelectApi, getCustomerListApi };
