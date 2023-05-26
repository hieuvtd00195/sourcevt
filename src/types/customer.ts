import { PaginationParams } from './common';

export interface Customer {
  id: number | string;
  customer: string;
  address: string;
  typeCustomer: string;
  phoneNumber: string | null;
  email: string | null;
  birthDay: Date | null;
  level: string | null;
  group: string | null;
  totalMoney: number;
  point: number | null;
  numberPurchase: number | null;
  daysPurchase: number | null;
  daysNotPurchase: number | null;
  lastDatePurchase: Date | null;
  amount: number | null;
  note: string | null;
  buyingCycle: string | number | null;
  store: string | null;
  [key: string]: any;
}

export interface PersonInCharge {
  id: number;
  fullName: string;
}

export interface CustomerDetails {
  address: string;
  createdAt: string;
  createdBy: string;
  dateOfBirth: null;
  email: string;
  fullName: string;
  gender: number;
  id: number;
  imageUrl: string;
  mobile: string;
  personInCharge: number | null;
  roles: [];
  status: number;
  updatedAt: string;
  updatedBy: string;
  userCode: string;
  username: string;
  feeRatio: string;
  shippingCostJpToVn: string;
  addess: string;
}

export interface ICustomer {
  name: string | null;
  customerType: number | null;
  provinceId: string | null;
  districtId: string | null;
  wardId: string | null;
  address: string | null;
  phoneNumber: string | null;
  dateOfBirth: Date | null;
  gender: number | null;
  debtGroup: number | null;
  debtLimit: number | null;
  handlerEmployeeId: string | null;
  supportEmployeeId: string | null;
  handlerStoreId: string | null;
  zalo: string | null;
  facebook: string | null;
  note: string | null;
  code: string | null;
  customerTypeName: string | null;
  provinceName: string | null;
  districtName: string | null;
  wardName: string | null;
  genderName: string | null;
  debtGroupName: string | null;
  handlerEmployeeName: string | null;
  supportEmployeeName: string | null;
  handlerStoreName: string | null;
  firstPurchaseDate: Date | null;
  lastPurchaseDate: Date | null;
  totalPurchaseAmount: number | null;
  numberOfPurchaseTime: number | null;
  purchaseQuantity: number | null;
  purchaseCycle: number | null;
  nonPurchaseDays: number | null;
  addressDetail: string | null;
  id: string | null;
  creatorId: string | null;
  creatorName: string | null;
  creationTime: string | null;
  lastModifierId: string | null;
  lastModifierName: string | null;
  lastModificationTime: string | null;
  isActive: boolean | null;
  isEditable: boolean | null;
  isDeletable: boolean | null;
}

export interface ISearchCustomer extends PaginationParams {
  id: string | null;
  customerIds: string[] | null;
  customerType: number | null;
  supportEmployeeId: string | null;
  handlerEmployeeId: string | null;
  debtGroup: number | null;
  handlerStoreId: string | null;
  gender: number | null;
  provinceId: string | null;
  firstPurchaseDateFrom: Date | null;
  firstPurchaseDateTo: Date | null;
  lastPurchaseDateFrom: string | null;
  lastPurchaseDateTo: string | null;
  nonPurchaseDaysFrom: number | null;
  nonPurchaseDaysTo: number | null;
  purchaseCycleFrom: number | null;
  purchaseCycleTo: number | null;
}

export interface IResSearchCustomer {
  total: 9;
  data: ICustomer[];
}

export interface ICustomerSelect {
  id: string | null;
  code: string | null;
  name: string | null;
  phone: string | null;
  value: string | null;
}

export interface ICustomerByTypeResponse {
  httpStatusCode: number;
  success: boolean;
  message: string;
  data: ICustomerByType[];
}

export interface ICustomerByType {
  id: string;
  name: string;
}
