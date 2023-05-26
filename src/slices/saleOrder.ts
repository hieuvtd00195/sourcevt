import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { log } from 'console';

import { Endpoints } from 'constants/endpoints';
import {
  APIAddSaleOrder,
  APICompleteSaleOrderById,
  APIConfirmSaleOrder,
  APIDeleteSaleOrder,
  APIGetDetailSaleOrderById,
  APIGetDetailSaleOrderConfirmById,
  APISearchSaleOrder,
  APIUpdateSaleOrder,
} from 'services/saleOrder';
import { RootState } from 'store';
import {
  IResponseSaleOrder,
  ISaleOrderParams,
  SaleOrder,
  IUpdateSaleOrder,
  ConfirmSaleOrderDetail,
} from 'types/saleorder';

interface SearchSaleOrderParams {
  orderBy: string | null;
  orderDirection: string | null;
  pageIndex: number;
  pageSize: number;
  code: string | null;
  supplierId: string | null;
  storeId: string | null;
  status: string | null;
  fromDate: string | null;
  toDate: string | null;
  supplierName: string | null;
}
interface ConfirmParams {
  [key: string]: any;
}

export interface SaleOrderState {
  SaleOrderList: SaleOrder[];
  SaleOrderDetail: SaleOrder | null;
  SaleOrderDetailConfirm: ConfirmSaleOrderDetail;
  loading: boolean;
  errorMessage: any;
  status: string;
  total: number;
}

const initialState: SaleOrderState = {
  SaleOrderList: [],
  SaleOrderDetail: null,
  SaleOrderDetailConfirm: {},
  loading: false,
  errorMessage: '',
  status: 'idle',
  total: 0,
};

// Tạo Thunk đồng bộ call api get
export const getListSaleOrderApi = createAsyncThunk(
  Endpoints.accountings.search,
  async (body: SearchSaleOrderParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearchSaleOrder(params);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);
// Tạo Thunk đồng bộ call api post
export const CreateSaleOrderApi = createAsyncThunk(
  Endpoints.saleorders.create,
  async (body: ISaleOrderParams, { rejectWithValue }) => {
    try {
      const response = await APIAddSaleOrder(body);
      if (!response) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const GetSaleOrderByIdApi = createAsyncThunk<IResponseSaleOrder, string>(
  Endpoints.saleorders.getById,
  async (id, { rejectWithValue }) => {
    try {
      const response = await APIGetDetailSaleOrderById(id);
      if (!response) {
        return rejectWithValue(response);
      }
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const UpdateSaleOrderApi = createAsyncThunk(
  Endpoints.saleorders.update,
  async (body: IUpdateSaleOrder, { rejectWithValue }) => {
    const response = await APIUpdateSaleOrder(body);

    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);
export const deleteSaleOrder = createAsyncThunk(
  'delete saleorder',
  async (id: string, { rejectWithValue }) => {
    try {
      await APIDeleteSaleOrder(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const GetSaleOrderConfirmByIdApi = createAsyncThunk<ConfirmSaleOrderDetail, string>(
  'getSaleOrderConfirmById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await APIGetDetailSaleOrderConfirmById(id);
      if (!response) {
        return rejectWithValue(response);
      }
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const conFirmSaleOrderApi = createAsyncThunk(
  'confirmSaleOrder',
  async (body: ConfirmParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APIConfirmSaleOrder(params);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const CompleteSaleOrderByIdApi = createAsyncThunk<ConfirmSaleOrderDetail, string>(
  'completeSaleOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await APICompleteSaleOrderById(id);
      if (!response) {
        return rejectWithValue(response);
      }
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const saleOrderSlice = createSlice({
  name: '@saleOrder',
  initialState,
  reducers: {
    // getListEntry: (state, action: PayloadAction<Entry[]>) => {
    //   state.EntryList = action.payload as Entry[];
    // },
  },
  extraReducers: (builder) => {
    // Bắt đầu thực hiện action  (Promise pending)
    builder.addCase(getListSaleOrderApi.pending, (state) => {
      // Bật trạng thái loading
      state.status = 'loading';
      state.loading = true;
    });

    // Khi thực hiện action  thành công (Promise fulfilled)
    builder.addCase(getListSaleOrderApi.fulfilled, (state, action) => {
      // Tắt trạng thái loading, lưu thông tin entry vào store
      state.status = 'succeeded';
      state.loading = false;
      state.total = action.payload.total;
      state.SaleOrderList = action.payload.data;
    });
    builder.addCase(getListSaleOrderApi.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });

    //Create Sale Order
    builder.addCase(CreateSaleOrderApi.pending, (state) => {
      // Bật trạng thái loading
      state.status = 'loading';
      state.loading = true;
    });
    builder.addCase(CreateSaleOrderApi.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
    });

    // Khi thực hiện action  thất bại (Promise rejected)
    builder.addCase(CreateSaleOrderApi.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error;
    });

    //Create Sale Order
    builder.addCase(GetSaleOrderByIdApi.pending, (state) => {
      // Bật trạng thái loading
      state.status = 'loading';
      state.loading = true;
    });
    builder.addCase(GetSaleOrderByIdApi.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.SaleOrderDetail = action.payload;
    });

    // Khi thực hiện action  thất bại (Promise rejected)
    builder.addCase(GetSaleOrderByIdApi.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });

    //Update Sale Order
    builder.addCase(UpdateSaleOrderApi.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
    });
    builder.addCase(UpdateSaleOrderApi.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
    });
    builder.addCase(UpdateSaleOrderApi.rejected, (state, action) => {
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });

    //Create Sale Order
    builder.addCase(GetSaleOrderConfirmByIdApi.pending, (state) => {
      // Bật trạng thái loading
      state.status = 'loading';
      state.loading = true;
    });
    builder.addCase(GetSaleOrderConfirmByIdApi.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.SaleOrderDetailConfirm = action.payload;
    });

    // Khi thực hiện action  thất bại (Promise rejected)
    builder.addCase(GetSaleOrderConfirmByIdApi.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });

    builder.addCase(conFirmSaleOrderApi.pending, (state) => {
      // Bật trạng thái loading
      state.status = 'loading';
      state.loading = true;
    });
    builder.addCase(conFirmSaleOrderApi.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      // state.SaleOrderDetailConfirm = action.payload;
    });

    // Khi thực hiện action  thất bại (Promise rejected)
    builder.addCase(conFirmSaleOrderApi.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });

    builder.addCase(CompleteSaleOrderByIdApi.pending, (state) => {
      // Bật trạng thái loading
      state.status = 'loading';
      state.loading = true;
    });
    builder.addCase(CompleteSaleOrderByIdApi.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      // state.SaleOrderDetailConfirm = action.payload;
    });

    // Khi thực hiện action  thất bại (Promise rejected)
    builder.addCase(CompleteSaleOrderByIdApi.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });
  },
});

export const { } = saleOrderSlice.actions;
// Lấy data theo state
export const getSaleOrderList = (state: RootState) =>
  state.saleOrder.SaleOrderList;
export const getSaleOrderListTotal = (state: RootState) =>
  state.saleOrder.total;
export const getSaleOrderbyId = (state: RootState) =>
  state.saleOrder.SaleOrderDetail;
export const getSaleOrderConfirmbyId = (state: RootState) =>
  state.saleOrder.SaleOrderDetailConfirm;

export default saleOrderSlice.reducer;
