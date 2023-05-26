import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import ActionButton from 'components/ProButton/ActionButton';
import DialogContainer from 'components/ProDialog/DialogContainer';
import DialogContent from 'components/ProDialog/DialogContent';
import ProForm from 'components/ProForm';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormHeader from 'components/ProForm/ProFormHeader';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import ProFormRadio from 'components/ProForm/ProFormRadio';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { useForm } from 'react-hook-form';
import Validation from 'utils/Validation';
import { IImportTable } from './utils/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

const schema = Validation.shape({
  type: Validation.select(1),
});

const AddNewCategory = (props: Props) => {
  const { open, onClose } = props;
  const form = useForm<IImportTable>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });
  const handleSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <DialogContainer open={open} onClose={onClose} maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
        <AddIcon />
        <Typography variant="h6">Thêm danh mục sản phẩm</Typography>
      </Box>
      <Divider />
      <DialogContent>
        <ProForm form={form} onFinish={handleSubmit}>
          <ProFormContent>
            <ProFormHeader>{'Thông tin cơ bản'}</ProFormHeader>
            <Grid container spacing={2} marginTop={1} marginBottom={1}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <ProFormLabel title={'Người phụ trách'} name="person" />
                <ProFormTextField name="person" />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}></Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <ProFormLabel title={'Tỷ lệ'} name="tyLe" />
                <ProFormTextField name="tyLe" />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}></Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <ProFormLabel title={'Tên'} name="name" />
                <ProFormTextField name="name" />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}></Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <ProFormLabel title={'Mã danh mục'} name="code" />
                <ProFormTextField name="code" />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}></Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <ProFormLabel title={'Thông tin bảo hành'} name="ttbh" />
                <ProFormTextField multiline rows={4} name="ttbh" />
              </Grid>
            </Grid>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2} marginTop={1} marginBottom={1}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <ProFormLabel title={'Sau khi lưu dữ liệu'} name="code" />
                  <ProFormRadio
                    name="afterSave"
                    options={[
                      { value: 1, label: 'Tiếp tục thêm danh mục' },
                      { value: 2, label: 'Hiển thị danh mục' },
                    ]}
                  />
                </Grid>
              </Grid>
            </Box>
          </ProFormContent>
          <Box sx={{ p: 2 }}>
            <Stack direction="row" spacing={1}>
              <ActionButton actionType="save" type="submit">
                Lưu
              </ActionButton>
            </Stack>
          </Box>
        </ProForm>
      </DialogContent>
    </DialogContainer>
  );
};

export default AddNewCategory;
