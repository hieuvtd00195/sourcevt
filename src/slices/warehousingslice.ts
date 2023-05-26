import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  APIGetWareHousingBillById,
  APISearchProductWareHousingBill,
  APIUpdateWareHousingBillById,
  APIDetailProductWareHousingBill,
  APIEditProductWareHousingBill,
  APIWarehousingProductDelete,
} from 'services/warehousingbill';
import {
  APICreateWareHousingBill,
  APISearcWareHousingBill,
} from 'services/warehousingbill';
import { RootState } from 'store';

export interface WareHousingBill {
  [key: string]: any;
}
export interface WareHousingBillResponse {
  data: WareHousingBill[];
  detailWareHousingBill: WareHousingBill;
  total: number;
}
interface WareHousingBillParams {
  [key: string]: any;
}
export interface WareHousingBillStore {
  WareHousingBillList: WareHousingBillResponse[];
  ProductWareHousingBillList: WareHousingBillResponse[];
  WareHousingBill: WareHousingBill;
  ProductWareHousingBillDetail: WareHousingBill;
  loading: boolean;
  totalProduct: number;
  status: string;
  selected: WareHousingBill[];
}

const initialState: WareHousingBillStore = {
  WareHousingBillList: [],
  ProductWareHousingBillList: [],
  WareHousingBill: {},
  ProductWareHousingBillDetail: {},
  loading: false,
  totalProduct: 0,
  status: 'idle',
  selected: [],
};

interface IError {
  error: {
    message: string;
  };
}

export const getListWareHousingBill: any = createAsyncThunk(
  'wareHousing',
  async (body: WareHousingBillParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearcWareHousingBill(params);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const CreateWareHousingApi = createAsyncThunk(
  'wareHousingCreate',
  async (body: WareHousingBillParams, { rejectWithValue }) => {
    const response = await APICreateWareHousingBill(body);

    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getListProductWareHousingBill: any = createAsyncThunk(
  'productWareHousing',
  async (body: WareHousingBillParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearchProductWareHousingBill(params);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const GetWareHousingBillByIdApi = createAsyncThunk<
  WareHousingBill,
  string
>('productWareHousingById', async (id, { rejectWithValue }) => {
  try {
    const response = await APIGetWareHousingBillById(id);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const UpdateWareHousingApi = createAsyncThunk(
  'wareHousingUpdate',
  async (body: WareHousingBillParams, { rejectWithValue }) => {
    const response = await APIUpdateWareHousingBillById(body);

    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getDetailProductWareHousingBill = createAsyncThunk(
  'detailProductWareHousing',
  async (body: WareHousingBillParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APIDetailProductWareHousingBill(params);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const EditlProductWareHousingBill = createAsyncThunk(
  'editProductWareHousing',
  async (body: WareHousingBillParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APIEditProductWareHousingBill(params);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

const wareHousing = createSlice({
  name: '@wareHousing',
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<WareHousingBill[]>) => {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getListWareHousingBill.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getListWareHousingBill.fulfilled, (state, action) => {
      state.loading = false;
      state.WareHousingBillList = action.payload;
    });
    builder.addCase(getListWareHousingBill.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(CreateWareHousingApi.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
    });
    builder.addCase(CreateWareHousingApi.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
    });

    builder.addCase(CreateWareHousingApi.rejected, (state, action) => {
      state.loading = false;
      state.status = 'failed';
    });
    builder.addCase(getListProductWareHousingBill.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getListProductWareHousingBill.fulfilled,
      (state, action) => {
        state.loading = false;
        state.ProductWareHousingBillList = action.payload.data;
        state.totalProduct = action.payload.total;
      }
    );
    builder.addCase(getListProductWareHousingBill.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(GetWareHousingBillByIdApi.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(GetWareHousingBillByIdApi.fulfilled, (state, action) => {
      state.loading = false;
      state.WareHousingBill = action.payload;
      state.totalProduct = action.payload.total;
    });
    builder.addCase(GetWareHousingBillByIdApi.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(UpdateWareHousingApi.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
    });
    builder.addCase(UpdateWareHousingApi.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
    });

    builder.addCase(UpdateWareHousingApi.rejected, (state, action) => {
      state.loading = false;
      state.status = 'failed';
    });
    //
    builder.addCase(getDetailProductWareHousingBill.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getDetailProductWareHousingBill.fulfilled,
      (state, action) => {
        state.loading = false;
        state.ProductWareHousingBillDetail = action.payload;
      }
    );
    builder.addCase(
      getDetailProductWareHousingBill.rejected,
      (state, action) => {
        state.loading = false;
      }
    );

    //edit product
    builder.addCase(EditlProductWareHousingBill.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
    });
    builder.addCase(EditlProductWareHousingBill.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
    });
    builder.addCase(EditlProductWareHousingBill.rejected, (state, action) => {
      state.loading = false;
      state.status = 'failed';
    });
  },
});

export const getWareHousingList = (state: RootState) =>
  state.wareHousing.WareHousingBillList;
export const getProductWareHousingList = (state: RootState) =>
  state.wareHousing.ProductWareHousingBillList;
export const getProductWareHousingListTotal = (state: RootState) =>
  state.wareHousing.totalProduct;
export const getWareHousingBillById = (state: RootState) =>
  state.wareHousing.WareHousingBill;
export const getProductWareHousingDetail = (state: RootState) =>
  state.wareHousing.ProductWareHousingBillDetail;
export default wareHousing.reducer;
export const { setSelected } = wareHousing.actions;
