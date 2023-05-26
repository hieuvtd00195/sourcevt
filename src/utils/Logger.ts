import type { AxiosError, AxiosResponse } from 'axios';
import { __DEV__ } from 'config';
import { setResponse } from 'slices/notification';
import store from 'store';

class Logger {
  public log(...args: any[]) {
    if (__DEV__) {
      console.log(...args);
    }
  }

  public response(response: AxiosResponse) {
    return response.data;
  }

  public error(error: AxiosError) {
    store.dispatch({
      type: setResponse.type,
      payload: error.response?.data,
    });

    return Promise.reject(error.response?.data);
  }
}

export default new Logger();
