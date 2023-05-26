import Loadable from 'components/Loadable';
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

// History edit, delete
const List = Loadable(lazy(() => import('views/HistoryAccount')));
// const HistoryTable = Loadable(
//   lazy(() => import('views/Warehouse/CreateWarehouse'))
// );

const History: RouteObject = {
  path: 'history',
  element: <Outlet />,
  children: [{ index: true, element: <List /> }],
};

export default History;
