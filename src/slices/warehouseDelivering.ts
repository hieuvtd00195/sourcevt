import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  APIDeleteWarehouseTransferMoving,
  APIExportWarehouseTransferMoving,
  APIGetWarehouseTransferMoving,
  APISearchWarehouseTransferMoving,
} from 'services/warehouseDelivering';
import { RootState } from 'store';
import { HttpResponse } from 'types/common';
import {
  IResGetWarehouseTransferMoving,
  IResSearchWarehouseTransferMoving,
  ISearchWarehouseTransferMoving,
  WarehouseTransferMoving,
} from 'types/warehouseDelivering';

export interface WarehouseTransfer {
  WarehouseTransferMovingList: WarehouseTransferMoving[];
  total: number;
  loading: boolean;
  selected: WarehouseTransferMoving[];
}

const initialState: WarehouseTransfer = {
  WarehouseTransferMovingList: [],
  total: 0,
  loading: false,
  selected: [],
};

const searchWarehouseTransferMoving = createAsyncThunk(
  'searchWarehouseTransferMoving',
  async (body: ISearchWarehouseTransferMoving, { rejectWithValue }) => {
    try {
      const res = await APISearchWarehouseTransferMoving(body);

      if (!res) {
        return rejectWithValue(res);
      }
      return res as IResSearchWarehouseTransferMoving;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const exportWarehouseTransferMoving = createAsyncThunk(
  'exportWarehouseTransferMoving',
  async (body: ISearchWarehouseTransferMoving, { rejectWithValue }) => {
    try {
      const res = await APIExportWarehouseTransferMoving(body);

      if (!res) {
        return rejectWithValue(res);
      }
      return res as any;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const getWarehouseTransferMoving = createAsyncThunk(
  'getWarehouseTransferMoving',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await APIGetWarehouseTransferMoving(id);

      if (!res) {
        return rejectWithValue(res);
      }
      return res as IResGetWarehouseTransferMoving;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const deleteWarehouseTransferMoving = createAsyncThunk(
  'deleteWarehouseTransferMoving',
  async (id: string, { rejectWithValue }) => {
    try {
      await APIDeleteWarehouseTransferMoving(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const warehouseTransfer = createSlice({
  name: '@warehouseTransfer',
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<WarehouseTransferMoving[]>) => {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    // searchWarehouseTransferMoving
    builder.addCase(searchWarehouseTransferMoving.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      searchWarehouseTransferMoving.fulfilled,
      (state, action: PayloadAction<IResSearchWarehouseTransferMoving>) => {
        state.WarehouseTransferMovingList = action.payload.data;
        state.total = action.payload.total;
        state.loading = false;
      }
    );
    builder.addCase(searchWarehouseTransferMoving.rejected, (state, action) => {
      state.loading = false;
    });
  },
});
export const getWarehouseTransferList = (state: RootState) =>
  state.warehouseTransfer.warehouseTransferList;
export const getWarehouseTransferTotal = (state: RootState) =>
  state.warehouseTransfer.total;
export const getWarehouseTransferMovingList = (state: RootState) =>
  state.warehouseTransfer.warehouseTransferMovingList;

export default warehouseTransfer.reducer;
export const { setSelected } = warehouseTransfer.actions;

export {
  searchWarehouseTransferMoving,
  getWarehouseTransferMoving,
  deleteWarehouseTransferMoving,
  exportWarehouseTransferMoving,
};
