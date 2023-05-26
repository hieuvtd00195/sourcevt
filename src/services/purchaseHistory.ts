import { IParamsSearchPurchaseHistory } from 'types/purchaseHistory';
import HttpClient from 'utils/HttpClient';

const API_SEARCH_PURCHASE_HISTORY =
  '/api/app/bill-customer-application/get-log-bill-by-id';

export const APISearchPurchaseHistory = async (
  params: IParamsSearchPurchaseHistory
) => {
  return HttpClient.post<IParamsSearchPurchaseHistory, any>(
    API_SEARCH_PURCHASE_HISTORY,
    params
  );
};
