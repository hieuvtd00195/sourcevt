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
            label: 'Gửi SMS cho khách hàng',
            value: 1,
            actionType: 'sms',
          },
          {
            label: 'Gửi email cho khách hàng',
            value: 2,
            actionType: 'email',
          },
          {
            label: 'Gắn nhãn các khách hàng đã chọn',
            value: 3,
            actionType: 'tag',
          },
          {
            label: 'Cập nhật nhóm khách hàng',
            value: 4,
            actionType: 'edit',
          },
          {
            label: 'Tặng điểm',
            value: 5,
            actionType: 'upload',
          },
          {
            label: 'Trừ điểm',
            value: 6,
            actionType: 'download',
          },
          {
            label: 'Tặng tiền tích lũy',
            value: 7,
            actionType: 'money',
          },
          {
            label: 'Trừ tiền tích lũy',
            value: 8,
            actionType: 'money',
          },
          {
            label: 'Gọi điện',
            value: 9,
            actionType: 'phone',
          },
          {
            label: 'Nhắn tin',
            value: 10,
            actionType: 'sms',
          },
          {
            label: 'Gửi email',
            value: 11,
            actionType: 'email',
          },
          {
            label: 'Nhận cuộc gọi',
            value: 12,
            actionType: 'phone',
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
