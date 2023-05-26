import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { APIAttachmentUpload } from 'services/attachment';
import { APICreateBillCustomer, APIGetAccountPaymentByStoreId, APIGetBillCustomerById, APIGetBillCustomerByIdView, APIGetBillCustomerEmployee, APIGetBillEntriesByBillCustomer, APIGetBillProductByBillCustomer, APIGetChildProductById, APIGetListStoreByUser, APIListPriceWithPriceTable, APIPriceTableList, APIProductDropList, APISaveCustomerBill, APISearchBillCustomer, APISearchCustomerDropProductList,APIUpdateBillCustomerById } from 'services/billCustomerApplication';
import { RootState } from 'store';


interface Data {
    [key: string]: any;
}
interface DataCreate {
    [key: string]: any;
    httpStatusCode: number;
}
interface ProductDropList {
    [key: string]: any;
}

interface ParamsSearch {
    [key: string]: any;
}
interface IPayloadUploadFile {
    objectId: string,
    files: File[];
    objectType?: 3
}
export interface StoreApplication {
    productDropList: ProductDropList[];
    customerList: Data[];
    priceTableList: Data[];
    pricewithTable: Data[];
    childProduct: Data[];
    accountPayment: Data[];
    createBillCustomer: Data[];
    updateBillCustomer: Data[];
    listBillCustomer: Data[];
    listBillCustomerEmployee: Data[];
    billCustomerDetailById: Data,
    billCustomerDetailByIdView: Data,
    listBillProduct: Data[];
    listBillEntries: Data[];
    storeByUser: Data[];
    loading: boolean;
}
const initialState: StoreApplication = {
    productDropList: [],
    customerList: [],
    priceTableList: [],
    pricewithTable: [],
    childProduct: [],
    accountPayment: [],
    createBillCustomer: [],
    updateBillCustomer: [],
    listBillCustomer: [],
    billCustomerDetailById: {},
    listBillCustomerEmployee: [],
    billCustomerDetailByIdView: {},
    listBillProduct: [],
    listBillEntries: [],
    storeByUser: [],
    loading: false,
};

interface IError {
    error: {
        message: string;
    };
}

export const getListProductDrop = createAsyncThunk(
    'productDropList',
    async (body: ParamsSearch, { rejectWithValue }) => {
        const StoreId = body.StoreId;
        const customerType = body.customerType;
        const response = await APIProductDropList(StoreId, customerType);
        if (!response) {
            return rejectWithValue(response);
        }
        return response;
    }
);

export const getListCustomerProductDrop = createAsyncThunk(
    'searchCustomerProductDropList',
    async (body: ParamsSearch, { rejectWithValue }) => {
        const params = {
            ...body,
        };
        const response = await APISearchCustomerDropProductList(params);
        if (!response.data) {
            return rejectWithValue(response);
        }
        return response;
    }
);

export const getListPriceTable = createAsyncThunk(
    'priceTableList',
    async (id: string, { rejectWithValue }) => {

        const response = await APIPriceTableList(id);
        if (!response) {
            return rejectWithValue(response);
        }
        return response;
    }
);

export const getListPriceWithPriceTable = createAsyncThunk(
    'priceWithTable',
    async (body: ParamsSearch, { rejectWithValue }) => {
        const params = {
            ...body,
        };
        const response = await APIListPriceWithPriceTable(params);
        if (!response) {
            return rejectWithValue(response);
        }
        return response;
    }
);

export const saveCustomerBill = createAsyncThunk(
    'saveCustomerBill',
    async (body: ParamsSearch, { rejectWithValue }) => {
        const params = {
            ...body,
        };
        const response = await APISaveCustomerBill(params);
        if (!response) {
            return rejectWithValue(response);
        }
        return response;
    }
);

export const getChildProductById = createAsyncThunk(
    'getChildProductById',
    async (body: ParamsSearch, { rejectWithValue }) => {
        const parrentId = body.parrentId;
        const customerType = body.customerType;
        const storeId = body.storeId
        const response = await APIGetChildProductById(parrentId, customerType, storeId);
        if (!response) {
            return rejectWithValue(response);
        }
        return response;
    }
);

export const getAccountPaymentById = createAsyncThunk(
    'getAccountPaymentById',
    async (id: string, { rejectWithValue }) => {

        const response = await APIGetAccountPaymentByStoreId(id);
        if (!response) {
            return rejectWithValue(response);
        }
        return response;
    }
);

export const createBillCustomer = createAsyncThunk(
    'createBillCustomer',
    async (body: ParamsSearch, { rejectWithValue }) => {
        const params = {
            ...body,
        };
        const response = await APICreateBillCustomer(params);
        if (!response) {
            return rejectWithValue(response);
        }
        return response;
    }
);


