import { IProductCategory } from 'types/productCategory';
import HttpClient from 'utils/HttpClient';

const PRODUCT_CATEGORY_API = '/api/app/Product/GetAllDropdown';

export const APIAllProductCategory = async () => {
  return HttpClient.get<IProductCategory[]>(PRODUCT_CATEGORY_API);
};
