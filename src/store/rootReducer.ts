import { combineReducers } from '@reduxjs/toolkit';
import billCustomerApplicationReducer from 'slices/billCustomerApplicationSlice';
import customerReducer from 'slices/customer';
import debtCustomerReducer from 'slices/debtCustomer';
import debtReminderLogReducer from 'slices/debtReminderLog';
import debtSupplierReducer from 'slices/debtSupplier';
import draftTicketReducer from 'slices/draftTicket';
import entryReducer from 'slices/entry';
import inventoryReducer from 'slices/inventory';
import masterDataReducer from 'slices/masterData';
import notificationReducer from 'slices/notification';
import orderTransportReducer from 'slices/orderTransport';
import paymentReceiptReducer from 'slices/paymentReceipt';
import priceTableReducer from 'slices/priceTable';
import productApplicationReducer from 'slices/productApplication';
import productCategoryReducer from 'slices/productCategory';
import productModificationHistoryReducer from 'slices/productModificationHistory';
import productsReducer from 'slices/products';
import purchaseHistoryReducer from 'slices/purchaseHistory';
import saleOrderReducer from 'slices/saleOrder';
import saleOrderLineReducer from 'slices/saleOrderLine';
import saleOrderReturnReducer from 'slices/saleOrderReturn';
import saleOrderTransportReducer from 'slices/saleOrderTransport';
import storeApplicationStore from 'slices/storeApplication';
import transportApplicationReducer from 'slices/transportApplication';
import warehouseDeliveringReducer from 'slices/warehouseDelivering';
import warehouseTransferReducer from 'slices/warehouseTransfer';
import warehousingBillLogsReducer from 'slices/warehousingBillLogsAppication';
import warehousingReducer from 'slices/warehousingslice';

const rootReducer = combineReducers({
  notification: notificationReducer,
  entry: entryReducer,
  debtSupplier: debtSupplierReducer,
  saleOrder: saleOrderReducer,
  saleOrderReturn: saleOrderReturnReducer,
  storeApplication: storeApplicationStore,
  warehouseTransfer: warehouseTransferReducer,
  productApplication: productApplicationReducer,
  products: productsReducer,
  masterData: masterDataReducer,
  wareHousing: warehousingReducer,
  draftTicket: draftTicketReducer,
  warehousingBillLogsAppication: warehousingBillLogsReducer,
  warehouseDelivering: warehouseDeliveringReducer,
  paymentReceipt: paymentReceiptReducer,
  orderTransport: orderTransportReducer,
  saleOrderLine: saleOrderLineReducer,
  productCategory: productCategoryReducer,
  debtCustomer: debtCustomerReducer,
  inventory: inventoryReducer,
  saleOrderTransport: saleOrderTransportReducer,
  billCustomerApplication: billCustomerApplicationReducer,
  customer: customerReducer,
  debtReminderLog: debtReminderLogReducer,
  transportApplication: transportApplicationReducer,
  purchaseHistory: purchaseHistoryReducer,
  priceTable: priceTableReducer,
  productModificationHistory: productModificationHistoryReducer,
});

export default rootReducer;
