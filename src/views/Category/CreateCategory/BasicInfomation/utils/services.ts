import { Endpoints } from 'constants/endpoints';
import type { HttpResponse } from 'types/common';
import HttpClient from 'utils/HttpClient';
import { Product } from 'views/Products/utils/types';

// Get product detail
export const getProduct = async (id: number) => {
  return HttpClient.get<null, HttpResponse<Product>>(
    `${Endpoints.products.detail}/${id}`
  );
};

// Create a product
interface CreateProductParams {}
export const createProduct = async (params: CreateProductParams) => {
  return HttpClient.post<typeof params, HttpResponse>(
    Endpoints.products.create,
    params
  );
};

// Update product
export const updateProduct = async (
  params: CreateProductParams & { id: number }
) => {
  return HttpClient.put<typeof params, HttpResponse>(
    Endpoints.products.update,
    params
  );
};

// Disable product
export const disableProduct = async (id: number) => {
  return HttpClient.put<null, HttpResponse>(
    `${Endpoints.products.disable}/${id}`
  );
};

// Delete product
export const deleteProduct = async (id: number) => {
  return HttpClient.delete<null, HttpResponse>(
    `${Endpoints.products.delete}/${id}`
  );
};
