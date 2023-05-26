import { useContext } from 'react';
import { CollapseContext } from '.';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Logo = () => {
  const collapsed = useContext(CollapseContext);

  if (collapsed) {
    return null;
  }

  return (
    <Toolbar>
      <Typography>VSHIP</Typography>
    </Toolbar>
  );
};

export default Logo;
