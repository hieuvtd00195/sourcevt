import Loadable from 'components/Loadable';
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

// Inventory
const List = Loadable(lazy(() => import('views/ImportExportWarehouse/index')));
const Import = Loadable(
  lazy(() => import('views/ImportExportWarehouse/Bill/ImportBill'))
);
const Export = Loadable(
  lazy(() => import('views/ImportExportWarehouse/Bill/ExportBill'))
);
const EditOther = Loadable(
  lazy(() => import('views/ImportExportWarehouse/Bill/EditOther'))
);
const EditImex = Loadable(
  lazy(
    () => import('views/ImportExportWarehouse/ImexProducts/EditImexProducts')
  )
);
const UpdateBill = Loadable(
  lazy(() => import('views/ImportExportWarehouse/Bill/UpdateBill'))
);
const DetailBill = Loadable(
  lazy(() => import('views/ImportExportWarehouse/Bill/DetailBill'))
);
// const Edit = Loadable(lazy(() => import('views/ImportExportWarehouse/Bill/')));
const OrderSlip = Loadable(lazy(() => import('views/Inventory/OrderSlip')));
const AddOrderSlip = Loadable(
  lazy(() => import('views/Inventory/OrderSlip/AddOrderSlip'))
);
const AddUnderselling = Loadable(
  lazy(() => import('views/Inventory/Underselling/AddUnderselling'))
);
const DetailOrderSlip = Loadable(
  lazy(() => import('views/Inventory/OrderSlip/DetailOrderSlip'))
);

const EditOrderSlip = Loadable(
  lazy(() => import('views/Inventory/OrderSlip/EditOrderSlip'))
);

const EditOrderTransport = Loadable(
  lazy(() => import('views/Inventory/BillLading/EditOrderTransport'))
);

const ImportExport: RouteObject = {
  path: 'inventory',
  element: <Outlet />,
  children: [
    { index: true, element: <List /> },
    {
      path: 'bill',
      element: <Outlet />,
      children: [
        {
          path: 'import',
          element: <Import />,
        },
        {
          path: 'export',
          element: <Export />,
        },
        {
          path: 'edit/:id/:billType',
          element: <UpdateBill />,
        },
        {
          path: 'detail/:id/:billType',
          element: <DetailBill />,
        },
      ],
    },
    {
      path: 'imex',
      element: <Outlet />,
      children: [
        {
          path: 'edit/:id',
          element: <EditImex />,
        },
      ],
    },
    // {
    //   path: 'imex/edit',
    //   children: [{ index: true, element: <EditImex /> }],
    // },
    // {
    //   path: 'edit',
    //   children: [{ index: true, element: <Edit /> }],
    // },
    {
      path: 'order-slip',
      children: [
        { index: true, element: <OrderSlip /> },
        { path: 'add', element: <AddOrderSlip /> },
        { path: 'underselling/add', element: <AddUnderselling /> },
        { path: 'detail/:id', element: <DetailOrderSlip /> },
        { path: 'edit/:id', element: <EditOrderSlip /> },
        { path: 'orderTransport/edit/:id', element: <EditOrderTransport /> },
      ],
    },
  ],
};

export default ImportExport;
