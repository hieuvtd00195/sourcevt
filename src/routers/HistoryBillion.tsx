import Loadable from 'components/Loadable';
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const List = Loadable(lazy(() => import('views/HistoryBillion')));

const History: RouteObject = {
  path: 'billion',
  element: <Outlet />,
  children: [{ index: true, element: <List /> }],
};

export default History;
