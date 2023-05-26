import { Inventory, InventoryParams } from 'types/inventory';
import { PriceTable, PriceTableParams } from 'types/priceTable';
import { Product, ProductParams } from 'types/products';

import HttpClient from 'utils/HttpClient';

const PRICE_TABLE_SEARCH_API = '/api/app/price-table/Search';
const PRICE_TABLE_CREATE_API = '/api/app/price-table/Create';
const PRICE_TABLE_UPDATE_API = '/api/app/price-table/Update';
const PRICE_TABLE_DETAIL_API = '/api/app/price-table/Detail';

export interface ResponsePriceTable {
  data: PriceTable[];
  total: number;
}

export const APISearchPriceTable = async (params: PriceTableParams) => {
  return HttpClient.post<typeof params, ResponsePriceTable>(
    PRICE_TABLE_SEARCH_API,
    params
  );
};


export const APICreatePriceTable = async (params: PriceTableParams) => {
  return HttpClient.post<typeof params>(
    PRICE_TABLE_CREATE_API,
    params
  );
};


export const APIUpdatePriceTable = async (
  id: string,
  params: PriceTableParams
) => {
  return HttpClient.put<typeof params, any>(
    `${PRICE_TABLE_UPDATE_API}?priceTable=${id}`,
    params
  );
};

export const APIDetailPriceTable = async (id: string) => {
  return HttpClient.get<typeof id, PriceTableParams>(
    `${PRICE_TABLE_DETAIL_API}`,
    {
      params: { OrderTransportId: id },
    }
  );
};