export const searchBillCustomer = createAsyncThunk(
    'searchBillCustomer',
    async (body: ParamsSearch, { rejectWithValue }) => {
        const params = {
            ...body,
        };
        const response = await APISearchBillCustomer(params);
        if (!response) {
            return rejectWithValue(response);
        }
        return response;
    }
);

export const updateBillCustomer = createAsyncThunk(
    'updateBillCustomer',
    async (body: ParamsSearch, { rejectWithValue }) => {
        const id = body.id;

        const params = body.bodyParamsUpdate;;
        const response = await APIUpdateBillCustomerById(id, params);
        if (!response) {
            return rejectWithValue(response);
        }
        return response;
    }
);



export const getBillCustomerById = createAsyncThunk(
    'getBillCustomerById',
    async (id: string, { rejectWithValue }) => {

        const response = await APIGetBillCustomerById(id);
        if (!response) {
            return rejectWithValue(response);
        }
        return response;
    }
);

export const getBillCustomerEmployee = createAsyncThunk(
    'getBillCustomerEmployee',
    async ({ rejectWithValue }: any) => {

        const response = await APIGetBillCustomerEmployee();

        if (!response) {
            return rejectWithValue(response);
        }
        return response;
    }
);


export const getBillCustomerByIdView = createAsyncThunk(
    'getBillCustomerByIdView',
    async (id: string, { rejectWithValue }) => {

        const response = await APIGetBillCustomerByIdView(id);
        if (!response) {
            return rejectWithValue(response);
        }
        return response;
    }
);

export const getBillProductByBillCustomer = createAsyncThunk(
    'getBillProductByBillCustomer',
    async (body: ParamsSearch, { rejectWithValue }) => {
        const billCustomerId = body.billCustomerId;
        const pageIndex = body.pageIndex;
        const pageSize = body.pageSize
        const response = await APIGetBillProductByBillCustomer(billCustomerId, pageIndex, pageSize);
        if (!response) {
            return rejectWithValue(response);
        }
        return response;
    }
);

export const getBillEntiresByBillCustomer = createAsyncThunk(
    'getBillEntiresByBillCustomer',
    async (body: ParamsSearch, { rejectWithValue }) => {
        const billCustomerId = body.billCustomerId;
        const pageIndex = body.pageIndex;
        const pageSize = body.pageSize
        const response = await APIGetBillEntriesByBillCustomer(billCustomerId, pageIndex, pageSize);
        if (!response) {
            return rejectWithValue(response);
        }
        return response;
    }
);

export const uploadFileCustomerBillDetail = createAsyncThunk(
    "uploadFileCustomerBillDetail",
    async (
        { files, objectId }: IPayloadUploadFile,
        { rejectWithValue }
    ) => {
        try {

            if (files.length > 0) {
                const response = await APIAttachmentUpload({
                    objectId: objectId,
                    formFiles: files,
                    objectType: 3,
                });
                return response;
            }


        } catch (error: any) {
            return rejectWithValue(error.error.message);
        }
    }
);

export const getStoreByUser = createAsyncThunk(
    'getListStoreByUser',
    async ({ rejectWithValue }: any) => {

        const response = await APIGetListStoreByUser();

        if (!response) {
            return rejectWithValue(response);
        }
        return response;
    }
);


