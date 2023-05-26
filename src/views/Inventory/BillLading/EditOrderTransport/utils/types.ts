export interface IOrderTransportForm {
  saleOrders: saleOrders[];
  transporterId: string | null;
  supplierName: string | null;
  status: number | null;
  totalPrice: string | null;
  transportCode: string | null;
  dateTransport: Date | string | null;
  dateArrive: Date | string | null;
  saleOrderId: string | null;
}

export interface saleOrders {
  id: string | null;
  code: string | null;
  supplierId: string | null;
  supplierName: string | null;
  invoiceNumber: string | null;
}
