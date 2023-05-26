import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Endpoints } from 'constants/endpoints';
import { RootState } from 'store';
import { APISearchInventory } from 'services/inventory';
import { Inventory, InventoryParams } from 'types/inventory';

export interface InventoryState {
  InventoryList: Inventory[];
  Store: Inventory[];
  loading: boolean;
  errorMessage: any;
  status: string;
  total: number;
}

const initialState: InventoryState = {
  InventoryList: [],
  Store: [],
  loading: false,
  errorMessage: '',
  status: 'idle',
  total: 0,
};

export const getListInventory = createAsyncThunk(
  Endpoints.inventory.search,
  async (body: InventoryParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearchInventory(params);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const inventorySlice = createSlice({
  name: '@inventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListInventory.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
    });

    builder.addCase(getListInventory.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.total = action.payload.total;
      state.InventoryList = action.payload.data;
      state.Store = action.payload.stores;
    });
    builder.addCase(getListInventory.rejected, (state, action) => {
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });
  },
});

export const listInventory = (state: RootState) => state.inventory.InventoryList;
export const storeInventory = (state: RootState) => state.inventory.Store;
export const inventoryTotal = (state: RootState) => state.inventory.total;

export default inventorySlice.reducer;
