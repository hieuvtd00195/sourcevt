import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box/Box';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';

const ActionButtonComponent = () => {
  return (
    <Box sx={{ margin: '2px' }}>
      <ProMenu
        position="left"
        items={[
          {
            label: 'Xuất Excel',
            value: 1,
            actionType: 'excel',
          },
          {
            label: 'Hiển thị tổng tất cả các trang',
            value: 2,
            actionType: 'view',
          },
          {
            label: 'In báo cáo',
            value: 3,
            actionType: 'print',
          },
        ]}
      >
        <ActionButton variant="contained" color="info">
          Thao tác
          <ExpandMoreIcon />
        </ActionButton>
      </ProMenu>
    </Box>
  );
};

export default ActionButtonComponent;