const billCustomerApplication = createSlice({
    name: '@billCustomerApplication',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getListProductDrop.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getListProductDrop.fulfilled, (state, action) => {
            state.loading = false;
            state.productDropList = action.payload.data;
        });
        builder.addCase(getListProductDrop.rejected, (state, action) => {
            state.loading = false;
        });

        //Search Customer
        builder.addCase(getListCustomerProductDrop.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getListCustomerProductDrop.fulfilled, (state, action) => {
            state.loading = false;
            state.customerList = action.payload.data;
        });
        builder.addCase(getListCustomerProductDrop.rejected, (state, action) => {
            state.loading = false;
        });

        builder.addCase(getListPriceTable.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getListPriceTable.fulfilled, (state, action) => {
            state.loading = false;
            state.priceTableList = action.payload.data;
        });
        builder.addCase(getListPriceTable.rejected, (state, action) => {
            state.loading = false;
        });


        builder.addCase(getListPriceWithPriceTable.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getListPriceWithPriceTable.fulfilled, (state, action) => {
            state.loading = false;
            state.pricewithTable = action.payload.data;
        });
        builder.addCase(getListPriceWithPriceTable.rejected, (state, action) => {
            state.loading = false;
        });

        builder.addCase(saveCustomerBill.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(saveCustomerBill.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(saveCustomerBill.rejected, (state, action) => {
            state.loading = false;
        });

        builder.addCase(getChildProductById.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getChildProductById.fulfilled, (state, action) => {
            state.loading = false;
            state.childProduct = action.payload.data;
        });
        builder.addCase(getChildProductById.rejected, (state, action) => {
            state.loading = false;
        });

        builder.addCase(getAccountPaymentById.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getAccountPaymentById.fulfilled, (state, action) => {
            state.loading = false;
            state.accountPayment = action.payload.data;
        });
        builder.addCase(getAccountPaymentById.rejected, (state, action) => {
            state.loading = false;
        });

        builder.addCase(createBillCustomer.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(createBillCustomer.fulfilled, (state, action) => {
            state.loading = false;
            state.createBillCustomer = action.payload.data;
        });
        builder.addCase(createBillCustomer.rejected, (state, action) => {
            state.loading = false;
        });

        builder.addCase(searchBillCustomer.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(searchBillCustomer.fulfilled, (state, action) => {
            state.loading = false;
            state.listBillCustomer = action.payload.data;
        });
        builder.addCase(searchBillCustomer.rejected, (state, action) => {
            state.loading = false;
        });

        builder.addCase(getBillCustomerById.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getBillCustomerById.fulfilled, (state, action) => {
            state.loading = false;
            state.listBillCustomer = action.payload.data;
        });
        builder.addCase(getBillCustomerById.rejected, (state, action) => {
            state.loading = false;
        });

        builder.addCase(updateBillCustomer.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(updateBillCustomer.fulfilled, (state, action) => {
            state.loading = false;
            state.updateBillCustomer = action.payload.data;
        });
        builder.addCase(updateBillCustomer.rejected, (state, action) => {
            state.loading = false;
        });

        builder.addCase(getBillCustomerEmployee.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getBillCustomerEmployee.fulfilled, (state, action) => {
            state.loading = false;
            state.listBillCustomerEmployee = action.payload.data;
        });
        builder.addCase(getBillCustomerEmployee.rejected, (state, action) => {
            state.loading = false;
        });

        builder.addCase(getBillCustomerByIdView.fulfilled, (state, action) => {
            state.loading = false;
            state.billCustomerDetailByIdView = action.payload.data;
        });
        builder.addCase(getBillCustomerByIdView.rejected, (state, action) => {
            state.loading = false;
        });

        builder.addCase(getBillCustomerByIdView.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getBillProductByBillCustomer.rejected, (state, action) => {
            state.loading = false;
        });

        builder.addCase(getBillProductByBillCustomer.fulfilled, (state, action) => {
            state.loading = false;
            state.listBillProduct = action.payload.data;
        });

        builder.addCase(getBillProductByBillCustomer.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getBillEntiresByBillCustomer.rejected, (state, action) => {
            state.loading = false;
        });


        builder.addCase(getBillEntiresByBillCustomer.fulfilled, (state, action) => {
            state.loading = false;
            state.listBillEntries = action.payload.data;
        });

        builder.addCase(getBillEntiresByBillCustomer.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(uploadFileCustomerBillDetail.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(
            uploadFileCustomerBillDetail.fulfilled,
            (state, action) => {
                state.loading = false;
            }
        );

        builder.addCase(
            uploadFileCustomerBillDetail.rejected,
            (state, action) => {
                state.loading = false;

            }
        );
        
        builder.addCase(getStoreByUser.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getStoreByUser.fulfilled, (state, action) => {
            state.loading = false;
            state.storeByUser = action.payload;
        });
        builder.addCase(getStoreByUser.rejected, (state, action) => {
            state.loading = false;
        });
    },
});

export const getProductDropListStore = (state: RootState) =>
    state.billCustomerApplication.productDropList;
export const getCustomerProductDropListStore = (state: RootState) =>
    state.billCustomerApplication.customerList;
export const getPriceTableList = (state: RootState) =>
    state.billCustomerApplication.priceTableList;
export const getPriceWithTableList = (state: RootState) =>
    state.billCustomerApplication.pricewithTable;
export const getChildProductByIdList = (state: RootState) =>
    state.billCustomerApplication.childProduct;
export const getAccountPaymentByIdList = (state: RootState) =>
    state.billCustomerApplication.accountPayment;
export const getListBillCustomer = (state: RootState) =>
    state.billCustomerApplication.listBillCustomer;
export const getBillCustomerDetail = (state: RootState) =>
    state.billCustomerApplication.listBillCustomer;
export const getBillCustomerEmployeeList = (state: RootState) =>
    state.billCustomerApplication.listBillCustomerEmployee;
export const getBillCustomerDetailByIdView = (state: RootState) =>
    state.billCustomerApplication.billCustomerDetailByIdView;
export const getListBillProductByBillCustomer = (state: RootState) =>
    state.billCustomerApplication.listBillProduct;
    export const getListStoreByUser = (state: RootState) =>
    state.billCustomerApplication.storeByUser;
export default billCustomerApplication.reducer;

