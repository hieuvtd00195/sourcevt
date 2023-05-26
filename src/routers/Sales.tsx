import Loadable from 'components/Loadable';
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

// Sales
const Retail = Loadable(lazy(() => import('views/Sale/Retail')));
const EditRetail = Loadable(lazy(() => import('views/Sale/Retail/CRUD/Edit')));
const CreateRetail = Loadable(
  lazy(() => import('views/Sale/Retail/CRUD/Create'))
);
const OrderTransport = Loadable(
  lazy(() => import('views/Sale/OrderTransport'))
);

const CreateOrderTransport = Loadable(
  lazy(() => import('views/Sale/OrderTransport/CRUD/Create'))
);

const UpdateOrderTransport = Loadable(
  lazy(
    () =>
      import('views/Sale/OrderTransport/UpdateOrderTransport/UpdateTransport')
  )
);

const Return = Loadable(lazy(() => import('views/Sale/Return')));
const CreateReturn = Loadable(
  lazy(() => import('views/Sale/Return/CRUD/Create'))
);
const EditReturn = Loadable(lazy(() => import('views/Sale/Return/CRUD/Edit')));
const DetailRetail = Loadable(
  lazy(() => import('views/Sale/Retail/CRUD/Detail'))
);
const Sales: RouteObject = {
  path: 'sales',
  element: <Outlet />,
  children: [
    { index: true, element: <div>Sales</div> },
    {
      path: 'retail',
      element: <Retail />,
    },
    {
      path: 'retail/edit/:id',
      element: <CreateRetail />,
    },
    {
      path: 'retail/create/:billPayStatus',
      element: <CreateRetail />,
    },
    { path: 'retail/detail/:id', element: <DetailRetail /> },
    {
      path: 'order-transport',
      element: <Outlet />,
      children: [
        {
          index: true,
          element: <OrderTransport />,
        },
        {
          path: 'create',
          element: <CreateOrderTransport />,
        },
        {
          path: 'update/:id',
          element: <UpdateOrderTransport />,
        },
      ],
    },
    { path: 'return', element: <Return /> },
    { path: 'return/create/:billPayStatus', element: <CreateReturn /> },
    { path: 'return/edit/:id', element: <CreateReturn /> },
    // { path: 'return/edit/:id', element: <EditReturn /> },
  ],
};

export default Sales;
