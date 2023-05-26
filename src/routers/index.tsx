import { createBrowserRouter } from 'react-router-dom';

// Routes
import Auth from './Auth';
import Main from './Main';

const router = createBrowserRouter([
  Auth,
  Main,
  // Fallback
]);

export default router;

// import Loadable from 'components/Loadable';
// import DashboardLayout from 'layouts/Dashboard';
// import { lazy } from 'react';
// import type { RouteObject } from 'react-router-dom';
// import { Outlet, useRoutes } from 'react-router-dom';
// // Pages
// import AccountingRoute from './Accounting';
// import Category from './Category';
// import Customers from './Customers';
// import Inventory from './Inventory';
// import Products from './Products';
// import Report from './Report';
// import Sales from './Sales';
// import Warehouse from './Warehouse';
// import History from './HistoryAccount';
// import HistoryBillion from './HistoryBillion';
// import Service from './Service';
// import Setting from './Setting';

// // Home
// const Home = Loadable(lazy(() => import('views/Home')));

// // Test
// const Experiment = Loadable(lazy(() => import('views/Experiment')));

// // Error
// const NotFound = Loadable(lazy(() => import('views/Errors/NotFound')));

// const routes: RouteObject[] = [
//   {
//     path: '/',
//     element: <DashboardLayout />,
//     children: [
//       { index: true, element: <Home /> },
//       {
//         path: '/experiment',
//         element: <Experiment />,
//       },
//       Products,
//       AccountingRoute,
//       Warehouse,
//       Report,
//       Customers,
//       Sales,
//       Category,
//       Inventory,
//       History,
//       HistoryBillion,
//       Service,
//       Setting,
//     ],
//   },

//   {
//     path: '*',
//     element: <Outlet />,
//     children: [
//       { index: true, element: <NotFound /> },
//       { path: '*', element: <NotFound /> },
//     ],
//   },
// ];

// const Routers = () => {
//   const element = useRoutes(routes);
//   return element;
// };

// export default Routers;
