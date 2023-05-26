import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Endpoints } from 'constants/endpoints';
import { APIAddSaleOrderReturn, APIGetSaleOrderReturnById, APISearchSaleOrderReturn, APIUpdateSaleOrderReturn } from 'services/saleOrderReturn';
import { RootState } from 'store';
import { SaleOrderReturn, SaleOrderReturnParams } from 'types/saleOrderReturn';

export interface SaleOrderReturnState {
  SaleOrderReturnList: SaleOrderReturn[];
  SaleOrderReturnDetail: SaleOrderReturn[];
  loading: boolean;
  errorMessage: any;
  status: string;
  total: number;
}

const initialState: SaleOrderReturnState = {
  SaleOrderReturnList: [],
  SaleOrderReturnDetail: [],
  loading: false,
  errorMessage: '',
  status: 'idle',
  total: 0,
};

export const getListSaleOrderReturn = createAsyncThunk(
  Endpoints.saleOrderReturn.search,
  async (body: SaleOrderReturnParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearchSaleOrderReturn(params);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);


export const CreateSaleOrderReturnApi = createAsyncThunk(
  'createSaleOrderReturn',
  async (body: SaleOrderReturnParams, { rejectWithValue }) => {
    try {
      const response = await APIAddSaleOrderReturn(body);
      if (!response) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error: any) {

      console.log('error', error);

      return rejectWithValue(error.response.data.message);
    }
  }
);

export const GetSaleOrderReturnByIdApi = createAsyncThunk('getSaleOrderReturnByIdApi', async (id: string, { rejectWithValue }) => {
  try {
    const response = await APIGetSaleOrderReturnById(id);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});


export const UpdateSaleOrderReturnApi = createAsyncThunk(
  'updateSaleOrderReturn',
  async (body: SaleOrderReturnParams, { rejectWithValue }) => {
    try {
      const response = await APIUpdateSaleOrderReturn(body);
      if (!response) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error: any) {

      console.log('error', error);

      return rejectWithValue(error.response.data.message);
    }
  }
);


export const saleOrderReturnSlice = createSlice({
  name: '@saleOrderReturn',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListSaleOrderReturn.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
    });

    builder.addCase(getListSaleOrderReturn.fulfilled, (state, action) => {
      state.status = 'succeeded';

      console.log('action', action);

      state.loading = false;
      state.total = action.payload.data.total;
      state.SaleOrderReturnList = action.payload.data;
    });
    builder.addCase(getListSaleOrderReturn.rejected, (state, action) => {
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });


    //Create Sale Order return
    builder.addCase(CreateSaleOrderReturnApi.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
    });
    builder.addCase(CreateSaleOrderReturnApi.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
    });

    builder.addCase(CreateSaleOrderReturnApi.rejected, (state, action) => {
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error;
    });


    //Detail
    builder.addCase(GetSaleOrderReturnByIdApi.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(GetSaleOrderReturnByIdApi.fulfilled, (state, action) => {
      state.loading = false;
      state.SaleOrderReturnDetail = action.payload;
    });
    builder.addCase(GetSaleOrderReturnByIdApi.rejected, (state, action) => {
      state.loading = false;
    });

    //Update
    builder.addCase(UpdateSaleOrderReturnApi.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
    });
    builder.addCase(UpdateSaleOrderReturnApi.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
    });

    builder.addCase(UpdateSaleOrderReturnApi.rejected, (state, action) => {
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error;
    });

  },
});

export const listOrderReturn = (state: RootState) => state.saleOrderReturn.SaleOrderReturnList;
export const orderReturnTotal = (state: RootState) => state.saleOrderReturn.total;
export const getSaleOrderReturnDetail = (state: RootState) =>
  state.saleOrderReturn.SaleOrderReturnDetail;

export default saleOrderReturnSlice.reducer;
