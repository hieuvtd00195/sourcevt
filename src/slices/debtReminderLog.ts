import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Endpoints } from 'constants/endpoints';
import { APIGetListDebtReminderHistory } from 'services/debtReminderLog';
import { IDebtReminderLog, IParamsGetListDebtReminderHistory, IResGetListDebtReminderHistory } from 'types/debtReminderLog';
 

export interface IInitialState {
  DebtReminderLogList: IDebtReminderLog[];
  total: number;
  loading: boolean;
}

const initialState: IInitialState = {
  DebtReminderLogList: [],
  total: 0,
  loading: false,
};

const getListDebtReminderLogApi = createAsyncThunk(
  Endpoints.debtReminderLog.search,
  async (body: IParamsGetListDebtReminderHistory, { rejectWithValue }) => {
    try {
      const res = await APIGetListDebtReminderHistory(body);

      if (!res) {
        return rejectWithValue(res);
      }
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const debtReminderLogSlice = createSlice({
  name: '@debtReminderLog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListDebtReminderLogApi.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      getListDebtReminderLogApi.fulfilled,
      (state, action: PayloadAction<IResGetListDebtReminderHistory>) => {
        state.DebtReminderLogList = action.payload.data;
        state.total = action.payload.total || 0;
        state.loading = false;
      }
    );
    builder.addCase(getListDebtReminderLogApi.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export default debtReminderLogSlice.reducer;

export { getListDebtReminderLogApi };

