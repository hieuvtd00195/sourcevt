import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';

interface IProps {
  handleOpenImportProduct: any;
}

const CreateCustomerButton = (props: IProps) => {
  const { handleOpenImportProduct } = props;
  return (
    <Box sx={{ margin: '2px' }}>
      <ProMenu
        position="left"
        items={[
          {
            label: 'Thêm bảng giá',
            value: 1,
            actionType: 'add',
          },
          {
            label: 'Nhập sản phẩm vào bảng giá',
            value: 2,
            actionType: 'add',
            onSelect: handleOpenImportProduct
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
