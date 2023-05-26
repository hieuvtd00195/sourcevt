import { Inventory, InventoryParams } from 'types/inventory';
import { Product, ProductParams } from 'types/products';

import HttpClient from 'utils/HttpClient';

const Inventory_SEARCH_API = '/api/app/product-stock/Search';

export interface ResponseInventory {
  data: Inventory[];
  stores: Inventory[];
  total: number;
}

export const APISearchInventory = async (params: InventoryParams) => {
  return HttpClient.post<typeof params, ResponseInventory>(
    Inventory_SEARCH_API,
    params
  );
};
