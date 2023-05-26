import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import axios from 'axios';
import { __BASEURL__ } from 'config';
import DateTime from './DateTime';
import LocalStorage from './LocalStorage';
import MockAdapter from 'axios-mock-adapter';

const config: AxiosRequestConfig = {
  baseURL: __BASEURL__,
  headers: {
    'Content-Type': 'application/json',
    TimeZone: DateTime.TimeZone(),
  },
  timeout: 10 * 60 * 1000,
};

class Axios {
  private instance: AxiosInstance;
  private interceptor: number | null = null;

  constructor() {
    const instance = axios.create(config);

    // Request interceptor
    instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const accessToken = LocalStorage.get('accessToken');
        if (config.headers) {
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          } else {
            delete config.headers.Authorization;
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error?.response?.status === 401) {
          LocalStorage.clear();
          window.location.reload();
        }
        return Promise.reject(error);
      }
    );

    const interceptor = instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const accessToken = LocalStorage.get('accessToken');
        if (config.headers) {
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          } else {
            delete config.headers.Authorization;
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    this.interceptor = interceptor
    this.instance = instance;
  }

  public get Instance(): AxiosInstance {
    return this.instance;
  }
  private ejectInterceptor() {

    if (this.interceptor !== null) {

      this.instance.interceptors.response.eject(this.interceptor);

      this.interceptor = null;

    }

  }
  // Create
  public post<D = any>(url: string): Promise<D>;
  public post<D = any, R = any>(
    url: string,
    data: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  public post<D = any, R = any>(
    url: string,
    data: D,
    config: AxiosRequestConfig<D> & { integrity: true }
  ): Promise<AxiosResponse<R, D>>;
  public post<D, R>(url: string, data?: D, config: any = {}): Promise<unknown> {
    const { integrity, ...rest } = config;
    return new Promise((resolve, reject) => {
      this.Instance.post<D, AxiosResponse<R>>(url, data, rest)
        .then((response) => resolve(integrity ? response : response.data))
        .catch((error: AxiosError) => reject(error.response?.data));
    });
  }

  // Read
  public get<T = any, R = T, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return new Promise((resolve, reject) => {
      this.Instance.get<T, AxiosResponse<R>, D>(url, config)
        .then((response) => resolve(response.data))
        .catch((error: AxiosError) => reject(error.response?.data));
    });
  }

  // Update
  public put<D = any, R = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return new Promise((resolve, reject) => {
      this.Instance.put<D, AxiosResponse<R>>(url, data, config)
        .then((response) => resolve(response.data))
        .catch((error: AxiosError) => reject(error.response?.data));
    });
  }

  // Delete
  public delete<D = any, R = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return new Promise((resolve, reject) => {
      this.Instance.delete<D, AxiosResponse<R>>(url, config)
        .then((response) => resolve(response.data))
        .catch((error: AxiosError) => reject(error.response?.data));
    });
  }
  public pull<T = any, R = T>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    this.ejectInterceptor();
    return this.Instance.post<T, R>(url, data, config);

  }
}

const HttpClient = new Axios();

// export const mock = new MockAdapter(HttpClient.Instance, {
//   delayResponse: 1000,
// });

export default HttpClient;
