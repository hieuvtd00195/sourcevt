import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  APIGetWareHousingBillLogById,
  APISearchWareHousingBillLogs,
} from 'services/warehousingBillLogsAppication';
import { RootState } from 'store';
import { WarehousingBillLogs } from 'types/warehousingBillLogs';

interface WarehousingBillLogsParams {
  [key: string]: any;
}

interface WarehousingBillLogById {
  [key: string]: any;
}

export interface WarehousingBillLogsStore {
  WarehousingBillLogsList: WarehousingBillLogs[];
  WarehousingBillLogsDetail: WarehousingBillLogById;
  loading: boolean;
  total: number;
  status: string;
}

const initialState: WarehousingBillLogsStore = {
  WarehousingBillLogsList: [],
  WarehousingBillLogsDetail: {},
  loading: false,
  total: 0,
  status: 'idle',
};

interface IError {
  error: {
    message: string;
  };
}

export const getListWarehousingBillLogs = createAsyncThunk<any, any>(
  'warehousingBillLogs',
  async (body: WarehousingBillLogsParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearchWareHousingBillLogs(params);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getWarehousingBillLogById = createAsyncThunk<any, any>(
  'detailWarehousingBillLog',
  async (body: WarehousingBillLogsParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APIGetWareHousingBillLogById(params);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

const warehousingBillLogsAppication = createSlice({
  name: '@warehousingBillLogsAppication',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListWarehousingBillLogs.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getListWarehousingBillLogs.fulfilled, (state, action) => {
      state.loading = false;
      state.WarehousingBillLogsList = action.payload.data;
      state.total = action.payload.total;
    });
    builder.addCase(getListWarehousingBillLogs.rejected, (state, action) => {
      state.loading = false;
    });

    // detail
    builder.addCase(getWarehousingBillLogById.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getWarehousingBillLogById.fulfilled, (state, action) => {
      state.loading = false;
      state.WarehousingBillLogsDetail = action.payload;
    });
    builder.addCase(getWarehousingBillLogById.rejected, (state, action) => {
      state.loading = false;
    });
  },
});
export const getWarehousingBillLogsList = (state: RootState) =>
  state.warehousingBillLogsAppication.WarehousingBillLogsList;
export const getWarehousingBillLogsTotal = (state: RootState) =>
  state.warehousingBillLogsAppication.total;
export const getWarehousingBillLogsById = (state: RootState) =>
  state.warehousingBillLogsAppication.WarehousingBillLogsDetail;

export default warehousingBillLogsAppication.reducer;
