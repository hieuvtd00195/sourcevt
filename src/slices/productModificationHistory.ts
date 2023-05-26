import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Endpoints } from 'constants/endpoints';
import { searchProductModificationHistory } from 'views/Products/EditHistory/utils/services';
import {
  IProductModificationHistory,
  IResAPIProductModificationHistory,
  ISearchProductModificationHistory,
} from 'views/Products/EditHistory/utils/type';

interface IInitialState {
  productModificationHistoryList: IProductModificationHistory[];
  loading: boolean;
  total: number;
}

const initialState: IInitialState = {
  productModificationHistoryList: [],
  loading: false,
  total: 0,
};

const searchProductModificationHistoryApi = createAsyncThunk(
  Endpoints.productModificationHistory.search,
  async (body: ISearchProductModificationHistory, { rejectWithValue }) => {
    try {
      const res = await searchProductModificationHistory(body);

      if (!res) {
        return rejectWithValue(res);
      }
      return res as IResAPIProductModificationHistory;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const productModificationHistorySlice = createSlice({
  name: '@productModificationHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(searchProductModificationHistoryApi.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      searchProductModificationHistoryApi.fulfilled,
      (state, action: PayloadAction<IResAPIProductModificationHistory>) => {
        state.loading = false;
        state.productModificationHistoryList = action.payload.data;
        state.total = action.payload.total;
      }
    );
    builder.addCase(
      searchProductModificationHistoryApi.rejected,
      (state, action) => {
        state.loading = false;
      }
    );
  },
});

export default productModificationHistorySlice.reducer;
export { searchProductModificationHistoryApi };
