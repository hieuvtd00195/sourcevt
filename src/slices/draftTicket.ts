import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Endpoints } from 'constants/endpoints';
import {
  APIApproveDraftTicket,
  APICreateDraftTicket,
  APIDeleteDraftTicket,
  APIDraftTicketSetApproveById,
  APISearchDraftTicket,
  IResAPISearchDraftTicket,
} from 'services/draftTicket';
import {
  CreateDraftTicket,
  IAPIApproveDraftTicket,
  IResGetDraftTicket,
  SearchDraftTicketParams,
} from 'types/draftTicket';
import { APIAttachmentUpload } from './../services/attachment';
import { DraftTicket } from './../types/draftTicket';

interface IInitialState {
  loadingCreate: boolean;
  loading: boolean;
  DraftTicketList: DraftTicket[];
  total: number;
  id: string | null;
  loadingGet: boolean;
  selected: DraftTicket[];
}

const initialState: IInitialState = {
  loadingCreate: false,
  loading: false,
  DraftTicketList: [],
  total: 0,
  id: null,
  loadingGet: false,
  selected: [],
};

interface IPayloadCreateDraftTicket {
  data: CreateDraftTicket;
  images: File[] | null;
}

const createDraftTicket = createAsyncThunk(
  Endpoints.draftTicket.create,
  async ({ data, images }: IPayloadCreateDraftTicket, { rejectWithValue }) => {
    try {
      const response = await APICreateDraftTicket(data);

      if (!response) {
        return rejectWithValue(response);
      }

      if (images && images?.length > 0) {
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

const getListDraftTicketApi = createAsyncThunk(
  Endpoints.draftTicket.search,
  async (body: SearchDraftTicketParams, { rejectWithValue }) => {
    try {
      const res = await APISearchDraftTicket(body);

      if (!res) {
        return rejectWithValue(res);
      }
      return res as IResAPISearchDraftTicket;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const deleteDraftTicketApi = createAsyncThunk(
  Endpoints.draftTicket.delete,
  async (id: string, { rejectWithValue }) => {
    try {
      await APIDeleteDraftTicket(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const getDraftTicketSetApproveById = createAsyncThunk(
  Endpoints.draftTicket.get,
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await APIDraftTicketSetApproveById(id);

      if (!res) {
        return rejectWithValue(res);
      }
      return res as IResGetDraftTicket;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const approveDraftTicket = createAsyncThunk(
  Endpoints.draftTicket.approve,
  async (data: IAPIApproveDraftTicket, { rejectWithValue }) => {
    try {
      await APIApproveDraftTicket(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const draftTicketSlice = createSlice({
  name: '@draftTicket',
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
      state.loadingGet = true;
    },
    setSelected: (state, action: PayloadAction<DraftTicket[]>) => {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createDraftTicket.pending, (state) => {
      state.loadingCreate = true;
    });
    builder.addCase(createDraftTicket.fulfilled, (state) => {
      state.loadingCreate = false;
    });
    builder.addCase(createDraftTicket.rejected, (state, action) => {
      state.loadingCreate = false;
    });

    builder.addCase(getListDraftTicketApi.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      getListDraftTicketApi.fulfilled,
      (state, action: PayloadAction<IResAPISearchDraftTicket>) => {
        state.loading = false;
        state.DraftTicketList = action.payload.data;
        state.total = action.payload.total;
      }
    );
    builder.addCase(getListDraftTicketApi.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export default draftTicketSlice.reducer;
export const { setId, setSelected } = draftTicketSlice.actions;

export {
  createDraftTicket,
  getListDraftTicketApi,
  deleteDraftTicketApi,
  getDraftTicketSetApproveById,
  approveDraftTicket,
};
