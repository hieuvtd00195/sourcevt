import Loadable from 'components/Loadable';
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

// Customers
const Expire = Loadable(lazy(() => import('views/Settings/Expire')));
const AddExpire = Loadable(lazy(() => import('views/Settings/AddExpire')));

const Settings: RouteObject = {
  path: 'setting',
  element: <Outlet />,
  children: [
    { path: 'expire', element: <Expire /> },
    { path: 'addexpire', element: <AddExpire /> },
  ],
};

export default Settings;
