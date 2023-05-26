import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  APIGetProvinceList,
  APISearcMasterAudience,
  APISearcMasterData,
  APISearcPaymentAccount,
  APISearcProductWithType,
  APISearchMasterAccount,
} from 'services/masterdata';
import { APICodeNameProductApplication } from 'services/productApplication';
import { RootState } from 'store';
import { IDataProductApplication } from 'types/productApplication';

interface Data {
  [key: string]: any;
}
interface MasterDataList {
  [key: string]: any;
}

interface MasterDataParams {
  [key: string]: any;
}

export interface StoreApplication {
  MasterDataList: MasterDataList[];
  MasterDataAudience: MasterDataList[];
  MasterDataProduct: MasterDataList[];
  Paymentaccount: MasterDataList[];
  ListTKKT: MasterDataList[];
  ProvinceList: MasterDataList[];
  totalListTKKT: number;
  loading: boolean;
}

const initialState: StoreApplication = {
  MasterDataList: [],
  MasterDataAudience: [],
  MasterDataProduct: [],
  Paymentaccount: [],
  ProvinceList: [],
  totalListTKKT: 0,
  ListTKKT: [],
  loading: false,
};

interface IError {
  error: {
    message: string;
  };
}

export const getListMasterData = createAsyncThunk(
  'masterData',
  async (body: MasterDataParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearcMasterData(params);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getListMasterDataAudience = createAsyncThunk(
  'masterData-Audient',
  async (body: MasterDataParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearcMasterAudience(params);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getListMasterDataProducts = createAsyncThunk(
  'masterDataProduct',
  async (body: MasterDataParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearcProductWithType(params);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getListMasterDataPaymentAccount = createAsyncThunk(
  'masterDataPaymentAccount',
  async (body: MasterDataParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearcPaymentAccount({
      pageIndex: 0,
      pageSize: 50,
    });
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getListMasterDataAccount = createAsyncThunk(
  'masterDataAccount',
  async (body: MasterDataParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearchMasterAccount(params);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getListMasterDataTKKT = createAsyncThunk(
  'masterDataTKKT',
  async (body: MasterDataParams, { rejectWithValue }) => {
    // const params = {
    //   ...body,
    // };
    const response = await APISearcPaymentAccount(body);
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getProvinceList = createAsyncThunk(
  'masterDataProvince',
  async ({ rejectWithValue }: any) => {
    // const params = {
    //   ...body,
    // };
    const response = await APIGetProvinceList();
    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

const masterData = createSlice({
  name: '@masterData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListMasterData.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getListMasterData.fulfilled, (state, action) => {
      state.loading = false;
      state.MasterDataList = action.payload;
    });
    builder.addCase(getListMasterData.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(getListMasterDataAudience.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getListMasterDataAudience.fulfilled, (state, action) => {
      state.loading = false;
      state.MasterDataAudience = action.payload;
    });
    builder.addCase(getListMasterDataAudience.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(getListMasterDataProducts.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getListMasterDataProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.MasterDataProduct = action.payload;
    });
    builder.addCase(getListMasterDataProducts.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(getListMasterDataPaymentAccount.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      getListMasterDataPaymentAccount.fulfilled,
      (state, action) => {
        state.loading = false;
        state.Paymentaccount = action.payload.data;
      }
    );
    builder.addCase(
      getListMasterDataPaymentAccount.rejected,
      (state, action) => {
        state.loading = false;
      }
    );

    builder.addCase(getListMasterDataAccount.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getListMasterDataAccount.fulfilled, (state, action) => {
      state.loading = false;
      // state.Paymentaccount = action.payload.data;
    });
    builder.addCase(getListMasterDataAccount.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(getListMasterDataTKKT.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getListMasterDataTKKT.fulfilled, (state, action) => {
      state.loading = false;
      state.ListTKKT = action.payload.data;
      state.totalListTKKT = action.payload.total;
    });
    builder.addCase(getListMasterDataTKKT.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(getProvinceList.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getProvinceList.fulfilled, (state, action) => {
      state.loading = false;
      state.ProvinceList = action.payload;
    });
    builder.addCase(getProvinceList.rejected, (state, action) => {
      state.loading = false;
    });
  },
});
export const getMasterDataList = (state: RootState) =>
  state.masterData.MasterDataList;
export const getMasterDataListAudience = (state: RootState) =>
  state.masterData.MasterDataAudience;
export const getMasterDataListProducts = (state: RootState) =>
  state.masterData.MasterDataProduct;
export const getMasterDataListPaymentAccount = (state: RootState) =>
  state.masterData.Paymentaccount;
export const getMasterDataListTKKT = (state: RootState) =>
  state.masterData.ListTKKT;
  export const getMasterDataListProvince = (state: RootState) =>
  state.masterData.ProvinceList;

export default masterData.reducer;
