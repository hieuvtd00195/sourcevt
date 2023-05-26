import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Endpoints } from 'constants/endpoints';
import {
  APICreateEntry,
  APIDeleteEntry,
  APIGetByIdEntry,
  APIGetByIdEntryDetail,
  APIGetDetailEntryLog,
  APISearchEntry,
  APISearchEntryLog,
} from 'services/entry';
import { RootState } from 'store';
import { Entry, IResponseTypeEntry } from 'types/entry';
import { APIUpdateEntry } from './../services/entry';

interface SearchEntryParams {
  [key: string]: any;
}

interface SearchEntryDetailParams {
  orderBy: string | null;
  orderDirection: string | null;
  pageIndex: number | null;
  pageSize: number | null;
  storeIds: number[] | null;
  ticketType: number | null;
  code: string | null;
  parentCode: string | null;
  documentCode: string | null;
  accountCode: string | null;
  start: string | null;
  end: string | null;
  audienceType: number | null;
  audience: string | null;
}

export interface FileRes {
  name: string | null;
  base64: string | null;
}
export interface AttachmentList {
  base64: string | null;
  fileName: string | null;
  contentType: string | null;
  extensions: string | null;
}

export interface CreateEntryParams {
  [key: string]: any;
  // id: string | null;
  // transactionDate: Date | null;
  // ticketType: number | string | null;
  // documentCode: string | null;
  // audienceCode: string | null;
  // audienceType: number | null;
  // note: string | null;
  // form: [];
  // imageUrls: string | null;
  // attachments: File;
}

export interface EntryState {
  EntryLogDetail: any;
  EntryLog: any;
  EntryListDetail: any;
  EntryList: Entry[];
  loading: boolean;
  errorMessage: any;
  status: string;
  total: number;
  loadingGet: boolean;
  loadingCreate: boolean;
  loadingDelete: boolean;
}

const initialState: EntryState = {
  EntryLogDetail: [],
  EntryLog: [],
  EntryListDetail: [],
  EntryList: [],
  loading: false,
  errorMessage: '',
  status: 'idle',
  total: 0,
  loadingGet: false,
  loadingCreate: false,
  loadingDelete: false,
};

