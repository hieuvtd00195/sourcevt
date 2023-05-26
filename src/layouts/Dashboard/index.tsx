import Box from '@mui/material/Box';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import Navigation from './Navigation';

const DashboardLayout = () => {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(true);

  const handleToggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  const handleToggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Header
        collapsed={collapsed}
        onToggleSidebar={handleToggleSidebar}
        onToggleCollapsed={handleToggleCollapsed}
      />
      <Navigation />
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default DashboardLayout;
