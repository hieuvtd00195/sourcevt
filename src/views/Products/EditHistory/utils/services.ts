import HttpClient from 'utils/HttpClient';
import { ISearchProductModificationHistory } from './type';

const API_SEARCH_PRODUCT_MODIFICATION_HISTORY = 'TODO';

export const searchProductModificationHistory = (
  filters: ISearchProductModificationHistory
) => {
  return HttpClient.post<ISearchProductModificationHistory, any>(
    API_SEARCH_PRODUCT_MODIFICATION_HISTORY,
    filters
  );
};
