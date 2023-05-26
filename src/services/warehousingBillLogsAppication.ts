import { WarehousingBillLogs } from 'types/warehousingBillLogs';
import HttpClient from 'utils/HttpClient';

interface WarehousingBillLogsResponse {
  data: WarehousingBillLogs[];
  total: number;
}
interface WarehousingBillLogsParams {
  [key: string]: any;
}

const WAREHOUSING_BILL_LOGS_SEARCH_API =
  '/api/app/warehousing-bill-logs/Search';
const WAREHOUSING_BILL_LOGS_BY_ID_API = '/api/app/warehousing-bill-logs/Get';

export const APISearchWareHousingBillLogs = async (
  params: WarehousingBillLogsParams
) => {
  return HttpClient.post<typeof params, WarehousingBillLogsResponse>(
    WAREHOUSING_BILL_LOGS_SEARCH_API,
    params
  );
};

export const APIGetWareHousingBillLogById = async (
  params: WarehousingBillLogsParams
) => {
  return HttpClient.get<typeof params, any>(
    WAREHOUSING_BILL_LOGS_BY_ID_API,
    {
      params: params,
    }
  );
};
