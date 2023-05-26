import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Endpoints } from 'constants/endpoints';
import {
  APIGetByIdDebtSupplierDetail,
  APISearchDebtSupplier,
  IResAPISearchDebtSupplier,
} from 'services/debtSupplier';
import { RootState } from 'store';
import { DebtSupplier, SearchDebtSupplierParams } from 'types/debtSupplier';


interface SearchDebtSupplierDetailParams {
  orderBy: string | null;
  orderDirection: string | null;
  pageIndex: number | null;
  pageSize: number | null;
  parentId: string | null;
  parentCode: string | null;
  documentCode: string | null;
  ticketType: number | null;
  start: Date | null;
  end: Date | null;
  note: string | null;
}

export interface DebtSupplierState {
  DebtSupplierList: DebtSupplier[];
  total: number;
  loading: boolean;
  ndt: number;
  type: 1 | 2 | 3 | null;
  status: string | null;
  debtSupplierDetail: any[];
  errorMessage: string | null;
}

const initialState: DebtSupplierState = {
  DebtSupplierList: [],
  total: 0,
  loading: false,
  ndt: 0,
  type: null,
  status: null,
  debtSupplierDetail: [],
  errorMessage: null
};

const getListDebtSupplierApi = createAsyncThunk(
  Endpoints.debtSupplier.search,
  async (body: SearchDebtSupplierParams, { rejectWithValue }) => {
    try {
      const res = await APISearchDebtSupplier(body);

      if (!res) {
        return rejectWithValue(res);
      }
      return { ...res, type: body.type } as IResAPISearchDebtSupplier;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const getListDebtSupplierDetailApi = createAsyncThunk(
  Endpoints.debtSupplier.detail,
  async (body: SearchDebtSupplierDetailParams, { rejectWithValue }) => {
    const response = await APIGetByIdDebtSupplierDetail(body);

    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);

const debtSupplierSlice = createSlice({
  name: '@debtSupplier',
  initialState,
  reducers: {
    setNDT: (state, action: PayloadAction<number>) => {
      state.ndt = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getListDebtSupplierApi.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      getListDebtSupplierApi.fulfilled,
      (state, action: PayloadAction<IResAPISearchDebtSupplier>) => {
        state.DebtSupplierList = action.payload.data;
        state.total = action.payload.total;
        state.loading = false;
        state.type = action.payload.type;
      }
    );
    builder.addCase(getListDebtSupplierApi.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(getListDebtSupplierDetailApi.pending, (state) => {
      // Bật trạng thái loading
      state.status = 'loading';
      state.loading = true;
    });

    // Khi thực hiện action  thành công (Promise fulfilled)
    builder.addCase(getListDebtSupplierDetailApi.fulfilled, (state, action) => {
      // Tắt trạng thái loading, lưu thông tin entry vào store
      state.status = 'succeeded';
      state.loading = false;
      state.total = action.payload.total;
      state.debtSupplierDetail = action.payload.data;
    });

    // Khi thực hiện action  thất bại (Promise rejected)
    builder.addCase(getListDebtSupplierDetailApi.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.loading = false;
      state.status = 'failed';
      // state.errorMessage = action.error.message;
    });
  },
});

export default debtSupplierSlice.reducer;

export const getListDebtSupplierDetail = (state: RootState) => state.debtSupplier.debtSupplierDetail;
export const getListDebtSupplierDetailTotal = (state: RootState) => state.debtSupplier.total;

export const { setNDT } = debtSupplierSlice.actions;
export { getListDebtSupplierApi, getListDebtSupplierDetailApi };
