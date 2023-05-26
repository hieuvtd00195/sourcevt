import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  APISearchShipperTransport,
  APITransportById,
  APIUpdateShipperTransport,
  APIUpdateStatusTransport,
} from 'services/transportApplication';
import {
  IDataShipperTransport,
  IDataTransportById,
  ITransportByIdParams,
  IUpdateShipperTransport,
} from 'types/transportApplication';
import { RootState } from 'store';

export interface transportApplication {
  shipperTransportList: IDataShipperTransport[];
  dataTransportById: IDataTransportById | null;
  total: number;
  loading: boolean;
}

const initialState: transportApplication = {
  shipperTransportList: [],
  dataTransportById: null,
  total: 0,
  loading: false,
};

interface IError {
  error: {
    code: number | null;
    message: string;
  };
}

export const getListShipperTransport = createAsyncThunk<any, any>(
  'shipperTransport',
  async ({ rejectWithValue }) => {
    const response = await APISearchShipperTransport();
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const putUpdateShipperTransport = createAsyncThunk<any, any>(
  'updateShipperTransport',
  async (body: any, { rejectWithValue }) => {
    const id = body?.id;
    const params = {
      id: body?.idShipper,
      code: body?.code,
      name: body?.name,
      phone: body?.phone,
    };

    const response = await APIUpdateShipperTransport(id, params);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const putUpdateStatusTransport = createAsyncThunk<any, any>(
  'updateStatusTransport',
  async (body: any, { rejectWithValue }) => {
    const id = body?.id;
    const status = body?.status;

    const response = await APIUpdateStatusTransport(id, status);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getTransportById = createAsyncThunk<any, any>(
  'transportById',
  async (body: ITransportByIdParams, { rejectWithValue }) => {
    const params = { ...body };
    const response = await APITransportById(params);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

const transportApplication = createSlice({
  name: '@transportApplication',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Shipper Transport
    builder.addCase(getListShipperTransport.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getListShipperTransport.fulfilled, (state, action) => {
      state.loading = false;
      state.shipperTransportList = action.payload.data;
    });
    builder.addCase(getListShipperTransport.rejected, (state, action) => {
      state.loading = false;
    });

    // update shipper
    builder.addCase(putUpdateShipperTransport.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(putUpdateShipperTransport.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(putUpdateShipperTransport.rejected, (state, action) => {
      state.loading = false;
    });

    // update status
    builder.addCase(putUpdateStatusTransport.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(putUpdateStatusTransport.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(putUpdateStatusTransport.rejected, (state, action) => {
      state.loading = false;
    });

    // Transport by id
    builder.addCase(getTransportById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTransportById.fulfilled, (state, action) => {
      state.loading = false;
      state.dataTransportById = action.payload;
    });
    builder.addCase(getTransportById.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export const getShipperTransportList = (state: RootState) =>
  state.transportApplication.shipperTransportList;
export const getDataTransportById = (state: RootState) =>
  state.transportApplication.dataTransportById;
export default transportApplication.reducer;
