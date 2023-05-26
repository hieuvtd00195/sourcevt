import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { useEffect, useState } from 'react';
import LocalStorage from 'utils/LocalStorage';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LogOutDialog from './components/LogOutDialog';
import jwt_decode from 'jwt-decode';

interface Props {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onToggleCollapsed: () => void;
}

const Header = (props: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<string>('');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(!openDialog);
  };

  useEffect(() => {
    const token = LocalStorage.get('accessToken');
    const decoded: any = jwt_decode(token);
    setUser(decoded?.given_name ?? 'N/A');
  }, [LocalStorage.get('accessToken')]);

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{ color: 'common.white', backgroundColor: '#f58a30' }}
    >
      <Container maxWidth="xxl">
        <Toolbar variant="dense">
          <List
            disablePadding
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: 1,
              height: 48,
            }}
          >
            <Badge badgeContent={3} color="primary">
              <NotificationsIcon sx={{ fontSize: '1.5rem', color: '#ffff' }} />
            </Badge>
            <Box>
              <IconButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems={'center'}
                  sx={{ pl: 2 }}
                >
                  <Avatar sx={{ borderRadius: '50%', width: 36, height: 36 }} />
                  <Typography variant="subtitle2" sx={{ color: '#fff' }}>
                    {user}
                  </Typography>
                  {open ? (
                    <ExpandLessIcon
                      sx={{
                        fontSize: '2rem',
                        color: '#ffff',
                      }}
                    />
                  ) : (
                    <ExpandMoreIcon
                      sx={{
                        fontSize: '2rem',
                        color: '#ffff',
                      }}
                    />
                  )}
                </Stack>
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <AutorenewIcon />
                  </ListItemIcon>
                  <ListItemText>Chuyển cửa hàng</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => setOpenDialog(true)}>
                  <ListItemIcon>
                    <PowerSettingsNewIcon sx={{ color: '#FF0303' }} />
                  </ListItemIcon>
                  <ListItemText>Đăng xuất</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </List>
        </Toolbar>
      </Container>
      <LogOutDialog open={openDialog} onClose={handleCloseDialog} />
    </AppBar>
  );
};

export default Header;
