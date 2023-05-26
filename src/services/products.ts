import { Product, ProductParams } from 'types/products';

import HttpClient from 'utils/HttpClient';

const PRODUCTS_SEARCH_API = '/api/app/Product/Search';
const PRODUCTS_EXPORT_API = '/api/app/Product/ExportProduct';
const PRODUCTS_CREATE_API = '/api/app/Product/Create';

export interface ResponseProducts {
  data: Product[];
  total: number;
}
export interface Params {
  [key: string]: any;
}
export const APISearcProduct = async (params: ProductParams) => {
  return HttpClient.post<typeof params, ResponseProducts>(
    PRODUCTS_SEARCH_API,
    params
  );
};

export const APIExportProduct = async (params: any) => {
  return HttpClient.pull<typeof params, any>(
    PRODUCTS_EXPORT_API,
    params,
    {
      responseType: 'blob',
    }

  );

};

export const APICreateProduct = async (params: Params) => {
  console.log(params, "params");

  const formData = new FormData();
  // params.objectId && formData.append('objectId', params.objectId);
  // params.objectType &&
  //   formData.append('objectType', params.objectType.toString());
  for (let key in params) {
    if (key === "formFiles") {
      if (params.formFiles.length > 0) {
        for (let i = 0; i < params.formFiles.length; i++) {

          formData.append('formFiles', params.formFiles[i].file);
        }
      }
    }else{
      formData.append(key, params[key]);
    }
  
  }


  return HttpClient.post<FormData>(PRODUCTS_CREATE_API, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
