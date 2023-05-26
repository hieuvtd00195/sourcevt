import Loadable from 'components/core/Loadable';
import PrivateRoute from 'components/core/PrivateRoute';
import RouteError from 'pages/Error/RouteError';
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import DashboardLayout from 'layouts/Dashboard';
import AccountingRoute from './Accounting';
import Category from './Category';
import Customers from './Customers';
import Inventory from './Inventory';
import Products from './Products';
import Report from './Report';
import Sales from './Sales';
import Warehouse from './Warehouse';
import History from './HistoryAccount';
import HistoryBillion from './HistoryBillion';
import Service from './Service';
import Setting from './Setting';

// Home
const Home = Loadable(lazy(() => import('views/Home')));

// Test
const Experiment = Loadable(lazy(() => import('views/Experiment')));

// Error
const NotFound = Loadable(lazy(() => import('views/Errors/NotFound')));
// Wrap MainLayout with PrivateRoute to enable authentication
const Main: RouteObject = {
  path: '/',
  element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
  errorElement: <RouteError />,
  children: [
    {
      errorElement: <RouteError />,
      children: [
        { index: true, element: <Home /> },
        {
          path: '/experiment',
          element: <Experiment />,
        },
        Products,
        AccountingRoute,
        Warehouse,
        Report,
        Customers,
        Sales,
        Category,
        Inventory,
        History,
        HistoryBillion,
        Service,
        Setting,
      ],
    },
  ],
};

export default Main;
