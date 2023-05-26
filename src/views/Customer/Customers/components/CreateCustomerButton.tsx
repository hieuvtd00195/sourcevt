import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import { useNavigate } from 'react-router-dom';

const CreateCustomerButton = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ margin: '2px' }}>
      <ProMenu
        position="left"
        items={[
          {
            label: 'Thêm mới',
            value: 1,
            actionType: 'add',
            onSelect: () => {
              navigate('/customers/create');
            },
          },
          {
            label: 'Nhập từ Excel',
            value: 2,
            actionType: 'description',
          },
        ]}
      >
        <ActionButton
          variant="contained"
          color="primary"
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
