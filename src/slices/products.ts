import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Endpoints } from 'constants/endpoints';
import { RootState } from 'store';
import { Product, ProductParams } from 'types/products';
import { APICreateProduct, APISearcProduct } from 'services/products';

export interface ProductsState {
  ProductList: Product[];
  ProductCreate: ProductParams;
  loading: boolean;
  errorMessage: any;
  status: string;
  total: number;
}

const initialState: ProductsState = {
  ProductList: [],
  ProductCreate: {},
  loading: false,
  errorMessage: '',
  status: 'idle',
  total: 0,
};

export const getListProduct = createAsyncThunk(
  Endpoints.products.search,
  async (body: ProductParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearcProduct(params);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const createProductAPi = createAsyncThunk(
  'createProduct',
  async (body: ProductParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APICreateProduct(params);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);
export const productsSlice = createSlice({
  name: '@products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListProduct.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
    });

    builder.addCase(getListProduct.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.total = action.payload.total;
      state.ProductList = action.payload.data;
    });
    builder.addCase(getListProduct.rejected, (state, action) => {
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });
    builder.addCase(createProductAPi.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
    });

    builder.addCase(createProductAPi.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.ProductCreate = action.payload.data;
    });
    builder.addCase(createProductAPi.rejected, (state, action) => {
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });
  },
});

export const {} = productsSlice.actions;
export const getProductsList = (state: RootState) => state.products.ProductList;

export default productsSlice.reducer;
