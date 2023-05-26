import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { HEADER_HEIGHT } from 'constants/layouts';
import useUser from 'hooks/useUser';
import { useContext } from 'react';
import { CollapseContext } from '.';

const Profile = () => {
  const collapsed = useContext(CollapseContext);
  const user = useUser();

  if (collapsed) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: HEADER_HEIGHT,
        }}
      >
        <Avatar>Đ</Avatar>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 3.5,
        pt: 1.25,
      }}
    >
      <Avatar>N/A</Avatar>
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
        <Typography variant="subtitle2">{user.fullName}</Typography>
        <Typography variant="caption">Administrator</Typography>
      </Box>
    </Box>
  );
};

export default Profile;
