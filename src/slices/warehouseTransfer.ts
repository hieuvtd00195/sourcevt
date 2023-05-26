import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Endpoints } from 'constants/endpoints';
import { APIAttachmentUpload } from 'services/attachment';
import {
  APIAcceptWarehouse,
  APIAddWarehouseTransferBill,
  APIDeleteMovingWarehouseTransfer,
  APIDeleteWarehouse,
  APIGetDetailWarehouseById,
  APISearchMovingWarehouseTransfer,
  APISearchWarehouseTransfer,
} from 'services/warehouseTransfer';
import { RootState } from 'store';
import { isEmpty } from 'lodash';

export interface WarehouseTransfer {
  warehouseTransferList: any[];
  warehouseTransferMovingList: any[];
  warehouseTransferDetail: any;
  total: number;
  loading: boolean;
  errorMessage: any;
  status: string;
  tab: string;
}

const initialState: WarehouseTransfer = {
  warehouseTransferList: [],
  warehouseTransferDetail: null,
  warehouseTransferMovingList: [],
  total: 0,
  loading: false,
  errorMessage: '',
  status: 'idle',
  tab: '0',
};

interface IError {
  error: {
    code: number | null;
    message: string;
  };
}
interface SearchParams {
  [key: string]: any;
}

interface IWarehouseTransferBillParams {
  [key: string]: any;
}

interface IPayloadCreateWarehouseTransfer {
  data: IWarehouseTransferBillParams;
  images: File[];
}

const getListWarehouseTransfer = createAsyncThunk(
  'warehouseTransfer',
  async (body: SearchParams, { rejectWithValue }) => {
    try {
      const res = await APISearchWarehouseTransfer(body);
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

const getListMovingWarehouseTransfer = createAsyncThunk(
  'getListMovingWarehouseTransfer',
  async (body: SearchParams, { rejectWithValue }) => {
    try {
      const res = await APISearchMovingWarehouseTransfer(body);
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

const deleteMovingWarehouseTransfer = createAsyncThunk(
  'deleteMovingWarehouseTransfer',
  async (id: string, { rejectWithValue }) => {
    try {
      await APIDeleteMovingWarehouseTransfer(id);
    } catch (err) {
      const errors = err as IError;
      return rejectWithValue(errors.error.message);
    }
  }
);

// Tạo Thunk đồng bộ call api post
export const CreateWarehouseTransferBill = createAsyncThunk(
  Endpoints.warehouseTransfer.create,
  async (body: IWarehouseTransferBillParams, { rejectWithValue }) => {
    try {
      const response = await APIAddWarehouseTransferBill(body);
      if (!response) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const acceptWarehouseTransferBill = createAsyncThunk(
  Endpoints.warehouseTransfer.create,
  async (body: IWarehouseTransferBillParams, { rejectWithValue }) => {
    try {
      const response = await APIAcceptWarehouse(body);
      if (!response) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const deleteWarehouseTransferBill = createAsyncThunk(
  Endpoints.warehouseTransfer.delete,
  async (id: string, { rejectWithValue }) => {
    try {
      await APIDeleteWarehouse(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const createWarehouseTransferWithFile = createAsyncThunk(
  Endpoints.warehouseTransfer.upload,
  async (
    { data, images }: IPayloadCreateWarehouseTransfer,
    { rejectWithValue }
  ) => {
    try {
      const response = await APIAddWarehouseTransferBill(data);

      if (!response) {
        return rejectWithValue(response);
      }

      if (images.length > 0) {
        await APIAttachmentUpload({
          objectId: response,
          formFiles: images,
          objectType: 2,
        });
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(error.error.message);
    }
  }
);

const getWarehouseTransferDetail = createAsyncThunk<
  IWarehouseTransferBillParams,
  string
>(Endpoints.warehouseTransfer.detail, async (id, { rejectWithValue }) => {
  try {
    const response = await APIGetDetailWarehouseById(id);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

const warehouseTransfer = createSlice({
  name: '@warehouseTransfer',
  initialState,
  reducers: {
    setTab: (state, action: PayloadAction<string>) => {
      state.tab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getListWarehouseTransfer.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getListWarehouseTransfer.fulfilled, (state, action) => {
      state.warehouseTransferList = action.payload.data;
      state.total = action.payload.total;
      state.loading = false;
    });
    builder.addCase(getListWarehouseTransfer.rejected, (state, action) => {
      state.loading = false;
    });
    //Create Warehouse Transfer Bill
    builder.addCase(createWarehouseTransferWithFile.pending, (state) => {
      // Bật trạng thái loading
      state.status = 'loading';
      state.loading = true;
    });
    builder.addCase(
      createWarehouseTransferWithFile.fulfilled,
      (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.errorMessage = null;
      }
    );

    // Khi thực hiện action  thất bại (Promise rejected)
    builder.addCase(
      createWarehouseTransferWithFile.rejected,
      (state, action) => {
        // Tắt trạng thái loading, lưu thông báo lỗi vào store
        state.loading = false;
        state.status = 'failed';

        state.errorMessage = action.error;
      }
    );

    //Accept
    builder.addCase(getWarehouseTransferDetail.pending, (state) => {
      // Bật trạng thái loading
      state.status = 'loading';
      state.loading = true;
    });
    builder.addCase(getWarehouseTransferDetail.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.warehouseTransferDetail = action.payload;
    });

    // Khi thực hiện action  thất bại (Promise rejected)
    builder.addCase(getWarehouseTransferDetail.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });

    builder.addCase(getListMovingWarehouseTransfer.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      getListMovingWarehouseTransfer.fulfilled,
      (state, action) => {
        state.warehouseTransferMovingList = action.payload.data;
        state.total = action.payload.total;
        state.loading = false;
      }
    );
    builder.addCase(
      getListMovingWarehouseTransfer.rejected,
      (state, action) => {
        state.loading = false;
      }
    );

    builder.addCase(acceptWarehouseTransferBill.pending, (state) => {
      // Bật trạng thái loading
      state.status = 'loading';
      state.loading = true;
    });
    builder.addCase(acceptWarehouseTransferBill.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
    });

    // Khi thực hiện action  thất bại (Promise rejected)
    builder.addCase(acceptWarehouseTransferBill.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error;
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

export {
  getListWarehouseTransfer,
  createWarehouseTransferWithFile,
  deleteWarehouseTransferBill,
  getWarehouseTransferDetail,
  getListMovingWarehouseTransfer,
  deleteMovingWarehouseTransfer,
};
export const { setTab } = warehouseTransfer.actions;