// Tạo Thunk đồng bộ call api get
export const getListEntryApi = createAsyncThunk(
  Endpoints.accountings.search,
  async (body: SearchEntryParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };
    const response = await APISearchEntry(params);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getListEntryLogApi = createAsyncThunk(
  Endpoints.accountings.log,
  async (body: SearchEntryParams, { rejectWithValue }) => {
    const params = {
      ...body,
    };

    const response = await APISearchEntryLog(params);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getListEntryDetailApi = createAsyncThunk(
  Endpoints.accountings.detail,
  async (body: SearchEntryDetailParams, { rejectWithValue }) => {
    const response = await APIGetByIdEntryDetail(body);
    if (!response.data) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getEntryLogDetailApi = createAsyncThunk(
  Endpoints.accountings.logDetail,
  async (body: SearchEntryParams, { rejectWithValue }) => {
    const response = await APIGetDetailEntryLog(body);

    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const blobToData = (blob: Blob) => {
  if (blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } else {
    return null;
  }
};

export const CreateEntryApi = createAsyncThunk(
  Endpoints.accountings.create,
  async (body: CreateEntryParams, { rejectWithValue }) => {
    const resData = await blobToData(body.attachments);
    const paramsBody = {
      ...body,
      attachments: [
        {
          base64: resData,
          fileName: body.imageUrls,
          contentType: null,
          extensions: null,
        },
      ],
    };
    // const formData = new FormData();
    // for (const key in body) {
    //   if (Object.prototype.hasOwnProperty.call(body, key)) {
    //     if (key === 'form') {
    //       formData.append('entryAccounts', JSON.stringify(body[key]));
    //     } else {
    //       formData.append(key, body[key]);
    //     }
    //   }
    // }

    const response = await APICreateEntry(paramsBody);

    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

const UpdateEntryApi = createAsyncThunk(
  Endpoints.accountings.update,
  async (body: CreateEntryParams, { rejectWithValue }) => {
    const resData = await blobToData(body.attachments);
    const paramsBody = {
      id: body.id,
      transactionDate: body.transactionDate,
      ticketType: body.ticketType,
      documentCode: body.documentCode,
      audienceId: body.audienceId,
      audienceType: body.audienceType,
      note: body.note,
      entryAccounts: body.form.map((_item: any) => ({
        ..._item,
        amountCny: Number(_item?.amountCny || 0),
        amountVnd: Number(_item?.amountVnd || 0),
      })),
      attachments: resData
        ? [
          {
            base64: resData,
            fileName: body.imageUrls,
            contentType: null,
            extensions: null,
          },
        ]
        : null,
    };

    const response = await APIUpdateEntry(paramsBody);

    if (!response) {
      return rejectWithValue(response);
    }
    return response;
  }
);

const GetEntryApi = createAsyncThunk<IResponseTypeEntry, string>(
  Endpoints.accountings.get,
  async (id, { rejectWithValue }) => {
    try {
      const res = await APIGetByIdEntry(id);

      if (!res) {
        return rejectWithValue(res);
      }
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const DeleteEntryApi = createAsyncThunk(
  Endpoints.accountings.delete,
  async (id: string | null, { rejectWithValue }) => {
    try {
      await APIDeleteEntry(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const entrySlice = createSlice({
  name: '@entry',
  initialState,
  reducers: {
    // getListEntry: (state, action: PayloadAction<Entry[]>) => {
    //   state.EntryList = action.payload as Entry[];
    // },
  },
  extraReducers: (builder) => {
    // Bắt đầu thực hiện action  (Promise pending)
    builder.addCase(getListEntryApi.pending, (state) => {
      // Bật trạng thái loading
      state.status = 'loading';
      state.loading = true;
    });

    // Khi thực hiện action  thành công (Promise fulfilled)
    builder.addCase(getListEntryApi.fulfilled, (state, action) => {
      // Tắt trạng thái loading, lưu thông tin entry vào store
      state.status = 'succeeded';
      state.loading = false;
      state.total = action.payload.total;
      state.EntryList = action.payload.data;
    });

    // Khi thực hiện action  thất bại (Promise rejected)
    builder.addCase(getListEntryApi.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });

    builder.addCase(getListEntryDetailApi.pending, (state) => {
      // Bật trạng thái loading
      state.status = 'loading';
      state.loading = true;
    });

    // Khi thực hiện action  thành công (Promise fulfilled)
    builder.addCase(getListEntryDetailApi.fulfilled, (state, action) => {
      // Tắt trạng thái loading, lưu thông tin entry vào store
      state.status = 'succeeded';
      state.loading = false;
      state.total = action.payload.total;
      state.EntryListDetail = action.payload.data;
    });

    // Khi thực hiện action  thất bại (Promise rejected)
    builder.addCase(getListEntryDetailApi.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });

    builder.addCase(getEntryLogDetailApi.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.EntryLogDetail = action.payload;
    });

    builder.addCase(getEntryLogDetailApi.rejected, (state, action) => {
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });

    builder.addCase(getEntryLogDetailApi.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
    });

    //Create Entry
    builder.addCase(CreateEntryApi.pending, (state) => {
      // Bật trạng thái loading
      state.status = 'loading';
      state.loading = true;
    });
    builder.addCase(CreateEntryApi.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
    });

    // Khi thực hiện action  thất bại (Promise rejected)
    builder.addCase(CreateEntryApi.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });

    builder.addCase(GetEntryApi.pending, (state) => {
      state.loadingGet = true;
    });
    builder.addCase(GetEntryApi.fulfilled, (state) => {
      state.loadingGet = false;
    });
    builder.addCase(GetEntryApi.rejected, (state, action) => {
      state.loadingGet = false;
    });
    builder.addCase(DeleteEntryApi.pending, (state) => {
      state.loadingDelete = true;
    });
    builder.addCase(DeleteEntryApi.fulfilled, (state) => {
      state.loadingDelete = false;
    });
    builder.addCase(DeleteEntryApi.rejected, (state, action) => {
      state.loadingDelete = false;
    });

    builder.addCase(UpdateEntryApi.pending, (state) => {
      state.loadingCreate = true;
    });
    builder.addCase(UpdateEntryApi.fulfilled, (state) => {
      state.loadingCreate = false;
    });
    builder.addCase(UpdateEntryApi.rejected, (state, action) => {
      state.loadingCreate = false;
    });

    builder.addCase(getListEntryLogApi.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
    });

    builder.addCase(getListEntryLogApi.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.total = action.payload.total;
      state.EntryLog = action.payload.data;
    });

    builder.addCase(getListEntryLogApi.rejected, (state, action) => {
      state.loading = false;
      state.status = 'failed';
      state.errorMessage = action.error.message;
    });
  },
});

// Lấy data theo state
export const getEntryList = (state: RootState) => state.entry.EntryList;
export const getEntryListDetail = (state: RootState) =>
  state.entry.EntryListDetail;
export const getEntryListTotal = (state: RootState) => state.entry.total;
export const getEntryLogList = (state: RootState) => state.entry.EntryLog;
export const getEntryLogDetailList = (state: RootState) =>
  state.entry.EntryLogDetail;

export default entrySlice.reducer;
export { GetEntryApi, UpdateEntryApi };
