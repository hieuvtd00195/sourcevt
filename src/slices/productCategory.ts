import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { APIAllProductCategory } from 'services/productCategory';
import { RootState } from 'store';
import { IProductCategory } from 'types/productCategory';

export interface ProductCategory {
  ProductCategoryList: IProductCategory[];
  loading: boolean;
}

const initialState: ProductCategory = {
  ProductCategoryList: [],
  loading: false,
};

interface IError {
  error: {
    code: number | null;
    message: string;
  };
}

export const getListProductCategory = createAsyncThunk<any, any>(
  'productCategory',
  async ({ rejectWithValue }) => {
    const response = await APIAllProductCategory();
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

const storeProductCategory = createSlice({
  name: '@storeProductCategory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListProductCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getListProductCategory.fulfilled, (state, action) => {
      state.ProductCategoryList = action.payload;
      state.loading = false;
    });
    builder.addCase(getListProductCategory.rejected, (state, action) => {
      state.loading = false;
    });
  },
});
export const getProductCategoryList = (state: RootState) =>
  state.productCategory.ProductCategoryList;

export default storeProductCategory.reducer;
