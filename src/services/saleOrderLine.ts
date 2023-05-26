import { SaleOrderLineParams, saleOrderLine } from 'types/saleOrderLine';
import HttpClient from 'utils/HttpClient';

interface SaleOrderLineResponse {
  data: saleOrderLine[];
  total: number;
}
const SALE_ORDER_LINE_API = '/api/app/sale-order-line-application/get-list';
const SALE_ORDER_LINE_EXPORT_API =
  '/api/app/sale-order-line-application/export';
const SALE_ORDER_LINE_UPDATE_PRICE_API = '/api/app/sale-order-line-application';

export const APISearchSaleOrderLine = async (params: SaleOrderLineParams) => {
  return HttpClient.post<typeof params, SaleOrderLineResponse>(
    SALE_ORDER_LINE_API,
    params
  );
};

export const APIExportSaleOrderLine = async (params: SaleOrderLineParams) => {
  return HttpClient.post<typeof params, Blob>(
    SALE_ORDER_LINE_EXPORT_API,
    params,
    {
      responseType: 'blob',
    }
  ).then((res) => {
    const target = window.URL.createObjectURL(new Blob([res]));
    const link = document.createElement('a');
    link.href = target;
    link.setAttribute('download', 'DanhSachSanPhamPhieuDatHang.xlsx');
    link.click();
    window.URL.revokeObjectURL(target);
  });
};

export const APIUpdatePriceSaleOrderLine = async (
  id: string,
  params: SaleOrderLineParams
) => {
  return HttpClient.put<typeof params, any>(
    `${SALE_ORDER_LINE_UPDATE_PRICE_API}?SaleOrderLineId=${id}`,
    params
  );
};
