import {
  ICreateDebtReminderHistory,
  IParamsGetListDebtReminderHistory,
  IResGetListDebtReminderHistory,
} from 'types/debtReminderLog';
import DateFns from 'utils/DateFns';
import HttpClient from 'utils/HttpClient';

const CREATE_DEBT_REMINDER_LOG_API = '/api/app/DebtReminderLog/Add';
const GET_LIST_DEBT_REMINDER_LOG_API = '/api/app/DebtReminderLog/GetList';
const EXPORT_DEBT_REMINDER_HISTORY_API =
  '/api/app/DebtReminderLog/ExportDebtReminderLog';

export const APICreateDebtReminderLog = async (
  data: ICreateDebtReminderHistory
) => {
  return HttpClient.post<any>(CREATE_DEBT_REMINDER_LOG_API, {
    ...data,
    payDate: DateFns.Format(data.payDate, 'yyyy-MM-dd'),
  });
};

export const APIGetListDebtReminderHistory = async (
  filter: IParamsGetListDebtReminderHistory
) => {
  return HttpClient.post<any, IResGetListDebtReminderHistory>(
    GET_LIST_DEBT_REMINDER_LOG_API,
    {
      ...filter,
      payDateFrom: DateFns.Format(filter.payDateFrom, 'yyyy-MM-dd'),
      payDateTo: DateFns.Format(filter.payDateTo, 'yyyy-MM-dd'),
    }
  );
};

export const APIExportDebtReminderHistory = async (params: any) => {
  return HttpClient.pull<typeof params, any>(
    EXPORT_DEBT_REMINDER_HISTORY_API,
    params,
    {
      responseType: 'blob',
    }
  );
};
