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
            label: 'Xóa các sản phẩm đã chọn',
            value: 1,
            actionType: 'delete',
          },
          {
            label: 'Xuất Excel',
            value: 2,
            actionType: 'excel',
          },
        ]}
      >
        <ActionButton
          variant="contained"
          color="info"
          onClick={() => console.log('abc')}
        >
          Thao tác
          <ExpandMoreIcon />
        </ActionButton>
      </ProMenu>
    </Box>
  );
};

export default ActionButtonComponent;
