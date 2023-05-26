export const __BASEURL__ = process.env.REACT_APP_BASE_URL || 'http://103.157.218.82:4000';

export const __AUTHEN_URL__ =
  process.env.REACT_APP_BASE_AUTHEN || 'http://localhost:3000';

export const __VERSION__ = process.env.REACT_APP_VERSION;
export const __TITLE__ = process.env.REACT_APP_TITLE;
export const __DEV__ = process.env.NODE_ENV === 'development';

export const AUTHEN_CLIENT_ID =
  process.env.REACT_APP_CLIENT_ID || 'VTECHERP_Swagger';
export const AUTHEN_SCOPE = process.env.REACT_APP_SCOPE || 'VTECHERP';

export const AUTHEN_GRANT_TYPE = process.env.REACT_APP_GRANT_TYPE || 'password';
