import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';

const CreateCustomerButton = () => {
  return (
    <Box sx={{ margin: '2px' }}>
      <ProMenu
        position="left"
        items={[
          {
            label: 'Thêm mới hóa đơn bán hàng',
            value: 1,
            actionType: 'add',
          },
          {
            label: 'Thêm mới trả hàng',
            value: 2,
            actionType: 'add',
          },
        ]}
      >
        <ActionButton
        // onClick={handleSubmitFilters}
        >
          Thêm mới
          <ExpandMoreIcon />
        </ActionButton>
      </ProMenu>
    </Box>
  );
};

export default CreateCustomerButton;
