export const Endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refreshToken: '/auth/refreshToken',
  },
  user: {
    profile: '/user',
  },
  country: {
    search: '/country/list',
  },
  inventory: {
    search: '/inventory/list',
  },
  employee: {
    search: '/employee/search',
    detail: '/employee/get',
    create: '/employee/create',
    update: '/employee/update',
    delete: '/employee/delete',
    status: '/employee/status',
  },
  products: {
    search: '/product/search',
    detail: '/product/detail',
    create: '/product/create',
    update: '/product/update',
    disable: '/product/disable',
    delete: '/product/delete',
  },
  accountings: {
    search: '/accounting/transaction/list',
    create: '/accounting/transaction/create',
    update: '/accounting/transaction/update',
    get: '/accounting/transaction/get',
    detail: '/accounting/transaction/detail',
    delete: '/accounting/transaction/delete',
    log: '/accounting/transaction/log',
    logDetail: '/accounting/transaction/log/detail',
  },
  saleorders: {
    search: '/inventory/order-slip',
    create: '/inventory/order-slip/create',
    getById: '/inventory/order-slip/detail/:id',
    update: '/inventory/order-slip/update',
  },
  saleOrderReturn: {
    search: '/saleOrder/return/create',
    create: '/saleOrder/return/create',
    getById: '/saleOrder/return/detail/:id',
    update: '/saleOrder/return/update',
  },
  warehouseTransfer: {
    create: '/warehouseTransferBill/AddWarehouseTransferBill',
    detail: '/warehouseTransferBill/DetailWarehouseTransferBill',
    upload: '/warehouseTransferBill/UploadWarehouseTransferBill',
    delete: '/warehouseTransferBill/DeleteWarehouseTransferBill',
  },
  debtSupplier: {
    search: '/debtSupplier/search',
    detail: '/debtSupplier/detail',
  },
  debtReminderLog: {
    search: '/debtReminderLog/search',
  },
  draftTicket: {
    create: '/draftTicket/create',
    search: '/draftTicket/search',
    delete: '/draftTicket/delete',
    get: '/draftTicket/get',
    approve: '/draftTicket/approve',
  },
  customer: {
    getCustomerSelectApi: '/customer/getCustomerSelectApi',
    getCustomerListApi: '/customer/getCustomerListApi',
  },
  purchaseHistory: {
    search: '/purchaseHistory/search',
  },
  productModificationHistory: {
    search: '/productModificationHistory/search',
  },
} as const;
