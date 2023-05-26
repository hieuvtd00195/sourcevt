import { PaginationParams } from './common';

export interface ICreateDebtReminderHistory {
  payDate: Date | null;
  content: string | null;
  customerId: string | null;
  phoneNumber: string | null;
  handlerStoreName: string | null;
  handlerEmployeeName: string | null;
  handlerStoreNames: string | null;
}

export interface IDebtReminderLog {
  code: string | null;
  createName: string | null;
  createTime: string | null;
  payDate: string | null;
  customerName: string | null;
  customerPhone: string | null;
  handlerEmployeeName: string | null;
  content: string | null;
  handlerStoreName: string | null;
  handlerStoreNames: string | null;
}

export interface IParamsGetListDebtReminderHistory extends PaginationParams {
  payDateFrom: string | null;
  payDateTo: string | null;
  code: string | null;
  customerId: string | null;
  creatorId: string | null;
  handlerEmployeeId: string | null;
  handlerStoreIds: string[];
}

export interface IResGetListDebtReminderHistory {
  total: number | null;
  data: IDebtReminderLog[];
}
