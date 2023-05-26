import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { APICodeNameProductApplication } from 'services/productApplication';
import { RootState } from 'store';
import { IDataProductApplication } from 'types/productApplication';

export interface StoreApplication {
  ProductApplicationList: IDataProductApplication[];
  loading: boolean;
}

const initialState: StoreApplication = {
  ProductApplicationList: [],
  loading: false,
};

interface IError {
  error: {
    message: string;
  };
}

export const getListProductApplication = createAsyncThunk<any, any>(
  'productApplication',
  async ({ rejectWithValue }) => {
    try {
      const res = await APICodeNameProductApplication();

      if (!res) {
        return rejectWithValue(res);
      }
      return res;
    } catch (err) {
      const errors = err as IError;
      return rejectWithValue(errors.error.message);
    }
  }
);

const productApplication = createSlice({
  name: '@productApplication',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListProductApplication.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getListProductApplication.fulfilled, (state, action) => {
      state.loading = false;
      state.ProductApplicationList = action.payload;
    });
    builder.addCase(getListProductApplication.rejected, (state, action) => {
      state.loading = false;
    });
  },
});
export const getProductApplicationList = (state: RootState) =>
  state.productApplication.ProductApplicationList;

export default productApplication.reducer;
