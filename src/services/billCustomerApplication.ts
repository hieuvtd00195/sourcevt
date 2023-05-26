import HttpClient from 'utils/HttpClient';

interface Data {
    [key: string]: any;
}

interface MasterData {
    [key: string]: any;
    data: Data[];
    httpStatusCode: number;
}

interface ParamSearch {
    [key: string]: any;
}

const PRODUCT_DROP_LIST_API = "/api/app/bill-customer-application/product-drop-list"
const SEARCH_CUSTOMER = '/api/app/bill-customer-application/search-customer'
const SEARCH_PRICE_TABLE = '/api/app/bill-customer-application/price-tables'
const GETLIST_PRICE_WITH_PRICETABLE = '/api/app/bill-customer-application/get-price-product-by-price-table'
const SAVE_CUSTOMER = '/api/app/bill-customer-application/customer'
const GET_CHILDPRODUCT_BY_PRODUCTID = '/api/app/bill-customer-application/products-by-parent'
const GET_ACCOUNTPAYMENT_BY_STOREID = '/api/app/bill-customer-application/account-by-store'
const ADD_NEW_BILL_CUSTOMER = '/api/app/bill-customer-application'
const SEARCH_BILL_CUSTOMER = '/api/app/bill-customer-application/get-list-seach';
const GET_BILL_CUSTOMER_BY_ID = '/api/app/bill-customer-application/detail';
const PUT_BILL_CUSTOMER_BY_ID = '/api/app/bill-customer-application/bill-customer';
const GET_BILL_CUSTOMER_EMPLOYYEE = '/api/app/bill-customer-application/employee';
const GET_BILL_CUSTOMER_DETAIL_VIEW = '/api/app/bill-customer-application/detail-by-id';
const GET_BILL_PRODUCT_BY_BILL_CUSTOMER = '/api/app/bill-customer-application/bill-product-by-bill-customer-id';
const GET_BILL_ENTRIES_BY_BILL_CUSTOMER = '/api/app/bill-customer-application/entries-by-bill-customer-id'
const DELETE_BILL_CUSTOMER_BY_ID = 'api/app/bill-customer-application/bill-customer';
const GET_STORE_BY_USER = '/api/app/bill-customer-application/store-by-user'

export const APIProductDropList = async (id: string, customerType: string) => {
    return HttpClient.get<typeof id, MasterData>(
        `${PRODUCT_DROP_LIST_API}/${id}`, {
        params: {
            customerType: customerType
        }
    }
    );
};


export const APIGetAccountPaymentByStoreId = async (id: string) => {
    return HttpClient.get<typeof id, MasterData>(
        `${GET_ACCOUNTPAYMENT_BY_STOREID}/${id}`
    );
};


export const APISearchCustomerDropProductList = async (params: ParamSearch) => {
    return HttpClient.get<typeof params, MasterData>(
        SEARCH_CUSTOMER,
        {
            params: params,
        }
    );
};

export const APIPriceTableList = async (id: string) => {
    return HttpClient.get<typeof id, MasterData>(
        `${SEARCH_PRICE_TABLE}/${id}`
    );
};

export const APIListPriceWithPriceTable = async (params: ParamSearch) => {
    return HttpClient.post<typeof params, MasterData>(
        GETLIST_PRICE_WITH_PRICETABLE,
        params
    );
};

export const APISaveCustomerBill = async (params: ParamSearch) => {
    return HttpClient.post<typeof params, MasterData>(
        SAVE_CUSTOMER,
        params
    );
};

export const APIGetChildProductById = async (id: string, customerType: string, storeId: string) => {
    return HttpClient.get<typeof id, MasterData>(
        `${GET_CHILDPRODUCT_BY_PRODUCTID}`,
        {
            params: {
                ParentId: id,
                customerType: customerType,
                storeId: storeId
            }
        }
    );
};

export const APICreateBillCustomer = async (params: ParamSearch) => {
    return HttpClient.post<typeof params, MasterData>(
        ADD_NEW_BILL_CUSTOMER,
        params
    );
};

export const APISearchBillCustomer = async (params: ParamSearch) => {
    return HttpClient.post<typeof params, MasterData>(
        SEARCH_BILL_CUSTOMER,
        params
    );
};

export const APIGetBillCustomerById = async (id: string) => {
    return HttpClient.get<typeof id, MasterData>(
        `${GET_BILL_CUSTOMER_BY_ID}/${id}`
    );
};
export const APIUpdateBillCustomerById = async (
    id: string,
    body: ParamSearch
) => {
    return HttpClient.put<typeof body, MasterData>(
        `${PUT_BILL_CUSTOMER_BY_ID}/${id}`,
        body
    );
};
export const APIGetBillCustomerEmployee = async () => {
    return HttpClient.get<MasterData>(
        `${GET_BILL_CUSTOMER_EMPLOYYEE}`
    );
};

export const APIGetBillCustomerByIdView = async (id: string) => {
    return HttpClient.get<typeof id, MasterData>(
        `${GET_BILL_CUSTOMER_DETAIL_VIEW}/${id}`,
    );
};

export const APIGetBillProductByBillCustomer = async (billCustomerId: string, pageIndex: string, pageSize: string) => {
    return HttpClient.get<typeof billCustomerId, MasterData>(
        `${GET_BILL_PRODUCT_BY_BILL_CUSTOMER}`,
        {
            params: {
                billCustomerId: billCustomerId,
                pageIndex: pageIndex,
                pageSize: pageSize
            }
        }
    );
};


export const APIGetBillEntriesByBillCustomer = async (billCustomerId: string, pageIndex: string, pageSize: string) => {
    return HttpClient.get<typeof billCustomerId, MasterData>(
        `${GET_BILL_ENTRIES_BY_BILL_CUSTOMER}`,
        {
            params: {
                billCustomerId: billCustomerId,
                pageIndex: pageIndex,
                pageSize: pageSize
            }
        }
    );
};


export const APIDeleteBillCustomerById = async (id: string) => {
    return HttpClient.delete<null, MasterData>(
        `${DELETE_BILL_CUSTOMER_BY_ID}/${id}`
    );
};

export const APIGetListStoreByUser = async () => {
    return HttpClient.get<MasterData[]>(GET_STORE_BY_USER);
  };
  