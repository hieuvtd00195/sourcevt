import axios from 'axios';
import { __AUTHEN_URL__ } from 'config';
import LocalStorage from 'utils/LocalStorage';

interface IAuthenLogin {
  username: string;
  password: string;
  client_id: string;
  grant_type: string;
}

interface SignInResponse {
  access_token: string | null;
  expires_in: number | null;
  token_type: string | null;
}
const axiosClientLogin = axios.create({
  baseURL: __AUTHEN_URL__,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    withToken: false,
  },
});

axiosClientLogin.interceptors.request.use((config) => {
  const token = LocalStorage.get('accessToken');
  if (token) {
    // @ts-ignore
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClientLogin.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response;
    }
    return response;
  },
  (error) => {
    throw error;
  }
);

class AuthService {
  login(params: IAuthenLogin) {
    const paramsConvert: any = params;
    const data = Object.keys(paramsConvert)
      .map((key, index) => `${key}=${encodeURIComponent(paramsConvert[key])}`)
      .join('&');
    return axiosClientLogin.post<typeof params, SignInResponse>(
      `/connect/token`,
      data
    );
  }
}

export default new AuthService();
