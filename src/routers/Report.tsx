import Loadable from 'components/Loadable';
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

// Revenue
const ReportRevenueDepot = Loadable(
  lazy(() => import('views/Report/Revenue/Depot'))
);
const ReportRevenueStaff = Loadable(
  lazy(() => import('views/Report/Revenue/Staff'))
);
const ReportRevenueCustomer = Loadable(
  lazy(() => import('views/Report/Revenue/Customer'))
);

// Accounting
const BusinessResult = Loadable(
  lazy(() => import('views/Report/Accounting/BusinessResult'))
);

const BalanceSheet = Loadable(
  lazy(() => import('views/Report/Accounting/BalanceSheet'))
);

const Account = Loadable(lazy(() => import('views/Report/Accounting/Account')));
const ByStore = Loadable(
  lazy(() => import('views/Report/AccountingInReport/SumaryCashByStore'))
);
const InventoryByProducts = Loadable(
  lazy(() => import('views/Report/Inventory/ByProducts'))
);

const NewCustomer = Loadable(
  lazy(() => import('views/Report/Customer/NewCustomer'))
);
// Product
const SellByStore = Loadable(
  lazy(() => import('views/Report/Product/SellingByStore/SellingByStoreTable'))
);

// Customer
const ByProducts = Loadable(
  lazy(() => import('views/Report/Customer/ByProducts'))
);

const Report: RouteObject = {
  path: 'report',
  element: <Outlet />,
  children: [
    { index: true, element: <div>Report</div> },
    {
      path: 'revenue',
      element: <Outlet />,
      children: [
        { index: true, element: <div>Revenue</div> },
        { path: 'depot', element: <ReportRevenueDepot /> },
        { path: 'staff', element: <ReportRevenueStaff /> },
        { path: 'customer', element: <ReportRevenueCustomer /> },
      ],
    },
    {
      path: 'accounting',
      element: <Outlet />,
      children: [
        { path: 'businessresult', element: <BusinessResult /> },
        { path: 'balancesheet', element: <BalanceSheet /> },
        { path: 'account', element: <Account /> },
        { path: 'store', element: <ByStore /> },
      ],
    },
    {
      path: 'customer',
      element: <Outlet />,
      children: [
        {
          path: 'newCustomer',
          element: <NewCustomer />,
        },
      ],
    },
    {
      path: 'product',
      element: <Outlet />,
      children: [{ path: 'sellByStore', element: <SellByStore /> }],
    },
    {
      path: 'customer',
      element: <Outlet />,
      children: [{ path: 'byproduct', element: <ByProducts /> }],
    },
    {
      path: 'inventory',
      element: <Outlet />,
      children: [
        {
          path: 'index',
          element: <InventoryByProducts />,
        },
      ],
    },
  ],
};

export default Report;
