import Loadable from 'components/Loadable';
import { lazy } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

const OrderCOD = Loadable(lazy(() => import('views/Service/OrderCOD')));

const Category: RouteObject = {
  path: 'service',
  element: <Outlet />,
  children: [
    { index: true, element: <Outlet /> },
    {
      path: 'order-COD',
      children: [{ index: true, element: <OrderCOD /> }],
    },
  ],
};

export default Category;
